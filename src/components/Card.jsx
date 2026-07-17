export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl p-4 mb-3 border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}>
      {children}
    </div>
  );
}