import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Field, Btn, Spinner } from '../components/UI';
import { AuthShell } from './LoginPage';

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
    <AuthShell 
      title="Create Account" 
      subtitle="Join TaskFlow today"
    >
      <form onSubmit={handleSubmit}>
        <Field label="Full name" value={form.name} onChange={set('name')} placeholder="Your name" required />
        <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
        <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required />
        <Btn type="submit" disabled={loading} style={{ width: '100%', marginTop: 8, padding: '14px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, borderRadius: 14 }}>
          {loading ? <><Spinner /> Creating account…</> : 'Create account →'}
        </Btn>
      </form>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginTop: 24 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
      </p>
    </AuthShell>
  );
}
