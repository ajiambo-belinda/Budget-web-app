import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { api } from '../utils/api';

export default function AssistantScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your Fedha assistant. Ask me anything about your spending, budgets, or savings goals." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      // Send prior turns (excluding the initial greeting) so the AI has conversation context
      const history = messages.slice(1);
      const { reply } = await api.post('/assistant', { message: trimmed, history });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-[var(--color-accent)]" />
        <h1 className="font-serif text-2xl font-semibold text-[var(--color-text)]">AI Assistant</h1>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 min-h-[300px]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === 'user'
                ? 'self-end bg-[var(--color-selected)] text-[var(--color-selected-text)] rounded-br-sm'
                : 'self-start bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-bl-sm'
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="self-start px-4 py-2.5 rounded-2xl rounded-bl-sm bg-[var(--color-surface)] border border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)]">Thinking...</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && <p className="text-xs text-[var(--color-rust)] mb-2">{error}</p>}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your spending, budgets, or goals..."
          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] px-4 py-3 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-4 rounded-xl disabled:opacity-50"
          style={{ background: 'var(--color-selected)', color: 'var(--color-selected-text)' }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
