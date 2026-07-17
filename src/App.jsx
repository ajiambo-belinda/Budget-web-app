import { useState } from 'react';
import { useBudget } from './context/BudgetContext';
import NavBar from './components/NavBar';
import HomeScreen from './screens/HomeScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import AddScreen from './screens/AddScreen';
import BudgetScreen from './screens/BudgetScreen';
import SettingsScreen from './screens/SettingsScreen';

function App() {
  const { darkMode } = useBudget();
  const [tab, setTab] = useState('home');
  const [editingTx, setEditingTx] = useState(null);

  function goToAdd(tx = null) {
    setEditingTx(tx);
    setTab('add');
  }

  function handleAddDone() {
    setEditingTx(null);
    setTab('transactions');
  }

  return (
    <div className={darkMode ? '' : 'light'}>
      <div className="min-h-screen bg-[var(--color-bg)]">
        <NavBar
          tab={tab}
          setTab={(t) => {
            if (t === 'add') setEditingTx(null);
            setTab(t);
          }}
        />
        <main className="px-4 py-6 pb-24 sm:pb-6 max-w-2xl mx-auto">
          {tab === 'home' && <HomeScreen />}
          {tab === 'transactions' && <TransactionsScreen onEdit={goToAdd} />}
          {tab === 'add' && <AddScreen editingTx={editingTx} onDone={handleAddDone} />}
          {tab === 'budget' && <BudgetScreen />}
          {tab === 'settings' && <SettingsScreen />}
        </main>
      </div>
    </div>
  );
}

export default App;