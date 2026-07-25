import { Menu } from 'lucide-react';

const TITLES = {
  home: 'Dashboard',
  transactions: 'Transactions',
  cashflow: 'Cashflow',
  budget: 'Budgets',
  goals: 'Savings Goals',
  reports: 'Reports',
  settings: 'Settings',
  add: 'Add Transaction',
};

export default function TopBar({ tab, setSidebarOpen }) {
  return (
    <header className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-10">
      <button className="lg:hidden text-[var(--color-text)]" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <h1 className="font-serif text-lg font-bold text-[var(--color-text)]">{TITLES[tab] || 'Fedha'}</h1>
    </header>
  );
}