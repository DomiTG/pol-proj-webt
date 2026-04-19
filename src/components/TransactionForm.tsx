import { useState, type FormEvent } from "react";
import type { Transaction, Category, TransactionType } from "../types";
import { todayISO } from "../utils/format";

interface Props {
  categories: Category[];
  initial?: Transaction | null;
  onSave: (data: Omit<Transaction, "id">) => void;
  onClose: () => void;
}

interface FormState {
  type: TransactionType;
  amount: string;
  description: string;
  categoryId: string;
  date: string;
  note: string;
}

function buildInitialForm(
  initial: Transaction | null | undefined,
  categories: Category[]
): FormState {
  if (initial) {
    return {
      type: initial.type,
      amount: String(initial.amount),
      description: initial.description,
      categoryId: initial.categoryId,
      date: initial.date,
      note: initial.note ?? "",
    };
  }
  return {
    type: "expense",
    amount: "",
    description: "",
    categoryId: categories[0]?.id ?? "",
    date: todayISO(),
    note: "",
  };
}

export default function TransactionForm({
  categories,
  initial,
  onSave,
  onClose,
}: Props) {
  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(initial, categories)
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.description.trim()) {
      newErrors.description = "Popis je povinný.";
    }

    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) {
      newErrors.amount = "Zadej kladnou částku.";
    }

    if (!form.categoryId) {
      newErrors.categoryId = "Vyber kategorii.";
    }

    if (!form.date) {
      newErrors.date = "Datum je povinné.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      type: form.type,
      amount: parseFloat(form.amount),
      description: form.description.trim(),
      categoryId: form.categoryId,
      date: form.date,
      note: form.note.trim() || undefined,
    });
    onClose();
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? "Upravit transakci" : "Nová transakce"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="form-tabs">
            <button
              type="button"
              className={`form-tab ${form.type === "expense" ? "form-tab--active form-tab--expense" : ""}`}
              onClick={() => set("type", "expense")}
            >
              📉 Výdaj
            </button>
            <button
              type="button"
              className={`form-tab ${form.type === "income" ? "form-tab--active form-tab--income" : ""}`}
              onClick={() => set("type", "income")}
            >
              📈 Příjem
            </button>
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="tx-desc">
              Popis *
            </label>
            <input
              id="tx-desc"
              type="text"
              className={`form-input ${errors.description ? "form-input--error" : ""}`}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="např. Nákup v Albert"
              maxLength={120}
            />
            {errors.description && (
              <span className="form-error">{errors.description}</span>
            )}
          </div>

          <div className="form-row-2col">
            <div className="form-row">
              <label className="form-label" htmlFor="tx-amount">
                Částka (Kč) *
              </label>
              <input
                id="tx-amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                className={`form-input ${errors.amount ? "form-input--error" : ""}`}
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0"
              />
              {errors.amount && (
                <span className="form-error">{errors.amount}</span>
              )}
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="tx-date">
                Datum *
              </label>
              <input
                id="tx-date"
                type="date"
                className={`form-input ${errors.date ? "form-input--error" : ""}`}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
              {errors.date && (
                <span className="form-error">{errors.date}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="tx-cat">
              Kategorie *
            </label>
            <select
              id="tx-cat"
              className={`form-input ${errors.categoryId ? "form-input--error" : ""}`}
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              <option value="">— Vyber kategorii —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="form-error">{errors.categoryId}</span>
            )}
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="tx-note">
              Poznámka
            </label>
            <textarea
              id="tx-note"
              className="form-input form-textarea"
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="Volitelná poznámka..."
              rows={2}
              maxLength={300}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Zrušit
            </button>
            <button type="submit" className="btn btn--primary">
              {initial ? "Uložit změny" : "Přidat transakci"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
