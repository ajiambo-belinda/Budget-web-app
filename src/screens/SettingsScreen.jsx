import { Moon, Sun } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { CURRENCIES } from '../utils/currency';
import Card from '../components/Card';

export default function SettingsScreen() {
  const { currency, setCurrency, darkMode, setDarkMode } = useBudget();

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold mb-4 text-[var(--color-text)]">Settings</h1>

      <Card>
        <p className="text-sm font-semibold mb-2 text-[var(--color-text)]">Currency</p>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-3 py-2 text-sm"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Card>

      <Card>
  <div className="flex justify-between items-center">
    <p className="text-sm font-semibold text-[var(--color-text)]">Appearance</p>
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-[var(--color-text-muted)]">
        {darkMode ? 'Dark' : 'Light'}
      </span>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="w-11 h-6 rounded-full relative transition-colors"
        style={{ backgroundColor: darkMode ? 'var(--color-gold)' : 'var(--color-border)' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-transform bg-[var(--color-bg)]"
          style={{ transform: darkMode ? 'translateX(22px)' : 'translateX(2px)' }}
        >
          {darkMode ? <Moon size={11} className="text-[var(--color-gold)]" /> : <Sun size={11} className="text-[var(--color-text-muted)]" />}
        </span>
      </button>
    </div>
  </div>
</Card>
    </div>
  );
}