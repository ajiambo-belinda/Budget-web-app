import { useState } from 'react';
import { HandCoins, Upload, User } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

export default function ProfileSetupScreen({ onSwitchToLogin }) {
  const { signup, authError } = useBudget();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Enter your name to continue.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);
    const success = await signup({ name: name.trim(), email: email.trim(), password, photo });
    setLoading(false);

    if (!success) {
      setError(authError || 'Signup failed. Please try again.');
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
          <h1 className="font-serif text-xl font-bold text-[var(--color-text)]">Create Your Account</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 text-center">
            Set up your profile to start using Fedha.
          </p>
        </div>

        <div className="flex flex-col items-center mb-5">
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)]">
              {photo ? (
                <img src={photo} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-[var(--color-text-muted)]" />
              )}
            </div>
          </label>
          <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          <label htmlFor="photo-upload" className="flex items-center gap-1 mt-2 text-[11px] font-semibold cursor-pointer text-[var(--color-accent)]">
            <Upload size={12} />
            {photo ? 'Change photo' : 'Upload photo (optional)'}
          </label>
        </div>

        <label className="text-xs font-semibold text-[var(--color-text-muted)]">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lyndah Ajiambo"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-3 py-2.5 mt-1 mb-3 text-sm outline-none"
        />

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
          placeholder="At least 6 characters"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-3 py-2.5 mt-1 mb-2 text-sm outline-none"
        />

        {error && <p className="text-xs text-[var(--color-rust)] mt-2 mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm mt-4 disabled:opacity-60"
          style={{ background: 'var(--color-selected)', color: 'var(--color-selected-text)' }}
        >
          {loading ? 'Creating account...' : 'Get Started'}
        </button>

        <p className="text-xs text-center mt-4 text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-semibold text-[var(--color-accent)]">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
