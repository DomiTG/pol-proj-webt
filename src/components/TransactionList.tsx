import { useState, useMemo } from "react";
import type { Transaction, Category } from "../types";
import { formatCurrency, formatDate } from "../utils/format";

interface Props {
  transactions: Transaction[];
  categories: Category[];
  onAdd: () => void;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

type SortField = "date" | "amount" | "description";
type SortDir = "asc" | "desc";

export default function TransactionList({
  transactions,
  categories,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const findCategory = (id: string) => categories.find((c) => c.id === id);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.note?.toLowerCase().includes(q)
      );
    }

    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType);
    }

    if (filterCategory !== "all") {
      result = result.filter((t) => t.categoryId === filterCategory);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") cmp = a.date.localeCompare(b.date);
      else if (sortField === "amount") cmp = a.amount - b.amount;
      else cmp = a.description.localeCompare(b.description);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [transactions, search, filterType, filterCategory, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  }

  const sortArrow = (field: SortField) => {
    if (sortField !== field) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  };

  return (
    <div className="view">
      <div className="view-header">
        <h1 className="view-title">Transakce</h1>
        <button className="btn btn--primary" onClick={onAdd}>
          + Přidat
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="search"
          placeholder="Hledat transakce..."
          className="filter-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as "all" | "income" | "expense")
          }
        >
          <option value="all">Vše</option>
          <option value="income">Příjmy</option>
          <option value="expense">Výdaje</option>
        </select>

        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">Všechny kategorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>Žádné transakce neodpovídají filtru.</p>
        </div>
      ) : (
        <div className="card">
          <table className="tx-table">
            <thead>
              <tr>
                <th className="tx-table__th">Kategorie</th>
                <th
                  className="tx-table__th tx-table__th--sort"
                  onClick={() => toggleSort("description")}
                >
                  Popis {sortArrow("description")}
                </th>
                <th
                  className="tx-table__th tx-table__th--sort"
                  onClick={() => toggleSort("date")}
                >
                  Datum {sortArrow("date")}
                </th>
                <th
                  className="tx-table__th tx-table__th--sort tx-table__th--right"
                  onClick={() => toggleSort("amount")}
                >
                  Částka {sortArrow("amount")}
                </th>
                <th className="tx-table__th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const cat = findCategory(t.categoryId);
                return (
                  <tr key={t.id} className="tx-table__row">
                    <td className="tx-table__td">
                      <span
                        className="category-badge"
                        style={{ background: cat?.color ?? "#94a3b8" }}
                      >
                        {cat?.icon ?? "📦"}
                      </span>
                      <span className="cat-name">{cat?.name}</span>
                    </td>
                    <td className="tx-table__td">
                      <span className="tx-desc">{t.description}</span>
                      {t.note && <span className="tx-note">{t.note}</span>}
                    </td>
                    <td className="tx-table__td tx-date">
                      {formatDate(t.date)}
                    </td>
                    <td
                      className={`tx-table__td tx-table__td--right tx-amount tx-amount--${t.type}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="tx-table__td tx-actions">
                      <button
                        className="btn-icon"
                        onClick={() => onEdit(t)}
                        title="Upravit"
                      >
                        ✏️
                      </button>
                      <button
                        className={`btn-icon btn-icon--danger ${confirmDelete === t.id ? "btn-icon--confirm" : ""}`}
                        onClick={() => handleDelete(t.id)}
                        title={
                          confirmDelete === t.id
                            ? "Klikni znovu pro potvrzení"
                            : "Smazat"
                        }
                      >
                        {confirmDelete === t.id ? "✓ Smazat?" : "🗑️"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="result-count">
        Zobrazeno {filtered.length} z {transactions.length} transakcí
      </p>
    </div>
  );
}
