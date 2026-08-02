import cron from "node-cron";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Forecast from "../models/Forecast.js";
import { computeSafeSpend, groupIncomeByMonth } from "../services/forecast.service.js";

// Runs at 00:05 on the 1st of every month — recomputes every user's safe-to-spend
// forecast so the dashboard has a fresh number without needing a GET /forecast call
// to trigger it first.
export function scheduleMonthlyForecastJob() {
  cron.schedule("5 0 1 * *", () => {
    runMonthlyForecastJob().catch((err) => console.error("Monthly forecast job failed:", err));
  });
}

export async function runMonthlyForecastJob() {
  const users = await User.find({}, "_id");
  const month = new Date().toISOString().slice(0, 7);
  let updated = 0;

  for (const user of users) {
    const incomeTransactions = await Transaction.find({ userId: user._id, type: "credit" });
    const monthlyIncome = groupIncomeByMonth(incomeTransactions);
    if (monthlyIncome.size === 0) continue;

    const { predictedSafeSpend, incomeConfidenceInterval } = computeSafeSpend([...monthlyIncome.values()]);
    await Forecast.findOneAndUpdate(
      { userId: user._id, month },
      { predictedSafeSpend, incomeConfidenceInterval, generatedAt: new Date() },
      { upsert: true }
    );
    updated += 1;
  }

  console.log(`Monthly forecast job: updated ${updated}/${users.length} users`);
  return { updated, total: users.length };
}
