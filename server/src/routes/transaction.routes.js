import { Router } from "express";
import {
  listTransactions,
  getTransaction,
  categorizeUserTransactions,
} from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.get("/", authMiddleware, catchAsync(listTransactions));
router.post("/categorize", authMiddleware, catchAsync(categorizeUserTransactions));
router.get("/:id", authMiddleware, catchAsync(getTransaction));

export default router;
