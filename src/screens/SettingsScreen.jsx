import { Moon, Sun } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { CURRENCIES } from '../utils/currency';
import Card from '../components/Card';

export default function SettingsScreen() {
  const { currency, setCurrency, darkMode, setDarkMode } = useBudget();

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold mb-4 text-[#F2EFE6]">Settings</h1>

      <Card>
        <p className="text-sm font-semibold mb-2 text-[#F2EFE6]">Currency</p>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-lg border border-[#2A4B38] bg-[#1D3B2C] text-[#F2EFE6] px-3 py-2 text-sm"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Card>

      <Card>
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-[#F2EFE6]">Dark Mode</p>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-11 h-6 rounded-full relative transition-colors"
            style={{ backgroundColor: darkMode ? '#D4A24E' : '#2A4B38' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-transform bg-[#0E1F18]"
              style={{ transform: darkMode ? 'translateX(22px)' : 'translateX(2px)' }}
            >
              {darkMode ? <Moon size={11} className="text-[#D4A24E]" /> : <Sun size={11} className="text-[#8FA895]" />}
            </span>
          </button>
        </div>
      </Card>
    </div>
  );
}