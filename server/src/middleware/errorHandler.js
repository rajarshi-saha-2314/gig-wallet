import multer from "multer";

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err instanceof multer.MulterError ? 400 : err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}
