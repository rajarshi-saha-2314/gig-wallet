import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  rawDescription: { type: String, required: true },
  category: { type: String, default: null },
  source: { type: String, enum: ["upi", "bank"], required: true },
  isRecurring: { type: Boolean, default: false },
});

export default mongoose.model("Transaction", transactionSchema);
