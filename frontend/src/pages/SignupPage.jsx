import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Field, Btn, Spinner } from '../components/UI';

export default function SignupPage({ toast }) {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast('Password must be at least 6 characters', 'error');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast('Account created — welcome!');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="2" fill="white" opacity="0.9"/>
                <rect x="10" y="2" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="2" y="10" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="10" y="10" width="6" height="6" rx="2" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.4px' }}>TaskFlow</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Create your free account</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 32px' }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 22 }}>Create account</h1>
          <form onSubmit={handleSubmit}>
            <Field label="Full name" value={form.name} onChange={set('name')} placeholder="Your name" required />
            <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
            <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required />
            <Btn type="submit" disabled={loading} style={{ width: '100%', marginTop: 4, padding: '11px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}>
              {loading ? <><Spinner /> Creating account…</> : 'Create account'}
            </Btn>
          </form>
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
