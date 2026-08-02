import { useState } from "react";
import axiosClient from "../../api/axiosClient.js";

function ChatAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setError(null);
    setAsking(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setQuestion("");

    try {
      const { data } = await axiosClient.post("/assistant", { question: trimmed });
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setError(err.response?.data?.error || "Assistant request failed");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="chat-assistant">
      <div className="chat-assistant-messages">
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.role === "user" ? "You" : "Coach"}:</strong> {m.content}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="inline-form">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Can I afford a ₹3000 dinner this week?"
          style={{ flex: 1, minWidth: 200 }}
        />
        <button type="submit" disabled={asking}>
          {asking ? "Asking..." : "Ask"}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default ChatAssistant;
