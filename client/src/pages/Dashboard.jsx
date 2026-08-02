import { useTransactions } from "../hooks/useTransactions.js";
import ForecastCard from "../components/dashboard/ForecastCard.jsx";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown.jsx";
import TransactionTable from "../components/transactions/TransactionTable.jsx";
import ChatAssistant from "../components/assistant/ChatAssistant.jsx";

function Dashboard() {
  const { transactions, loading, error, categorizing, categorize } = useTransactions();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p role="alert">{error}</p>}

      <section>
        <ForecastCard />
      </section>

      <section>
        <h2>Spending by Category</h2>
        <button type="button" onClick={categorize} disabled={categorizing}>
          {categorizing ? "Categorizing..." : "Categorize Transactions"}
        </button>
        <CategoryBreakdown transactions={transactions} />
      </section>

      <section>
        <h2>Transactions</h2>
        <TransactionTable transactions={transactions} />
      </section>

      <section>
        <h2>Ask Your Coach</h2>
        <ChatAssistant />
      </section>
    </div>
  );
}

export default Dashboard;
