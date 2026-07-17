export default function ProgressBar({ progress }) {
  const pct = Math.min(Math.max(progress, 0), 1);
  const color = pct >= 1 ? 'var(--color-rust)' : pct >= 0.8 ? 'var(--color-gold)' : 'var(--color-good)';
  return (
    <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--color-surface-alt)]">
      <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, backgroundColor: color }} />
    </div>
  );
}