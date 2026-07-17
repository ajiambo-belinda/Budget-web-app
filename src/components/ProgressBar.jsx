export default function ProgressBar({ progress }) {
  const pct = Math.min(Math.max(progress, 0), 1);
  const color = pct >= 1 ? '#C1554B' : pct >= 0.8 ? '#D4A24E' : '#5CA88F';
  return (
    <div className="w-full h-2 rounded-full overflow-hidden bg-[#1D3B2C]">
      <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, backgroundColor: color }} />
    </div>
  );
}