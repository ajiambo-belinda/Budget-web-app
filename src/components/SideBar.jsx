import { LayoutDashboard, Receipt, PieChart, Target, BarChart3, Settings as SettingsIcon, Wallet, Plus, X, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
 { id: 'cashflow', label: 'Cashflow', icon: Activity },
  { id: 'budget', label: 'Budgets', icon: PieChart },
  { id: 'goals', label: 'Savings Goals', icon: Target },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar({ tab, setTab, sidebarOpen, setSidebarOpen, onAdd }) {
  return (
    <>
      <aside
        className={`absolute lg:static z-30 h-full w-64 p-5 flex flex-col justify-between transition-transform duration-300 border-r border-[var(--color-border)] bg-[var(--color-surface)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="px-2 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-selected)' }}>
                <Wallet size={18} color="#fff" />
              </div>
              <span className="font-serif text-lg font-bold text-[var(--color-text)]">Fedha</span>
            </div>
            <button className="lg:hidden text-[var(--color-text-muted)]" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => { setTab(id); setSidebarOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors duration-200"
                  style={{
                    background: active ? 'var(--color-surface-alt)' : 'transparent',
                    color: active ? 'var(--color-selected)' : 'var(--color-text-muted)',
                  }}
                >
                  <Icon size={18} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold"
          style={{ background: 'var(--color-selected)', color: 'var(--color-selected-text)' }}
        >
          <Plus size={16} /> Add Transaction
        </button>
      </aside>

      {sidebarOpen && <div className="absolute inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </>
  );
}