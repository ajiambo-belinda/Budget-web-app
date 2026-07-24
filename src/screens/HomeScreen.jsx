import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useBudget } from '../context/BudgetContext';
import { fmt, CATEGORY_COLORS } from '../utils/currency';
import Card from '../components/Card';

export default function HomeScreen() {
  const { transactions, currency } = useBudget();

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    const byCat = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        byCat[t.category] = (byCat[t.category] || 0) + t.amount;
      });
    return Object.entries(byCat).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold mb-4 text-[var(--color-text)]">Overview</h1>

      <Card className="bg-[var(--color-surface-alt)]">
        <p className="text-xs mb-1 text-[var(--color-text-muted)]">Total Balance</p>
        <p className="font-serif text-3xl font-bold text-[var(--color-accent)]]">{fmt(totals.balance, currency)}</p>
      </Card>

      <div className="flex gap-3 mb-4">
        <Card className="flex-1 mb-0!">
          <p className="text-[11px] mb-1 text-[var(--color-text-muted)]">Income</p>
          <p className="text-lg font-bold text-[var(--color-accent)]">{fmt(totals.income, currency)}</p>
        </Card>
        <Card className="flex-1 mb-0!">
          <p className="text-[11px] mb-1 text-[var(--color-text-muted)]">Expenses</p>
          <p className="text-lg font-bold text-[var(--color-rust)]">{fmt(totals.expense, currency)}</p>
        </Card>
      </div>

      <h2 className="text-sm font-semibold mb-2 text-[var(--color-text)]">Spending by Category</h2>
      {chartData.length > 0 ? (
        <Card>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} paddingAngle={2}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[entry.name] || 'var(--color-text-muted)'} stroke="var(--color-surface)" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
            {chartData.map((c) => (
              <div key={c.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c.name] }} />
                <span className="text-[11px] text-[var(--color-text-muted)]">{c.name}</span>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">No expenses recorded yet.</p>
        </Card>
      )}
    </div>
  );
}