import { useMemo } from "react";
import "./CategoryBreakdown.css";

// Bar-chart job here is magnitude comparison across categories, so color is a
// single sequential hue rather than one-per-category — the label already carries
// category identity, so a per-category palette would be pure decoration.
function CategoryBreakdown({ transactions }) {
  const totals = useMemo(() => {
    const byCategory = new Map();
    for (const t of transactions) {
      if (t.type !== "debit") continue;
      const category = t.category || "Uncategorized";
      byCategory.set(category, (byCategory.get(category) || 0) + t.amount);
    }
    return [...byCategory.entries()]
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  if (totals.length === 0) {
    return <p className="category-breakdown-empty">No categorized spending yet.</p>;
  }

  const max = totals[0].total;

  return (
    <div className="category-breakdown">
      {totals.map(({ category, total }) => (
        <div className="category-breakdown-row" key={category}>
          <span className="category-breakdown-label">{category}</span>
          <div className="category-breakdown-track">
            <div className="category-breakdown-bar" style={{ width: `${(total / max) * 100}%` }} />
          </div>
          <span className="category-breakdown-value">₹{total.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

export default CategoryBreakdown;
