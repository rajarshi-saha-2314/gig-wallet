import { useCallback, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient.js";

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorizing, setCategorizing] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.get("/transactions");
      setTransactions(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function categorize() {
    setCategorizing(true);
    setError(null);
    try {
      await axiosClient.post("/transactions/categorize");
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || "Categorization failed");
    } finally {
      setCategorizing(false);
    }
  }

  return { transactions, loading, error, categorizing, refresh, categorize };
}
