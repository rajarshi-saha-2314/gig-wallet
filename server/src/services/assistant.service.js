import groq from "../config/groq.js";

// Larger model for better reasoning than categorization needs. llama-3.3-70b-versatile
// is being retired by Groq on 2026-08-16; openai/gpt-oss-120b is their recommended
// replacement (see console.groq.com/docs/deprecations).
const ASSISTANT_MODEL = "openai/gpt-oss-120b";

// Grounds "can I afford this?" answers in the user's real transaction/forecast data
// instead of letting the model guess.
export async function askAssistant({ question, transactionSummary, forecast }) {
  const context = [
    `Recent transaction summary (last 30 days): ${JSON.stringify(transactionSummary)}`,
    `Current safe-to-spend forecast: ${forecast ? JSON.stringify(forecast) : "not enough income history yet"}`,
  ].join("\n");

  const completion = await groq.chat.completions.create({
    model: ASSISTANT_MODEL,
    messages: [
      {
        role: "system",
        content: [
          "You are a personal finance coach for gig workers and freelancers with irregular income.",
          "Ground every answer in the context below instead of guessing — cite specific numbers from it.",
          "If the context doesn't have enough information to answer confidently, say so instead of making numbers up.",
          "Keep answers concise (2-4 sentences) and use ₹ for amounts.",
          context,
        ].join("\n"),
      },
      { role: "user", content: question },
    ],
  });

  return completion.choices[0].message.content;
}
