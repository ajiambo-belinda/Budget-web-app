import { createContext, useContext, useState, useEffect } from 'react';


const BudgetContext = createContext(null);


export function BudgetProvider({ children }) {
  
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : {};
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  
  
  const [profile, setProfileState] = useState(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved || 'USD';
  });

  const [darkMode, setDarkMode] = useState(true);

  
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (profile) localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  
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

  
  function addGoal(name, target, targetDate) {
    const newGoal = {
      id: Date.now().toString(),
      name,
      target,
      saved: 0,
      targetDate: targetDate || null,
    };
    setGoals((prev) => [newGoal, ...prev]);
  }

  
  function contributeToGoal(id, amount) {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved: g.saved + amount } : g))
    );

    addTransaction({
      type: 'savings',
      amount,
      category: goal.name,
      date: new Date().toISOString().slice(0, 10),
      note: `Contribution to ${goal.name}`,
    });
  }

  function deleteGoal(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  
  function createProfile({ name, email, password, photo }) {
    setProfileState({ name, email, password, photo: photo || null });
  }

  
  function updateProfilePhoto(photo) {
    setProfileState((prev) => (prev ? { ...prev, photo } : prev));
  }

  
  const value = {
    transactions,
    budgets,
    goals,
    profile,
    createProfile,
    updateProfilePhoto,
    currency,
    setCurrency,
    darkMode,
    setDarkMode,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudgetLimit,
    addGoal,
    contributeToGoal,
    deleteGoal,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}


export function useBudget() {
  return useContext(BudgetContext);
}
