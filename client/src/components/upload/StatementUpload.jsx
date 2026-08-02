import { useState } from "react";
import axiosClient from "../../api/axiosClient.js";

function StatementUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [source, setSource] = useState("bank");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Choose a CSV file first");
      return;
    }

    setError(null);
    setStatus(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", source);

    try {
      // Don't set Content-Type manually here — the browser needs to add its own
      // multipart boundary, which an explicit header would override.
      const { data } = await axiosClient.post("/upload", formData);
      setStatus(`Imported ${data.inserted} transactions`);
      setFile(null);
      onUploaded?.(data);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <select value={source} onChange={(e) => setSource(e.target.value)}>
        <option value="bank">Bank statement</option>
        <option value="upi">UPI export</option>
      </select>
      <input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" disabled={submitting}>
        {submitting ? "Uploading..." : "Upload"}
      </button>
      {status && <p>{status}</p>}
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

export default StatementUpload;
