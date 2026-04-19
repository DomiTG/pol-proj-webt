import type { Transaction, Category, MonthlySummary } from "../types";
import SummaryCard from "./SummaryCard";
import MonthlyChart from "./MonthlyChart";
import { formatCurrency, formatDate } from "../utils/format";

interface Props {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  recentTransactions: Transaction[];
  monthlySummaries: MonthlySummary[];
  categories: Category[];
  onAddTransaction: () => void;
}

export default function Dashboard({
  balance,
  totalIncome,
  totalExpenses,
  recentTransactions,
  monthlySummaries,
  categories,
  onAddTransaction,
}: Props) {
  const findCategory = (id: string) =>
    categories.find((c) => c.id === id);

  return (
    <div className="view">
      <div className="view-header">
        <h1 className="view-title">Přehled</h1>
        <button className="btn btn--primary" onClick={onAddTransaction}>
          + Přidat transakci
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Celkový zůstatek"
          value={formatCurrency(balance)}
          colorClass={balance >= 0 ? "green" : "red"}
          icon="💰"
        />
        <SummaryCard
          title="Celkové příjmy"
          value={formatCurrency(totalIncome)}
          colorClass="green"
          icon="📈"
        />
        <SummaryCard
          title="Celkové výdaje"
          value={formatCurrency(totalExpenses)}
          colorClass="red"
          icon="📉"
        />
      </div>

      <div className="section">
        <h2 className="section-title">Vývoj za posledních 6 měsíců</h2>
        <div className="card">
          <MonthlyChart data={monthlySummaries} />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Poslední transakce</h2>
        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <p>Žádné transakce. Začni přidáním první transakce.</p>
          </div>
        ) : (
          <div className="card">
            <ul className="transaction-list">
              {recentTransactions.map((t) => {
                const cat = findCategory(t.categoryId);
                return (
                  <li key={t.id} className="transaction-row">
                    <div className="transaction-row__icon">
                      <span
                        className="category-badge"
                        style={{ background: cat?.color ?? "#94a3b8" }}
                      >
                        {cat?.icon ?? "📦"}
                      </span>
                    </div>
                    <div className="transaction-row__info">
                      <span className="transaction-row__desc">
                        {t.description}
                      </span>
                      <span className="transaction-row__meta">
                        {cat?.name} · {formatDate(t.date)}
                      </span>
                    </div>
                    <span
                      className={`transaction-row__amount transaction-row__amount--${t.type}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
