import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { EXPENSE_CATS, INCOME_CATS, fmt, CATEGORY_COLORS } from '../utils/currency';

export default function TransactionsScreen({ onEdit }) {
  const { transactions, deleteTransaction, currency } = useBudget();
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  const allCats = useMemo(() => Array.from(new Set([...EXPENSE_CATS, ...INCOME_CATS])), []);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (typeFilter === 'all' ? true : t.type === typeFilter))
      .filter((t) => (catFilter === 'all' ? true : t.category === catFilter))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, typeFilter, catFilter]);

  function handleDelete(id) {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(id);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold mb-3 text-[#F2EFE6]">Transactions</h1>

      <div className="flex gap-2 mb-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="flex-1 text-xs rounded-lg px-2 py-2 border border-[#2A4B38] bg-[#163024] text-[#F2EFE6]"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="flex-1 text-xs rounded-lg px-2 py-2 border border-[#2A4B38] bg-[#163024] text-[#F2EFE6]"
        >
          <option value="all">All Categories</option>
          {allCats.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-center mt-8 text-[#8FA895]">No transactions match these filters.</p>
      )}

      {filtered.map((t) => (
        <div key={t.id} className="flex items-center gap-3 rounded-xl p-3 mb-2 border border-[#2A4B38] bg-[#163024]">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[t.category] }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-[#F2EFE6]">{t.category}</p>
            {t.note && <p className="text-[11px] truncate text-[#8FA895]">{t.note}</p>}
            <p className="text-[10px] text-[#8FA895]">{t.date}</p>
          </div>
          <p className={`text-sm font-bold shrink-0 ${t.type === 'income' ? 'text-[#5CA88F]' : 'text-[#C1554B]'}`}>
            {t.type === 'income' ? '+' : '-'}{fmt(t.amount, currency)}
          </p>
          <button onClick={() => onEdit(t)} className="p-1 shrink-0">
            <Pencil size={14} className="text-[#8FA895]" />
          </button>
          <button onClick={() => handleDelete(t.id)} className="p-1 shrink-0">
            <Trash2 size={14} className="text-[#C1554B]" />
          </button>
        </div>
      ))}
    </div>
  );
}