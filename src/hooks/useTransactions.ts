import { useState, useCallback, useMemo } from "react";
import type { Transaction, MonthlySummary } from "../types";
import { getItem, setItem } from "../utils/storage";
import { toMonthKey } from "../utils/format";

const STORAGE_KEY = "fintrak_transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    getItem<Transaction[]>(STORAGE_KEY, [])
  );

  const save = useCallback((updated: Transaction[]) => {
    setTransactions(updated);
    setItem(STORAGE_KEY, updated);
  }, []);

  const addTransaction = useCallback(
    (data: Omit<Transaction, "id">) => {
      const tx: Transaction = { ...data, id: `tx_${Date.now()}` };
      save([tx, ...transactions]);
    },
    [transactions, save]
  );

  const updateTransaction = useCallback(
    (id: string, data: Partial<Omit<Transaction, "id">>) => {
      save(transactions.map((t) => (t.id === id ? { ...t, ...data } : t)));
    },
    [transactions, save]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      save(transactions.filter((t) => t.id !== id));
    },
    [transactions, save]
  );

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const balance = useMemo(
    () => totalIncome - totalExpenses,
    [totalIncome, totalExpenses]
  );

  const monthlySummaries = useMemo((): MonthlySummary[] => {
    const map = new Map<string, MonthlySummary>();

    for (const t of transactions) {
      const key = toMonthKey(t.date);
      if (!map.has(key)) {
        map.set(key, { month: key, income: 0, expenses: 0 });
      }
      const entry = map.get(key)!;
      if (t.type === "income") entry.income += t.amount;
      else entry.expenses += t.amount;
    }

    return Array.from(map.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    monthlySummaries,
  };
}
