import Transaction from "../models/Transaction.js";
import { computeSafeSpend, groupIncomeByMonth } from "../services/forecast.service.js";
import { askAssistant } from "../services/assistant.service.js";

const SUMMARY_WINDOW_DAYS = 30;

export async function ask(req, res) {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "question is required" });
  }

  const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
  const transactionSummary = buildTransactionSummary(transactions);

  const monthlyIncome = groupIncomeByMonth(transactions.filter((t) => t.type === "credit"));
  const forecast = monthlyIncome.size > 0 ? computeSafeSpend([...monthlyIncome.values()]) : null;

  const answer = await askAssistant({ question, transactionSummary, forecast });
  res.json({ answer });
}

function buildTransactionSummary(transactions) {
  const since = new Date();
  since.setDate(since.getDate() - SUMMARY_WINDOW_DAYS);
  const recent = transactions.filter((t) => t.date >= since);

  const spendByCategory = {};
  let totalIncome = 0;
  let totalSpend = 0;

  for (const t of recent) {
    if (t.type === "credit") {
      totalIncome += t.amount;
    } else {
      totalSpend += t.amount;
      const category = t.category || "Uncategorized";
      spendByCategory[category] = (spendByCategory[category] || 0) + t.amount;
    }
  }

  return {
    windowDays: SUMMARY_WINDOW_DAYS,
    transactionCount: recent.length,
    totalIncome,
    totalSpend,
    spendByCategory,
  };
}
