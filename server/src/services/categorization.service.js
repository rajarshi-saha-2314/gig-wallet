import groq from "../config/groq.js";
import { parseJsonResponse } from "../utils/jsonParser.js";

// Small/fast model for this high-volume, low-complexity task. llama-3.1-8b-instant
// is being retired by Groq on 2026-08-16; openai/gpt-oss-20b is their recommended
// replacement (see console.groq.com/docs/deprecations).
const CATEGORIZATION_MODEL = "openai/gpt-oss-20b";

const CATEGORIES = ["Food", "Rent", "Transport", "Shopping", "Bills", "Entertainment", "Income", "Other"];
const BATCH_SIZE = 15;

// Batches transactions (BATCH_SIZE per call) and asks Groq to classify each into a
// spending category, returning a flat [{ id, category }] merged across all batches.
export async function categorizeTransactions(transactions) {
  const batches = chunk(transactions, BATCH_SIZE);
  const results = [];

  for (const batch of batches) {
    const completion = await groq.chat.completions.create({
      model: CATEGORIZATION_MODEL,
      temperature: 0,
      messages: [{ role: "user", content: buildPrompt(batch) }],
    });

    const parsed = parseJsonResponse(completion.choices[0].message.content);
    results.push(...parsed.map((r) => ({ id: r.id, category: sanitizeCategory(r.category) })));
  }

  return results;
}

function chunk(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function sanitizeCategory(category) {
  return CATEGORIES.includes(category) ? category : "Other";
}

function buildPrompt(transactions) {
  return [
    `Classify each transaction below into exactly one of these categories: ${CATEGORIES.join(", ")}.`,
    "Respond with ONLY a JSON array of { id, category }, no markdown, no explanation.",
    JSON.stringify(
      transactions.map((t) => ({
        id: t._id.toString(),
        description: t.rawDescription,
        amount: t.amount,
        type: t.type,
      }))
    ),
  ].join("\n");
}
