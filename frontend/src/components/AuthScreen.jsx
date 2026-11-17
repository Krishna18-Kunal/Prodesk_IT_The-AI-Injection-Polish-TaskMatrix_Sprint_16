
import { useState } from 'react';
import { CheckCircle2, LockKeyhole, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { authenticate } = useAuth();
  const [mode, setMode] = useState('login');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      const payload = mode === 'login'
        ? {
            email: form.email.trim(),
            password: form.password
          }
        : {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password
          };

      const data = await apiRequest(
        `/auth/${mode === 'login' ? 'login' : 'register'}`,
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      );

      authenticate(data);

      toast.success(
        mode === 'login'
          ? 'Welcome back!'
          : 'Account created successfully'
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <div className="brand">
          <span className="brand-mark">T</span> TaskMatrix
        </div>

        <div className="story-copy">
          <span className="eyebrow">
            <Sparkles size={14} /> YOUR PERSONAL WORKSPACE
          </span>

          <h1>
            Make space for<br />
            <em>meaningful work.</em>
          </h1>

          <p>
            Bring your tasks into focus. Plan the next step,
            keep momentum, and make progress you can see.
          </p>

          <div className="story-points">
            <span><CheckCircle2 size={17} /> A clear view of your priorities</span>
            <span><CheckCircle2 size={17} /> AI-powered task breakdowns</span>
            <span><CheckCircle2 size={17} /> Your work, organized in one place</span>
          </div>
        </div>

        <div className="story-foot">
          Plan clearly. Execute confidently.
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand brand">
            <span className="brand-mark">T</span> TaskMatrix
          </div>

          <div className="auth-icon">
            <LockKeyhole size={22} />
          </div>

          <span className="eyebrow">GET STARTED</span>

          <h2>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>

          <p className="muted">
            {mode === 'login'
              ? 'Sign in to continue to your workspace.'
              : 'A few details and your workspace is ready.'}
          </p>

          <form onSubmit={submit} className="form-stack">
            {mode === 'register' && (
              <label>
                Your name
                <input
                  required
                  minLength="2"
                  maxLength="60"
                  value={form.name}
                  onChange={e =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Your name"
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                required
                value={form.email}
                onChange={e =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                required
                minLength="8"
                value={form.password}
                onChange={e =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="At least 8 characters"
              />
            </label>

            <button className="primary-btn full" disabled={busy}>
              {busy
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>

          <p className="switch-auth">
            {mode === 'login'
              ? 'New to TaskMatrix?'
              : 'Already have an account?'}{' '}

            <button
              type="button"
              onClick={() =>
                setMode(mode === 'login' ? 'register' : 'login')
              }
            >
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
