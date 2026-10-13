import { Router, type IRouter } from "express";
import healthRouter from "./health";
import memoriesRouter from "./memories";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(memoriesRouter);
router.use(adminRouter);

export default router;
