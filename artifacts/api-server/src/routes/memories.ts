import { Router, type IRouter } from "express";
import { rateLimit } from "express-rate-limit";
import { desc, eq } from "drizzle-orm";
import { db, memories } from "@workspace/db";
import { SubmitMemoryBody, ListMemoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();
router.get("/memories", async (_req, res) => {
  const rows = await db.select({
    id: memories.id, name: memories.name, relationship: memories.relationship,
    promptKey: memories.promptKey, memoryText: memories.memoryText,
  }).from(memories).where(eq(memories.status, "approved")).orderBy(desc(memories.createdAt));
  res.json(ListMemoriesResponse.parse(rows));
});
router.post("/memories", rateLimit({
  windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false,
  message: {error:"נשלחו בקשות רבות. נסו שוב בעוד מספר דקות."},
}), async (req, res) => {
  const body = req.body && typeof req.body === "object" ? { ...req.body } : {};
  for (const field of ["name", "relationship", "memoryText", "email"]) {
    if (typeof body[field] === "string") body[field] = body[field].trim();
  }
  if (body.email === "") delete body.email;
  const parsed = SubmitMemoryBody.safeParse(body);
  if (!parsed.success || parsed.data.consent !== true) {
    res.status(400).json({error:"יש לבדוק את הפרטים ולאשר את הסכמת הפרסום."}); return;
  }
  const { website, ...data } = parsed.data;
  if (website) { res.status(400).json({error:"לא ניתן לשלוח את הטופס."}); return; }
  await db.insert(memories).values({...data, status:"pending"});
  res.status(201).json({message:"תודה ששיתפת זיכרון מרועי ❤️\nהזיכרון נשלח לאישור לפני הפרסום באתר."});
});
export default router;