import mongoose from "mongoose";

const forecastSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true },
  predictedSafeSpend: { type: Number, required: true },
  incomeConfidenceInterval: {
    low: { type: Number, required: true },
    high: { type: Number, required: true },
  },
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Forecast", forecastSchema);
