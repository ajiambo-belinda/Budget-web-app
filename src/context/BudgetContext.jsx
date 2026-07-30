import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const BudgetContext = createContext(null);

// MongoDB returns `_id`; our screens use `.id`. Normalize once here so nothing else has to change.
function withId(doc) {
  if (!doc) return doc;
  return { ...doc, id: doc.id || doc._id };
}

export function BudgetProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [goals, setGoals] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [profile, setProfileState] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const [currency, setCurrency] = useState('USD');
  const [darkMode, setDarkMode] = useState(true);

  // Loads everything for the logged-in user in one go
  async function loadUserData() {
    setDataLoading(true);
    try {
      const [txRes, budgetRes, goalRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/budgets'),
        api.get('/goals'),
      ]);
      setTransactions(txRes.transactions.map(withId));
      setBudgets(budgetRes.budgets);
      setGoals(goalRes.goals.map(withId));
    } catch (err) {
      console.error('Failed to load user data:', err.message);
    } finally {
      setDataLoading(false);
    }
  }

  // On first load, check if there's a saved token and try to restore the session
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const { user } = await api.get('/auth/me');
        setProfileState(user);
        setCurrency(user.currency || 'USD');
        setDarkMode(user.darkMode ?? true);
        await loadUserData();
      } catch (err) {
        localStorage.removeItem('token');
        setProfileState(null);
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function signup({ name, email, password, photo }) {
    setAuthError('');
    try {
      const { token, user } = await api.post('/auth/signup', { name, email, password, photo, currency });
      localStorage.setItem('token', token);
      setProfileState(user);
      await loadUserData();
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    }
  }

  async function login({ email, password }) {
    setAuthError('');
    try {
      const { token, user } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', token);
      setProfileState(user);
      setCurrency(user.currency || 'USD');
      setDarkMode(user.darkMode ?? true);
      await loadUserData();
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setProfileState(null);
    setTransactions([]);
    setBudgets({});
    setGoals([]);
  }

  // --- Transactions ---

  async function addTransaction(tx) {
    const { transaction } = await api.post('/transactions', tx);
    setTransactions((prev) => [withId(transaction), ...prev]);
  }

  async function updateTransaction(updatedTx) {
    const { transaction } = await api.put(`/transactions/${updatedTx.id}`, updatedTx);
    const normalized = withId(transaction);
    setTransactions((prev) => prev.map((t) => (t.id === normalized.id ? normalized : t)));
  }

  async function deleteTransaction(id) {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  // --- Budgets ---

  async function setBudgetLimit(category, limit) {
    await api.put(`/budgets/${encodeURIComponent(category)}`, { limit });
    setBudgets((prev) => ({ ...prev, [category]: limit }));
  }

  // --- Goals ---

  async function addGoal(name, target, targetDate) {
    const { goal } = await api.post('/goals', { name, target, targetDate });
    setGoals((prev) => [withId(goal), ...prev]);
  }

  async function contributeToGoal(id, amount) {
    const { goal, transaction } = await api.put(`/goals/${id}/contribute`, { amount });
    const normalizedGoal = withId(goal);
    setGoals((prev) => prev.map((g) => (g.id === normalizedGoal.id ? normalizedGoal : g)));
    setTransactions((prev) => [withId(transaction), ...prev]);
  }

  async function deleteGoal(id) {
    await api.delete(`/goals/${id}`);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  const value = {
    transactions,
    budgets,
    goals,
    dataLoading,
    profile,
    authLoading,
    authError,
    signup,
    login,
    logout,
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
