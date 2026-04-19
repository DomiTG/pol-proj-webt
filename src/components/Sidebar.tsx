import type { ViewName } from "../types";

interface Props {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
}

const NAV_ITEMS: { id: ViewName; label: string; icon: string }[] = [
  { id: "dashboard", label: "Přehled", icon: "📊" },
  { id: "transactions", label: "Transakce", icon: "💳" },
  { id: "categories", label: "Kategorie", icon: "🏷️" },
];

export default function Sidebar({ currentView, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">💰</span>
        <span className="logo-text">FinTrak</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? "nav-item--active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <small>Pololetní projekt</small>
      </div>
    </aside>
  );
}
