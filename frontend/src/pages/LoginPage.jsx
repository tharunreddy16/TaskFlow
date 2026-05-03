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

  return (
    <AuthShell 
      title="Sign in" 
      subtitle="Welcome back to TaskFlow"
    >
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
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: 'hidden',
    }}>
      {/* ── Left Side: Form ── */}
      <div style={{ 
        flex: '1', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Ambient orbs for left side */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: -1 }} />

        <div style={{ width: '100%', maxWidth: 400, animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {/* Logo (Mobile/Small screens) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(139,92,246,0.4)' }}>
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="2" fill="white" opacity="0.95"/>
                <rect x="10" y="2" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="2" y="10" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="10" y="10" width="6" height="6" rx="2" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.8px', fontFamily: 'Outfit' }}>TaskFlow</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 8, fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>{title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32 }}>{subtitle}</p>

          <div className="glass-panel" style={{ borderRadius: 24, padding: '36px', border: '1px solid rgba(255,255,255,0.1)' }}>
            {children}
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, marginTop: 28 }}>
            🔒 Secured with AES-256 encryption
          </p>
        </div>
      </div>

      {/* ── Right Side: Brand Marketing ── */}
      <div style={{ 
        flex: '1.2', 
        background: 'linear-gradient(135deg, #0a0a0f 0%, #050507 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }} className="hide-on-mobile">
        {/* Animated Background Elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        {/* Grid Pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px', opacity: 0.5 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 540 }}>
          <div style={{ marginBottom: 40, animation: 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <h2 style={{ fontSize: 64, fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24, fontFamily: 'Outfit' }}>
              Elevate your <br />
              <span className="gradient-text">Productivity.</span>
            </h2>
            <p style={{ fontSize: 20, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 48 }}>
              Experience the future of task management with a FAANG-level interface designed for high-performance teams.
            </p>
          </div>

          {/* Feature Bento mini-grid on right side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, animation: 'fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="glass-card" style={{ padding: 24, background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Ultra Fast</h4>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>Engineered for speed and seamless flow.</p>
            </div>
            <div className="glass-card" style={{ padding: 24, background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🛡️</div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Secure</h4>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>Your data is encrypted and private.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
