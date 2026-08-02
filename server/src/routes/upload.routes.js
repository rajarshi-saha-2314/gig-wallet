import { Router } from "express";
import multer from "multer";
import { uploadStatement } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv")) {
      return cb(null, true);
    }
    const err = new Error("Only CSV files are allowed");
    err.status = 400;
    cb(err);
  },
});

const router = Router();

router.post("/", authMiddleware, upload.single("file"), catchAsync(uploadStatement));

export default router;
