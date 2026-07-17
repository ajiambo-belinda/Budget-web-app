export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl p-4 mb-3 border border-[#2A4B38] bg-[#163024] ${className}`}>
      {children}
    </div>
  );
}