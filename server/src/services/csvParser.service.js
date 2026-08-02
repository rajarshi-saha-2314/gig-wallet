import { Readable } from "stream";
import csv from "csv-parser";

const VALID_TYPES = ["credit", "debit"];

// Assumed statement format for this project: date (YYYY-MM-DD), description,
// amount (positive number), type (credit|debit). Maps 1:1 onto the Transaction
// schema's { date, amount, type, rawDescription } fields.
export function parseStatementCsv(buffer) {
  return new Promise((resolve, reject) => {
    const rawRows = [];

    Readable.from(buffer)
      .pipe(csv())
      .on("data", (row) => rawRows.push(row))
      .on("end", () => {
        try {
          resolve(rawRows.map(normalizeRow));
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

function normalizeRow(row, index) {
  const rowNumber = index + 1;
  const date = new Date(row.date);
  const amount = Number(row.amount);
  const type = row.type?.trim().toLowerCase();

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Row ${rowNumber}: invalid date "${row.date}"`);
  }
  if (Number.isNaN(amount) || amount <= 0) {
    throw new Error(`Row ${rowNumber}: invalid amount "${row.amount}"`);
  }
  if (!VALID_TYPES.includes(type)) {
    throw new Error(`Row ${rowNumber}: type must be "credit" or "debit", got "${row.type}"`);
  }
  if (!row.description) {
    throw new Error(`Row ${rowNumber}: missing description`);
  }

  return { date, amount, type, rawDescription: row.description };
}
