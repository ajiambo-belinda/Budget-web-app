import { useMemo, useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { EXPENSE_CATS, fmt } from '../utils/currency';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

export default function BudgetScreen() {
  const { transactions, budgets, setBudgetLimit, currency } = useBudget();
  const [drafts, setDrafts] = useState({});

  const spentByCategory = useMemo(() => {
    const map = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [transactions]);

  function handleSetLimit(cat) {
    const v = parseFloat(drafts[cat]);
    if (!isNaN(v) && v >= 0) setBudgetLimit(cat, v);
    setDrafts((d) => ({ ...d, [cat]: '' }));
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold mb-1 text-[#F2EFE6]">Budget Goals</h1>
      <p className="text-xs mb-4 text-[var(--color-text-muted)]">Set a monthly limit per category.</p>

      {EXPENSE_CATS.map((cat) => {
        const limit = budgets[cat];
        const spent = spentByCategory[cat] || 0;
        const progress = limit ? spent / limit : 0;

        return (
          <Card key={cat}>
            <div className="flex justify-between mb-2">
              <p className="text-sm font-semibold text-[#F2EFE6]">{cat}</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                {fmt(spent, currency)}{limit ? ` / ${fmt(limit, currency)}` : ''}
              </p>
            </div>
            {limit ? (
              <div className="mb-3"><ProgressBar progress={progress} /></div>
            ) : (
              <p className="text-[11px] mb-3 text-[var(--color-text-muted)]">No limit set.</p>
            )}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={limit ? String(limit) : 'Set limit'}
                value={drafts[cat] || ''}
                onChange={(e) => setDrafts((d) => ({ ...d, [cat]: e.target.value }))}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[#F2EFE6] px-2 py-1.5 text-xs"
              />
              <button
                onClick={() => handleSetLimit(cat)}
                className="px-3 rounded-lg text-xs font-bold bg-[var(--color-gold)] text-[var(--color-bg)]"
              >
                Set
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}