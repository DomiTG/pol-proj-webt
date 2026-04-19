import { useState, type FormEvent } from "react";
import type { Category } from "../types";

interface Props {
  categories: Category[];
  onAdd: (data: Omit<Category, "id">) => void;
  onUpdate: (id: string, data: Partial<Omit<Category, "id">>) => void;
  onDelete: (id: string) => void;
}

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#94a3b8",
  "#a3e635",
];

const PRESET_ICONS = [
  "🍕",
  "🍔",
  "☕",
  "🚌",
  "✈️",
  "🏠",
  "💊",
  "🎬",
  "🛍️",
  "📚",
  "💪",
  "🎮",
  "💼",
  "💻",
  "📦",
  "💰",
  "🎁",
  "🐾",
  "🌿",
  "⚡",
];

interface NewCatForm {
  name: string;
  color: string;
  icon: string;
}

export default function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewCatForm>({
    name: "",
    color: "#3b82f6",
    icon: "📦",
  });
  const [nameError, setNameError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function openNew() {
    setEditingId(null);
    setForm({ name: "", color: "#3b82f6", icon: "📦" });
    setNameError("");
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({ name: cat.name, color: cat.color, icon: cat.icon });
    setNameError("");
    setShowForm(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setNameError("Název kategorie je povinný.");
      return;
    }
    if (editingId) {
      onUpdate(editingId, {
        name: form.name.trim(),
        color: form.color,
        icon: form.icon,
      });
    } else {
      onAdd({ name: form.name.trim(), color: form.color, icon: form.icon });
    }
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  }

  return (
    <div className="view">
      <div className="view-header">
        <h1 className="view-title">Kategorie</h1>
        <button className="btn btn--primary" onClick={openNew}>
          + Nová kategorie
        </button>
      </div>

      {showForm && (
        <div className="card cat-form-card">
          <h3 className="cat-form-title">
            {editingId ? "Upravit kategorii" : "Nová kategorie"}
          </h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label className="form-label" htmlFor="cat-name">
                Název *
              </label>
              <input
                id="cat-name"
                type="text"
                className={`form-input ${nameError ? "form-input--error" : ""}`}
                value={form.name}
                onChange={(e) => {
                  setForm((p) => ({ ...p, name: e.target.value }));
                  setNameError("");
                }}
                placeholder="Název kategorie"
                maxLength={40}
              />
              {nameError && <span className="form-error">{nameError}</span>}
            </div>

            <div className="form-row">
              <label className="form-label">Ikona</label>
              <div className="icon-picker">
                {PRESET_ICONS.map((ico) => (
                  <button
                    key={ico}
                    type="button"
                    className={`icon-option ${form.icon === ico ? "icon-option--selected" : ""}`}
                    onClick={() => setForm((p) => ({ ...p, icon: ico }))}
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label className="form-label">Barva</label>
              <div className="color-picker">
                {PRESET_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    className={`color-option ${form.color === col ? "color-option--selected" : ""}`}
                    style={{ background: col }}
                    onClick={() => setForm((p) => ({ ...p, color: col }))}
                    title={col}
                  />
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setShowForm(false)}
              >
                Zrušit
              </button>
              <button type="submit" className="btn btn--primary">
                {editingId ? "Uložit" : "Přidat"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cat-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="cat-card"
            style={{ borderLeftColor: cat.color }}
          >
            <div className="cat-card__icon" style={{ background: cat.color }}>
              {cat.icon}
            </div>
            <div className="cat-card__name">{cat.name}</div>
            <div className="cat-card__actions">
              <button
                className="btn-icon"
                onClick={() => openEdit(cat)}
                title="Upravit"
              >
                ✏️
              </button>
              <button
                className={`btn-icon btn-icon--danger ${confirmDelete === cat.id ? "btn-icon--confirm" : ""}`}
                onClick={() => handleDelete(cat.id)}
                title={
                  confirmDelete === cat.id
                    ? "Klikni znovu pro potvrzení"
                    : "Smazat"
                }
              >
                {confirmDelete === cat.id ? "✓?" : "🗑️"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
