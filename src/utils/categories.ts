import type { Category } from "../types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Jídlo", color: "#f97316", icon: "🍕" },
  { id: "transport", name: "Doprava", color: "#3b82f6", icon: "🚌" },
  { id: "housing", name: "Bydlení", color: "#8b5cf6", icon: "🏠" },
  { id: "health", name: "Zdraví", color: "#ef4444", icon: "💊" },
  { id: "entertainment", name: "Zábava", color: "#ec4899", icon: "🎬" },
  { id: "shopping", name: "Nákupy", color: "#14b8a6", icon: "🛍️" },
  { id: "salary", name: "Výplata", color: "#22c55e", icon: "💼" },
  { id: "freelance", name: "Freelance", color: "#a3e635", icon: "💻" },
  { id: "other", name: "Ostatní", color: "#94a3b8", icon: "📦" },
];
