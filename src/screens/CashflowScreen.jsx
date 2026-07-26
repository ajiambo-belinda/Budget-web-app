import { useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';

function formatMoney(n, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toFixed(0)}`;
  }
}

function monthLabel(key) {
  const [y, m] = key.split('-');
  return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', { month: 'short' });
}

export default function CashflowScreen() {
  const { transactions, currency } = useBudget();

  const monthly = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (!map[key]) map[key] = { key, income: 0, expense: 0, savings: 0, investment: 0 };
      if (t.type === 'income') map[key].income += t.amount;
      else if (t.type === 'expense') map[key].expense += t.amount;
      else if (t.type === 'savings') map[key].savings += t.amount;
      else if (t.type === 'investment') map[key].investment += t.amount;
    });
    const sorted = Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
    let running = 0;
    return sorted.map((m) => {
      const net = m.income - m.expense - m.savings - m.investment;
      running += net;
      return { ...m, net, balance: running };
    });
  }, [transactions]);

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalSavings = transactions.filter((t) => t.type === 'savings').reduce((s, t) => s + t.amount, 0);
  const totalInvestment = transactions.filter((t) => t.type === 'investment').reduce((s, t) => s + t.amount, 0);
  const netCashflow = totalIncome - totalExpense - totalSavings - totalInvestment;
  const maxBar = Math.max(1, ...monthly.map((m) => Math.max(m.income, m.expense)));

  const balances = monthly.map((m) => m.balance);
  const minBal = Math.min(0, ...balances);
  const maxBal = Math.max(0, ...balances);
  const range = maxBal - minBal || 1;

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold mb-4 text-[var(--color-text)]">Cashflow</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
            <TrendingUp size={14} className="text-[var(--color-good)]" /> Total Income
          </div>
          <div className="text-xl font-bold text-[var(--color-text)]">{formatMoney(totalIncome, currency)}</div>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
            <TrendingDown size={14} className="text-[var(--color-rust)]" /> Total Expenses
          </div>
          <div className="text-xl font-bold text-[var(--color-text)]">{formatMoney(totalExpense, currency)}</div>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
            <Scale size={14} style={{ color: 'var(--color-selected)' }} /> Net Cashflow
          </div>
          <div className="text-xl font-bold" style={{ color: netCashflow >= 0 ? 'var(--color-good)' : 'var(--color-rust)' }}>
            {netCashflow >= 0 ? '+' : ''}{formatMoney(netCashflow, currency)}
          </div>
        </div>
      </div>

      {monthly.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">No transactions yet — add some to see your cashflow trend.</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 mb-4">
            <div className="text-sm font-semibold text-[var(--color-text)] mb-4">Income vs Expenses</div>
            <div className="flex items-end gap-4 h-40">
              {monthly.map((m) => (
                <div key={m.key} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    <div
                      className="w-2.5 rounded-t"
                      style={{ height: `${(m.income / maxBar) * 100}%`, background: 'var(--color-good)', minHeight: m.income > 0 ? 3 : 0 }}
                      title={`Income: ${formatMoney(m.income, currency)}`}
                    />
                    <div
                      className="w-2.5 rounded-t"
                      style={{ height: `${(m.expense / maxBar) * 100}%`, background: 'var(--color-rust)', minHeight: m.expense > 0 ? 3 : 0 }}
                      title={`Expenses: ${formatMoney(m.expense, currency)}`}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{monthLabel(m.key)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-good)' }} /> Income</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-rust)' }} /> Expenses</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="text-sm font-semibold text-[var(--color-text)] mb-4">Running Balance Trend</div>
            <svg viewBox="0 0 300 100" className="w-full h-32" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="var(--color-selected)"
                strokeWidth="2"
                points={monthly.map((m, i) => {
                  const x = monthly.length === 1 ? 150 : (i / (monthly.length - 1)) * 300;
                  const y = 90 - ((m.balance - minBal) / range) * 80;
                  return `${x},${y}`;
                }).join(' ')}
              />
              {monthly.map((m, i) => {
                const x = monthly.length === 1 ? 150 : (i / (monthly.length - 1)) * 300;
                const y = 90 - ((m.balance - minBal) / range) * 80;
                return <circle key={m.key} cx={x} cy={y} r="2.5" fill="var(--color-selected)" />;
              })}
            </svg>
            <div className="flex justify-between mt-2 text-[10px] text-[var(--color-text-muted)]">
              {monthly.map((m) => <span key={m.key}>{monthLabel(m.key)}</span>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}