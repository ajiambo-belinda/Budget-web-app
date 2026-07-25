import { useState, useEffect } from 'react';
import { useBudget } from './context/BudgetContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomeScreen from './screens/HomeScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import AddScreen from './screens/AddScreen';
import BudgetScreen from './screens/BudgetScreen';
import GoalsScreen from './screens/GoalsScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';
import CashflowScreen from './screens/CashflowScreen';

function App() {
  const { darkMode } = useBudget();
  const [tab, setTab] = useState('home');
  const [editingTx, setEditingTx] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-[100svh] w-full flex relative bg-[var(--color-bg)]">
      <Sidebar
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