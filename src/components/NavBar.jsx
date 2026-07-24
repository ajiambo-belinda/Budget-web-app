import { Home, List, PlusCircle, Target, Settings as SettingsIcon, Wallet } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'transactions', label: 'Log', icon: List },
  { id: 'add', label: 'Add', icon: PlusCircle },
  { id: 'budget', label: 'Goals', icon: Target },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function NavBar({ tab, setTab }) {
  return (
    <>
      {/* Desktop / tablet: top nav — hidden on small screens */}
      <div className="hidden sm:flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-2">
          
         <Wallet size={22} className="text-[var(--color-accent)]" />

<h1 className="font-serif text-xl font-bold text-[var(--color-accent)]">
  Fedha
</h1>
        </div>
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                tab === id ? 'bg-[var(--color-surface-alt)] text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: bottom nav — only visible on small screens */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-surface)] py-2 z-10">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className="flex flex-col items-center gap-1 px-2 py-1">
            <Icon size={20} className={tab === id ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'} />
            <span className={`text-[10px] font-medium ${tab === id ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}