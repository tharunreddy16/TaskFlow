import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Field, Btn, Spinner } from '../components/UI';

export default function LoginPage({ toast }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return <AuthShell title="Sign in" subtitle="Welcome back to TaskFlow" form={form} isLogin>
    <form onSubmit={handleSubmit}>
      <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
      <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
      <Btn type="submit" disabled={loading} style={{ width: '100%', marginTop: 8, padding: '14px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, borderRadius: 14 }}>
        {loading ? <><Spinner /> Signing in…</> : 'Sign in →'}
      </Btn>
    </form>
    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginTop: 24 }}>
      No account?{' '}
      <Link to="/signup" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Create one free</Link>
    </p>
  </AuthShell>;
}

function AuthShell({ title, subtitle, children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'fixed', top: '10%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(139,92,246,0.5)' }}>
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="2" fill="white" opacity="0.95"/>
                <rect x="10" y="2" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="2" y="10" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="10" y="10" width="6" height="6" rx="2" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.8px', fontFamily: 'Outfit' }}>TaskFlow</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: 0 }}>{subtitle}</p>
        </div>

        {/* Glass Card */}
        <div className="glass-panel" style={{ borderRadius: 24, padding: '36px 40px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 28, fontFamily: 'Outfit', letterSpacing: '-0.3px' }}>{title}</h1>
          {children}
        </div>

        {/* Footer badge */}
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, marginTop: 28 }}>
          🔒 Secured with AES-256 encryption
        </p>
      </div>
    </div>
  );
}
