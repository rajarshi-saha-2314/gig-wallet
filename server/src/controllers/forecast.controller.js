import Transaction from "../models/Transaction.js";
import Forecast from "../models/Forecast.js";
import { computeSafeSpend, groupIncomeByMonth } from "../services/forecast.service.js";

export async function getForecast(req, res) {
  const transactions = await Transaction.find({ userId: req.user.id, type: "credit" });
  const monthlyIncome = groupIncomeByMonth(transactions);

  if (monthlyIncome.size === 0) {
    return res.json({ hasData: false });
  }

  const { predictedSafeSpend, incomeConfidenceInterval } = computeSafeSpend([...monthlyIncome.values()]);
  const month = new Date().toISOString().slice(0, 7);

  const forecast = await Forecast.findOneAndUpdate(
    { userId: req.user.id, month },
    { predictedSafeSpend, incomeConfidenceInterval, generatedAt: new Date() },
    { upsert: true, new: true }
  );

  res.json({ hasData: true, forecast, monthsOfData: monthlyIncome.size });
}
