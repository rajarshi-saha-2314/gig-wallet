import { Router } from "express";
import { getForecast } from "../controllers/forecast.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.get("/", authMiddleware, catchAsync(getForecast));

export default router;
