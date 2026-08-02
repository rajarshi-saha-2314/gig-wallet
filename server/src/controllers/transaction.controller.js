import Transaction from "../models/Transaction.js";
import { categorizeTransactions } from "../services/categorization.service.js";

export async function listTransactions(req, res) {
  const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(transactions);
}

export async function getTransaction(req, res) {
  const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  res.json(transaction);
}

export async function categorizeUserTransactions(req, res) {
  const uncategorized = await Transaction.find({ userId: req.user.id, category: null });
  if (uncategorized.length === 0) {
    return res.json({ categorized: 0 });
  }

  const results = await categorizeTransactions(uncategorized);
  const categoryById = new Map(results.map((r) => [r.id, r.category]));

  const bulkOps = uncategorized
    .filter((t) => categoryById.has(t._id.toString()))
    .map((t) => ({
      updateOne: {
        filter: { _id: t._id },
        update: { category: categoryById.get(t._id.toString()) },
      },
    }));

  if (bulkOps.length > 0) {
    await Transaction.bulkWrite(bulkOps);
  }

  res.json({ categorized: bulkOps.length, remaining: uncategorized.length - bulkOps.length });
}
