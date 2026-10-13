import { Router, type IRouter } from "express";
import { compare } from "bcryptjs";
import { rateLimit } from "express-rate-limit";
import { desc, eq } from "drizzle-orm";
import { db, memories } from "@workspace/db";
import { LoginAdminBody, ModerateMemoryBody, ModerateMemoryParams, DeleteMemoryParams, ListAdminMemoriesResponse } from "@workspace/api-zod";
import { adminConfigured, adminSession, requireAdmin, sameOrigin } from "../middlewares/admin";

const router: IRouter = Router();
router.use("/admin", (_req,res,next) => {res.set("Cache-Control","no-store"); next();}, sameOrigin, adminSession);
router.get("/admin/session", (req,res) => {
  res.json({authenticated:adminConfigured() && Boolean(req.session?.admin),configured:adminConfigured()});
});
router.post("/admin/session", rateLimit({
  windowMs:15*60*1000, limit:5, standardHeaders:"draft-8", legacyHeaders:false,
  message:{error:"יותר מדי ניסיונות התחברות. נסו שוב מאוחר יותר."},
}), async (req,res) => {
  if (!adminConfigured()) {res.status(503).json({error:"הגישה לניהול טרם הוגדרה באופן מאובטח."}); return;}
  const parsed = LoginAdminBody.safeParse(req.body);
  if (!parsed.success || !await compare(parsed.data.password, process.env.ADMIN_PASSWORD_HASH!)) {
    res.status(401).json({error:"פרטי ההתחברות אינם נכונים."}); return;
  }
  await new Promise<void>((resolve,reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
  req.session.admin = true;
  await new Promise<void>((resolve,reject) => req.session.save(err => err ? reject(err) : resolve()));
  res.json({authenticated:true, configured:true});
});
router.delete("/admin/session", (req,res,next) => {
  if (!req.session) {res.sendStatus(204); return;}
  req.session.destroy(err => {
    if (err) {next(err); return;}
    res.clearCookie("roy.admin", {path:"/api/admin",httpOnly:true,sameSite:"strict"});
    res.sendStatus(204);
  });
});
router.get("/admin/memories", requireAdmin, async (_req,res) => {
  const rows = await db.select().from(memories).orderBy(desc(memories.createdAt));
  res.json(ListAdminMemoriesResponse.parse(rows.map(row => ({
    ...row, createdAt:row.createdAt.toISOString(), reviewedAt:row.reviewedAt?.toISOString() ?? null,
  }))));
});
router.patch("/admin/memories/:id", requireAdmin, async (req,res) => {
  const params = ModerateMemoryParams.safeParse(req.params);
  const body = ModerateMemoryBody.safeParse(req.body);
  if (!params.success || !body.success || !Number.isSafeInteger(params.data.id) || params.data.id < 1) {
    res.status(400).json({error:"בקשה לא תקינה"}); return;
  }
  const rows = await db.update(memories).set({
    status:body.data.status, updatedAt:new Date(), reviewedAt:body.data.status === "pending" ? null : new Date(),
  }).where(eq(memories.id,params.data.id)).returning({id:memories.id});
  if (!rows.length) {res.status(404).json({error:"הזיכרון לא נמצא"}); return;}
  res.json({message:"הזיכרון עודכן"});
});
router.delete("/admin/memories/:id", requireAdmin, async (req,res) => {
  const params = DeleteMemoryParams.safeParse(req.params);
  if (!params.success || !Number.isSafeInteger(params.data.id) || params.data.id < 1) {res.status(400).json({error:"בקשה לא תקינה"}); return;}
  const rows = await db.delete(memories).where(eq(memories.id,params.data.id)).returning({id:memories.id});
  if (!rows.length) {res.status(404).json({error:"הזיכרון לא נמצא"}); return;}
  res.sendStatus(204);
});
export default router;