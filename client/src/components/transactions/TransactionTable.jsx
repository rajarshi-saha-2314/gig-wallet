function TransactionTable({ transactions }) {
  if (transactions.length === 0) {
    return <p>No transactions yet — upload a statement to get started.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Type</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t._id}>
            <td>{new Date(t.date).toLocaleDateString()}</td>
            <td>{t.rawDescription}</td>
            <td>{t.category || "Uncategorized"}</td>
            <td>{t.type}</td>
            <td>₹{t.amount.toLocaleString("en-IN")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;
