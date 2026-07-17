import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the "whiteboard" — starts empty, gets filled in by the Provider below
const BudgetContext = createContext(null);

// 2. This component wraps our whole app and holds the actual data
export function BudgetProvider({ children }) {
  // Try to load saved data from the browser; if none exists yet, start empty
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : {};
  });

  const [currency, setCurrency] = useState('USD');
  const [darkMode, setDarkMode] = useState(true);

  // Whenever `transactions` changes, save it to the browser automatically
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // A function to add a new transaction — any screen can call this
  function addTransaction(tx) {
    const newTx = { ...tx, id: Date.now().toString() };
    setTransactions((prev) => [newTx, ...prev]);
  }

  function updateTransaction(updatedTx) {
  setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
}

function deleteTransaction(id) {
  setTransactions((prev) => prev.filter((t) => t.id !== id));
}

  function setBudgetLimit(category, limit) {
    setBudgets((prev) => ({ ...prev, [category]: limit }));
  }

  // Everything inside `value` is what other components can access
  const  value = {
  transactions,
  budgets,
  currency,
  setCurrency,
  darkMode,
  setDarkMode,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setBudgetLimit,
};

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

// 3. A shortcut hook so screens can just call useBudget() instead of useContext(BudgetContext)
export function useBudget() {
  return useContext(BudgetContext);
}