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
      <div className="hidden sm:flex items-center justify-between px-6 py-4 border-b border-[#2A4B38] bg-[#163024]">
        <h1 className="font-serif text-xl font-bold text-[#D4A24E]">Fedha</h1>
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                tab === id ? 'bg-[#1D3B2C] text-[#D4A24E]' : 'text-[#8FA895]'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: bottom nav — only visible on small screens */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-[#2A4B38] bg-[#163024] py-2 z-10">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className="flex flex-col items-center gap-1 px-2 py-1">
            <Icon size={20} className={tab === id ? 'text-[#D4A24E]' : 'text-[#8FA895]'} />
            <span className={`text-[10px] font-medium ${tab === id ? 'text-[#D4A24E]' : 'text-[#8FA895]'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}