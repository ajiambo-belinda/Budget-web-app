import { useState } from 'react';
import { Trash2, Target } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { fmt } from '../utils/currency';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

export default function GoalsScreen() {
  const { goals, addGoal, contributeToGoal, deleteGoal, currency } = useBudget();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');

  const [drafts, setDrafts] = useState({});

  function handleAddGoal() {
    const t = parseFloat(target);
    if (!name.trim()) {
      setError('Give your goal a name.');
      return;
    }
    if (!target || isNaN(t) || t <= 0) {
      setError('Enter a target amount greater than 0.');
      return;
    }
    setError('');
    addGoal(name.trim(), t, targetDate || null);
    setName('');
    setTarget('');
    setTargetDate('');
    setShowForm(false);
  }

  function handleContribute(id) {
    const v = parseFloat(drafts[id]);
    if (!isNaN(v) && v > 0) {
      contributeToGoal(id, v);
    }
    setDrafts((d) => ({ ...d, [id]: '' }));
  }

  function handleDelete(id) {
    if (window.confirm('Delete this savings goal? This will not remove past contributions from your transactions.')) {
      deleteGoal(id);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-serif text-2xl font-semibold text-[var(--color-text)]">Savings Goals</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-3 py-2 rounded-lg text-xs font-bold bg-[var(--color-selected)] text-[var(--color-selected-text)]"
        >
          {showForm ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <label className="text-xs font-semibold text-[var(--color-text-muted)]">Goal Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emergency Fund"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-3 py-2 mt-1 mb-3 text-sm outline-none"
          />

          <label className="text-xs font-semibold text-[var(--color-text-muted)]">Target Amount</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-3 py-2 mt-1 mb-3 text-sm outline-none"
          />

          <label className="text-xs font-semibold text-[var(--color-text-muted)]">Target Date (optional)</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-3 py-2 mt-1 mb-3 text-sm"
            style={{ colorScheme: 'dark' }}
          />

          {error && <p className="text-xs text-[var(--color-rust)] mb-3">{error}</p>}

          <button
            onClick={handleAddGoal}
            className="w-full py-2.5 rounded-xl font-bold text-sm bg-[var(--color-selected)] text-[var(--color-selected-text)]"
          >
            Create Goal
          </button>
        </Card>
      )}

      {goals.length === 0 && !showForm && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <Target size={28} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
          <p className="text-sm text-[var(--color-text-muted)]">
            No savings goals yet. Tap "+ New Goal" to create one.
          </p>
        </div>
      )}

      {goals.map((g) => {
        const progress = g.target ? g.saved / g.target : 0;
        const isComplete = g.saved >= g.target;

        return (
          <Card key={g.id} className="mb-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">{g.name}</p>
                {g.targetDate && (
                  <p className="text-[10px] text-[var(--color-text-muted)]">Target: {g.targetDate}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  {fmt(g.saved, currency)} / {fmt(g.target, currency)}
                </p>
                <button onClick={() => handleDelete(g.id)} className="p-1 shrink-0">
                  <Trash2 size={14} className="text-[var(--color-rust)]" />
                </button>
              </div>
            </div>

            <div className="mb-3">
              <ProgressBar progress={progress} />
            </div>

            {isComplete ? (
              <p className="text-[11px] font-semibold text-[var(--color-good)]">Goal reached! 🎉</p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Add funds"
                  value={drafts[g.id] || ''}
                  onChange={(e) => setDrafts((d) => ({ ...d, [g.id]: e.target.value }))}
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-2 py-1.5 text-xs"
                />
                <button
                  onClick={() => handleContribute(g.id)}
                  className="px-3 rounded-lg text-xs font-bold bg-[var(--color-accent)] text-[var(--color-selected-text)]"
                >
                  Add
                </button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
