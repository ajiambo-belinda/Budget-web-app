import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { TYPE_CATS } from '../utils/currency';

export default function AddScreen({ editingTx, onDone }) {
  const { addTransaction, updateTransaction } = useBudget();
  const [type, setType] = useState(editingTx?.type || 'expense');
  const [amount, setAmount] = useState(editingTx ? String(editingTx.amount) : '');
  const [category, setCategory] = useState(editingTx?.category || TYPE_CATS.expense[0]);
  const [date, setDate] = useState(editingTx?.date || new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(editingTx?.note || '');
  const [error, setError] = useState('');

  const cats = TYPE_CATS[type];

  function handleTypeChange(t) {
    setType(t);
    setCategory(TYPE_CATS[t][0]);
  }

  function handleSave() {
    const n = parseFloat(amount);
    if (!amount || isNaN(n) || n <= 0) {
      setError('Enter a positive amount.');
      return;
    }
    setError('');
    const payload = { type, amount: n, category, date, note: note.trim() };
    if (editingTx) {
      updateTransaction({ ...editingTx, ...payload });
    } else {
      addTransaction(payload);
    }
    setAmount('');
    setNote('');
    onDone();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold mb-4 text-[var(--color-text)]">
        {editingTx ? 'Edit Transaction' : 'Add Transaction'}
      </h1>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {['expense', 'income', 'savings', 'investment'].map((t) => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
            className={`py-2.5 rounded-xl border text-sm font-semibold capitalize transition-colors ${
              type === t
                ? 'bg-[var(--color-selected)] text-[var(--color-selected-text)] border-[var(--color-selected)]'
                : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border-[var(--color-border)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <label className="text-xs font-semibold text-[var(--color-text-muted)]">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2.5 mt-1 mb-1 text-sm outline-none"
      />
      {error && <p className="text-xs text-[var(--color-rust)] mb-3">{error}</p>}

      <label className="text-xs font-semibold text-[var(--color-text-muted)]">Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2.5 mt-1 mb-3 text-sm"
      >
        {cats.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label className="text-xs font-semibold text-[var(--color-text-muted)]">Date</label>
<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2.5 mt-1 mb-3 text-sm"
  style={{ colorScheme: 'dark' }}
/>

      <label className="text-xs font-semibold text-[var(--color-text-muted)]">Note (optional)</label>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Groceries"
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2.5 mt-1 mb-4 text-sm"
      />

      <button
        onClick={handleSave}
        className="w-full py-3 rounded-xl font-bold text-sm bg-[var(--color-selected)] text-[var(--color-selected-text)]"
      >
        {editingTx ? 'Save Changes' : 'Add Transaction'}
      </button>
    </div>
  );
}