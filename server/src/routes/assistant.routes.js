import { Router } from "express";
import { ask } from "../controllers/assistant.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.post("/", authMiddleware, catchAsync(ask));

export default router;
