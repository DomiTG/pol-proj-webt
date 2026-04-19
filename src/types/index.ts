export type TransactionType = "income" | "expense";

export type ViewName = "dashboard" | "transactions" | "categories";

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  categoryId: string;
  date: string; // YYYY-MM-DD
  note?: string;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
}
