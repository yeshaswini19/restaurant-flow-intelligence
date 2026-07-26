import { Router } from "express";
import { getAIInsights } from "../controllers/ai.controller.js";

const router = Router();

router.get("/insights", getAIInsights);

export default router;