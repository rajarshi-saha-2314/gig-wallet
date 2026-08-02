import Transaction from "../models/Transaction.js";
import { parseStatementCsv } from "../services/csvParser.service.js";

const VALID_SOURCES = ["upi", "bank"];

export async function uploadStatement(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded (expected field name "file")' });
  }

  const { source } = req.body;
  if (!VALID_SOURCES.includes(source)) {
    return res.status(400).json({ error: `source must be one of: ${VALID_SOURCES.join(", ")}` });
  }

  let parsedRows;
  try {
    parsedRows = await parseStatementCsv(req.file.buffer);
  } catch (err) {
    return res.status(400).json({ error: `CSV parsing failed: ${err.message}` });
  }

  if (parsedRows.length === 0) {
    return res.status(400).json({ error: "CSV file has no data rows" });
  }

  const transactions = await Transaction.insertMany(
    parsedRows.map((row) => ({ ...row, userId: req.user.id, source, isRecurring: false }))
  );

  res.status(201).json({ inserted: transactions.length });
}
