import { useState } from 'react';
import { HandCoins } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

export default function LoginScreen({ onSwitchToSignup }) {
  const { login, authError } = useBudget();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setError('');
    setLoading(true);
    const success = await login({ email: email.trim(), password });
    setLoading(false);

    if (!success) {
      setError(authError || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="min-h-[100svh] w-full flex items-center justify-center bg-[var(--color-bg)] px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'var(--color-selected)' }}
          >
            <HandCoins size={22} color="#fff" />
          </div>
          <h1 className="font-serif text-xl font-bold text-[var(--color-text)]">Welcome Back</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 text-center">
            Log in to continue to Fedha.
          </p>
        </div>

        <label className="text-xs font-semibold text-[var(--color-text-muted)]">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-3 py-2.5 mt-1 mb-3 text-sm outline-none"
        />

        <label className="text-xs font-semibold text-[var(--color-text-muted)]">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-3 py-2.5 mt-1 mb-2 text-sm outline-none"
        />

        {error && <p className="text-xs text-[var(--color-rust)] mt-2 mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm mt-4 disabled:opacity-60"
          style={{ background: 'var(--color-selected)', color: 'var(--color-selected-text)' }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-xs text-center mt-4 text-[var(--color-text-muted)]">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="font-semibold text-[var(--color-accent)]">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
