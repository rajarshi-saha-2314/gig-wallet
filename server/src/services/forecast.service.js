// Plain statistics, no LLM involved: rolling average + standard deviation of recent
// months' income drives a conservative "safe to spend" number.
export function computeSafeSpend(monthlyIncomes) {
  const mean = average(monthlyIncomes);
  const stdDev = standardDeviation(monthlyIncomes, mean);

  return {
    // Clamped at 0 — volatile enough income (stdDev > mean) shouldn't produce a
    // negative "safe to spend" figure.
    predictedSafeSpend: Math.max(0, mean - stdDev),
    incomeConfidenceInterval: { low: Math.max(0, mean - stdDev), high: mean + stdDev },
  };
}

// Sums credit transactions per calendar month (YYYY-MM), returning a Map so callers
// can read both the ordered month keys and their income totals.
export function groupIncomeByMonth(transactions) {
  const totals = new Map();
  for (const t of transactions) {
    if (t.type !== "credit") continue;
    const month = t.date.toISOString().slice(0, 7);
    totals.set(month, (totals.get(month) || 0) + t.amount);
  }
  return totals;
}

function average(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function standardDeviation(values, mean) {
  const variance = average(values.map((v) => (v - mean) ** 2));
  return Math.sqrt(variance);
}
