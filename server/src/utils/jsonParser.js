// Groq sometimes wraps JSON responses in markdown code fences (```json ... ```).
// Strip those before calling JSON.parse so callers don't have to.
export function parseJsonResponse(rawText) {
  const stripped = rawText.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(stripped);
}
