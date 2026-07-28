import { useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useBudget } from '../context/BudgetContext';
import { fmt, CATEGORY_COLORS } from '../utils/currency';
import Card from '../components/Card';

const MONTHS_BACK = 6;

const BREAKDOWN_TYPES = [
  { id: 'expense', label: 'Expense' },
  { id: 'savings', label: 'Savings' },
  { id: 'investment', label: 'Investment' },
];

function monthKey(dateStr) {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

function monthLabel(key) {
  const [year, month] = key.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short' });
}

export default function ReportsScreen() {
  const { transactions, currency } = useBudget();
  const [breakdownType, setBreakdownType] = useState('expense');

  // Build the list of the last N month keys, oldest first
  const monthKeys = useMemo(() => {
    const keys = [];
    const now = new Date();
    for (let i = MONTHS_BACK - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return keys;
  }, []);

  const inRange = useMemo(() => {
    const earliest = monthKeys[0];
    return transactions.filter((t) => monthKey(t.date) >= earliest);
  }, [transactions, monthKeys]);

  // Category totals for whichever type is selected (expense / savings / investment)
  const categoryTotals = useMemo(() => {
    const map = {};
    inRange
      .filter((t) => t.type === breakdownType)
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [inRange, breakdownType]);

  const totalForType = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  // Monthly net savings — income minus everything that leaves spendable cash
  const monthlyNet = useMemo(() => {
    return monthKeys.map((key) => {
      const sumFor = (type) =>
        inRange
          .filter((t) => t.type === type && monthKey(t.date) === key)
          .reduce((sum, t) => sum + t.amount, 0);

      const income = sumFor('income');
      const expense = sumFor('expense');
      const savings = sumFor('savings');
      const investment = sumFor('investment');

      return { month: monthLabel(key), net: income - expense - savings - investment };
    });
  }, [inRange, monthKeys]);

  const breakdownLabel = BREAKDOWN_TYPES.find((b) => b.id === breakdownType)?.label;

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold mb-1 text-[var(--color-text)]">Reports</h1>
      <p className="text-xs mb-4 text-[var(--color-text-muted)]">Last {MONTHS_BACK} months.</p>

      {/* Type toggle for breakdown sections */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {BREAKDOWN_TYPES.map((b) => (
          <button
            key={b.id}
            onClick={() => setBreakdownType(b.id)}
            className={`py-2 rounded-xl border text-xs font-semibold transition-colors ${
              breakdownType === b.id
                ? 'bg-[var(--color-selected)] text-[var(--color-selected-text)] border-[var(--color-selected)]'
                : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border-[var(--color-border)]'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Breakdown by category — pie chart */}
      <Card className="mb-4">
        <p className="text-sm font-semibold mb-3 text-[var(--color-text)]">{breakdownLabel} by Category</p>
        {categoryTotals.length === 0 ? (
          <p className="text-[11px] text-[var(--color-text-muted)]">No {breakdownLabel.toLowerCase()} transactions in this period.</p>
        ) : (
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {categoryTotals.map((entry) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || 'var(--color-accent)'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => fmt(value, currency)}
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: 'var(--color-text)' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: 'var(--color-text-muted)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Monthly net savings */}
      <Card className="mb-4">
        <p className="text-sm font-semibold mb-3 text-[var(--color-text)]">Monthly Net Savings</p>
        <p className="text-[10px] mb-3 text-[var(--color-text-muted)]">Income minus expenses, savings, and investments.</p>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={monthlyNet}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
              <Tooltip
                formatter={(value) => fmt(value, currency)}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--color-text)' }}
              />
              <Bar dataKey="net" radius={[6, 6, 0, 0]}>
                {monthlyNet.map((entry, i) => (
                  <Cell key={i} fill={entry.net >= 0 ? 'var(--color-good)' : 'var(--color-rust)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category breakdown table */}
      <Card>
        <p className="text-sm font-semibold mb-3 text-[var(--color-text)]">{breakdownLabel} Breakdown</p>
        {categoryTotals.length === 0 ? (
          <p className="text-[11px] text-[var(--color-text-muted)]">No {breakdownLabel.toLowerCase()} transactions in this period.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {categoryTotals.map(({ category, total }) => {
              const pct = totalForType ? (total / totalForType) * 100 : 0;
              return (
                <div key={category} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[category] || 'var(--color-accent)' }}
                  />
                  <span className="flex-1 text-xs text-[var(--color-text)]">{category}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{pct.toFixed(1)}%</span>
                  <span className="text-xs font-semibold text-[var(--color-text)] w-20 text-right">
                    {fmt(total, currency)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
