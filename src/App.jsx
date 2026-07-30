import { useState, useEffect } from 'react';
import { useBudget } from './context/BudgetContext';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import HomeScreen from './screens/HomeScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import AddScreen from './screens/AddScreen';
import BudgetScreen from './screens/BudgetScreen';
import GoalsScreen from './screens/GoalsScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';
import CashflowScreen from './screens/CashflowScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import LoginScreen from './screens/LoginScreen';

function App() {
  const { darkMode, profile, authLoading } = useBudget();
  const [tab, setTab] = useState('home');
  const [editingTx, setEditingTx] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authScreen, setAuthScreen] = useState('signup'); // 'signup' or 'login'

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  function goToAdd(tx = null) {
    setEditingTx(tx);
    setTab('add');
  }

  function handleAddDone() {
    setEditingTx(null);
    setTab('transactions');
  }

  // Still checking localStorage for a saved token — show a brief loading state
  if (authLoading) {
    return (
      <div className="min-h-[100svh] w-full flex items-center justify-center bg-[var(--color-bg)]">
        <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
      </div>
    );
  }

  // Not logged in — show signup or login depending on toggle state
  if (!profile) {
    return authScreen === 'signup' ? (
      <ProfileSetupScreen onSwitchToLogin={() => setAuthScreen('login')} />
    ) : (
      <LoginScreen onSwitchToSignup={() => setAuthScreen('signup')} />
    );
  }

  return (
    <div className="min-h-[100svh] w-full flex relative bg-[var(--color-bg)]">
      <SideBar
        tab={tab}
        setTab={(t) => { if (t === 'add') setEditingTx(null); setTab(t); }}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onAdd={() => goToAdd()}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar tab={tab} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 max-w-3xl w-full mx-auto">
          {tab === 'home' && <HomeScreen />}
          {tab === 'transactions' && <TransactionsScreen onEdit={goToAdd} />}
          {tab === 'cashflow' && <CashflowScreen />}
          {tab === 'add' && <AddScreen editingTx={editingTx} onDone={handleAddDone} />}
          {tab === 'budget' && <BudgetScreen />}
          {tab === 'goals' && <GoalsScreen />}
          {tab === 'reports' && <ReportsScreen />}
          {tab === 'settings' && <SettingsScreen />}
        </main>
      </div>
    </div>
  );
}

export default App;