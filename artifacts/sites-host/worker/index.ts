import { SubmitMemoryBody, ModerateMemoryBody, ListMemoriesResponse, ListAdminMemoriesResponse } from "@workspace/api-zod";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMIN_EMAIL?: string;
  RATE_LIMIT_SECRET?: string;
}

const privateColumns = `id, name, relationship, email, prompt_key AS promptKey,
  memory_text AS memoryText, status, created_at AS createdAt, reviewed_at AS reviewedAt`;
const publicColumns = `id, name, relationship, prompt_key AS promptKey, memory_text AS memoryText`;
const noStore = { "Cache-Control": "private, no-store", "Vary": "Cookie" };
const json = (value: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...noStore, ...extra } });
const error = (status: number, message: string) => json({ error: message }, status);

function identity(request: Request) {
  const id = request.headers.get("oai-authenticated-user-id");
  const email = request.headers.get("oai-authenticated-user-email");
  return id && email ? { id, email } : null;
}
function isAdmin(request: Request, env: Env) {
  const user = identity(request);
  // Only dispatch-authenticated identity plus the securely configured owner email.
  // A ChatGPT account by itself never grants moderation access.
  return Boolean(user && env.ADMIN_EMAIL && user.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase());
}
function crossOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  return request.headers.get("Sec-Fetch-Site") === "cross-site" ||
    Boolean(origin && origin !== new URL(request.url).origin);
}
async function body(request: Request) {
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) return null;
  // Enforce the limit during streaming, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 16384) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { return null; }
}
async function limit(request: Request, env: Env) {
  if (!env.RATE_LIMIT_SECRET) throw new Error("Rate limiter is not configured");
  // CF-Connecting-IP is set by Cloudflare, never X-Forwarded-For from a visitor.
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.RATE_LIMIT_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const hash = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip));
  const digest = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, "0")).join("");
  const window = Math.floor(Date.now() / 900000);
  // UPSERT/RETURNING is atomic across isolates; cleanup keeps bounded state.
  const result = await env.DB.batch([
    env.DB.prepare("DELETE FROM rate_limits WHERE window < ?").bind(window - 1),
    env.DB.prepare(`INSERT INTO rate_limits (key, window, count) VALUES (?, ?, 1)
      ON CONFLICT(key, window) DO UPDATE SET count = count + 1 RETURNING count`).bind(digest, window),
  ]);
  return Number((result[1].results[0] as { count: number }).count) <= 5;
}

async function api(request: Request, env: Env, pathname: string): Promise<Response> {
  const method = request.method;
  if (pathname === "/api/healthz" && method === "GET") {
    await env.DB.prepare("SELECT id FROM memories LIMIT 1").all();
    return json({ status: "ok" });
  }
  if (pathname.startsWith("/api/admin/")) {
    if (!["GET", "HEAD", "OPTIONS"].includes(method) && crossOrigin(request)) return error(403, "בקשה לא מורשית");
    if (pathname === "/api/admin/session" && method === "GET")
      return json({ authenticated: isAdmin(request, env), configured: Boolean(env.ADMIN_EMAIL) });
    if (!isAdmin(request, env)) return error(401, "נדרשת התחברות לניהול");
    if (pathname === "/api/admin/session" && method === "POST")
      return json({ authenticated: true, configured: true });
    if (pathname === "/api/admin/session" && method === "DELETE")
      // Actual sign-out is a top-level navigation to dispatch, never a local session.
      return error(405, "יש להתנתק דרך קישור ההתנתקות");
    if (pathname === "/api/admin/memories" && method === "GET") {
      const { results } = await env.DB.prepare(`SELECT ${privateColumns} FROM memories ORDER BY created_at DESC, id DESC`).all();
      return json(ListAdminMemoriesResponse.parse(results));
    }
    const match = pathname.match(/^\/api\/admin\/memories\/([1-9]\d*)$/);
    if (match && ["PATCH", "DELETE"].includes(method)) {
      const id = Number(match[1]);
      if (!Number.isSafeInteger(id)) return error(400, "בקשה לא תקינה");
      if (method === "DELETE") {
        const result = await env.DB.prepare("DELETE FROM memories WHERE id = ? RETURNING id").bind(id).all();
        return result.results.length ? new Response(null, { status: 204, headers: noStore }) : error(404, "הזיכרון לא נמצא");
      }
      const parsed = ModerateMemoryBody.safeParse(await body(request));
      if (!parsed.success) return error(400, "בקשה לא תקינה");
      const now = new Date().toISOString();
      const result = await env.DB.prepare("UPDATE memories SET status = ?, updated_at = ?, reviewed_at = ? WHERE id = ? RETURNING id")
        .bind(parsed.data.status, now, parsed.data.status === "pending" ? null : now, id).all();
      return result.results.length ? json({ message: "הזיכרון עודכן" }) : error(404, "הזיכרון לא נמצא");
    }
    return error(404, "לא נמצא");
  }
  if (pathname === "/api/memories" && method === "GET") {
    const { results } = await env.DB.prepare(`SELECT ${publicColumns} FROM memories WHERE status = 'approved' ORDER BY created_at DESC, id DESC`).all();
    return json(ListMemoriesResponse.parse(results));
  }
  if (pathname === "/api/memories" && method === "POST") {
    if (crossOrigin(request)) return error(403, "בקשה לא מורשית");
    if (!await limit(request, env)) return json({ error: "נשלחו בקשות רבות. נסו שוב בעוד מספר דקות." }, 429, { "Retry-After": "900" });
    const raw = await body(request);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return error(400, "בקשה לא תקינה");
    for (const field of ["name", "relationship", "memoryText", "email"]) {
      if (typeof raw[field] === "string") raw[field] = raw[field].trim();
    }
    if (raw.email === "") delete raw.email;
    const parsed = SubmitMemoryBody.safeParse(raw);
    if (!parsed.success || parsed.data.website) return error(400, "יש לבדוק את הפרטים ולאשר את הסכמת הפרסום.");
    const data = parsed.data;
    const now = new Date().toISOString();
    await env.DB.prepare(`INSERT INTO memories (name, relationship, email, prompt_key, memory_text, consent, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, 'pending', ?, ?)`)
      .bind(data.name, data.relationship, data.email ?? null, data.promptKey, data.memoryText, now, now).run();
    return json({ message: "תודה ששיתפת זיכרון מרועי ❤️\nהזיכרון נשלח לאישור לפני הפרסום באתר." }, 201);
  }
  return error(404, "לא נמצא");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api" || url.pathname.startsWith("/api/")) return await api(request, env, url.pathname);
      if (url.pathname === "/admin" || url.pathname === "/admin/") {
        if (!identity(request)) return new Response(null, { status: 302, headers: { ...noStore, Location: "/signin-with-chatgpt?return_to=%2Fadmin" } });
        if (!isAdmin(request, env)) return error(403, "אין הרשאה לניהול האתר");
        const response = await env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
        const headers = new Headers(response.headers);
        for (const [key, value] of Object.entries(noStore)) headers.set(key, value);
        headers.set("X-Robots-Tag", "noindex, nofollow");
        return new Response(response.body, { status: response.status, headers });
      }
      if (!["GET", "HEAD"].includes(request.method)) return error(405, "בקשה לא תקינה");
      const path = url.pathname === "/" ? "/index.html" : url.pathname;
      const response = await env.ASSETS.fetch(new Request(new URL(path, url), request));
      if (response.status === 404 && !url.pathname.split("/").pop()?.includes(".")) {
        const page = await env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
        return new Response(page.body, { status: 404, headers: page.headers });
      }
      return response;
    } catch (cause) {
      // Never log bodies, email, secrets, or raw IP addresses.
      console.error("Memorial request failed", url.pathname, cause instanceof Error ? cause.message : "unknown error");
      return error(503, "השירות אינו זמין כרגע. נסו שוב בעוד רגע.");
    }
  },
};
