import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import CategoryManager from "./components/CategoryManager";
import { useTransactions } from "./hooks/useTransactions";
import { useCategories } from "./hooks/useCategories";
import type { Transaction, ViewName } from "./types";
import "./index.css";

function App() {
  const [view, setView] = useState<ViewName>("dashboard");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const txns = useTransactions();
  const cats = useCategories();

  function openAddTransaction() {
    setEditingTransaction(null);
    setFormOpen(true);
  }

  function openEditTransaction(t: Transaction) {
    setEditingTransaction(t);
    setFormOpen(true);
  }

  function handleSave(data: Omit<Transaction, "id">) {
    if (editingTransaction) {
      txns.updateTransaction(editingTransaction.id, data);
    } else {
      txns.addTransaction(data);
    }
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditingTransaction(null);
  }

  const recentFive = [...txns.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="app">
      <Sidebar currentView={view} onNavigate={setView} />

      <main className="main-content">
        {view === "dashboard" && (
          <Dashboard
            balance={txns.balance}
            totalIncome={txns.totalIncome}
            totalExpenses={txns.totalExpenses}
            recentTransactions={recentFive}
            monthlySummaries={txns.monthlySummaries}
            categories={cats.categories}
            onAddTransaction={openAddTransaction}
          />
        )}

        {view === "transactions" && (
          <TransactionList
            transactions={txns.transactions}
            categories={cats.categories}
            onAdd={openAddTransaction}
            onEdit={openEditTransaction}
            onDelete={txns.deleteTransaction}
          />
        )}

        {view === "categories" && (
          <CategoryManager
            categories={cats.categories}
            onAdd={cats.addCategory}
            onUpdate={cats.updateCategory}
            onDelete={cats.deleteCategory}
          />
        )}
      </main>

      {formOpen && (
        <TransactionForm
          key={editingTransaction?.id ?? "new"}
          categories={cats.categories}
          initial={editingTransaction}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default App;
