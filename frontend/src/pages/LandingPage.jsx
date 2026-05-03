import { Link } from 'react-router-dom';
import { Btn } from '../components/UI';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(5,5,7,0.5)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(139,92,246,0.4)' }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="2" fill="white" opacity="0.9"/>
              <rect x="10" y="2" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
              <rect x="2" y="10" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
              <rect x="10" y="10" width="6" height="6" rx="2" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit' }}>TaskFlow</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Sign in</Link>
          <Link to="/signup">
            <Btn style={{ borderRadius: 10, padding: '10px 20px' }}>Get Started</Btn>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '160px 20px 100px', textAlign: 'center', position: 'relative' }}>
        <div className="hero-gradient" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', pointerEvents: 'none' }} />
        
        <div className="animate-fadeup" style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 30, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa', fontSize: 13, fontWeight: 600, marginBottom: 24, letterSpacing: '0.5px' }}>
            <span style={{ animation: 'spin 2s linear infinite' }}>✨</span> NEW: AI-POWERED TASK MANAGEMENT
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 24, fontFamily: 'Outfit' }}>
            Master your workflow with <span className="gradient-text">extreme precision.</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            TaskFlow is the elite project management suite built for high-performance teams who demand speed, aesthetics, and reliability.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/signup">
              <Btn style={{ padding: '16px 32px', fontSize: 16, borderRadius: 14 }}>Start your journey →</Btn>
            </Link>
            <Btn variant="ghost" style={{ padding: '16px 32px', fontSize: 16, borderRadius: 14 }}>Watch Demo</Btn>
          </div>
        </div>

        {/* Dashboard Preview Overlay */}
        <div className="animate-fadeup" style={{ marginTop: 80, perspective: '2000px', animationDelay: '0.2s' }}>
          <div style={{ 
            maxWidth: 1000, margin: '0 auto', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: 24, padding: 12,
            boxShadow: '0 50px 100px rgba(0,0,0,0.5), 0 0 100px rgba(139,92,246,0.1)',
            transform: 'rotateX(15deg) translateY(0)',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'rotateX(5deg) translateY(-20px)'} onMouseLeave={e => e.currentTarget.style.transform = 'rotateX(15deg) translateY(0)'}>
            <div style={{ borderRadius: 12, overflow: 'hidden', background: '#0a0a0f', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
              <div style={{ textAlign: 'center' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16, opacity: 0.5 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
                <div style={{ fontSize: 18, fontWeight: 500 }}>Interactive Dashboard Preview</div>
                <div style={{ fontSize: 14, opacity: 0.6 }}>Built with Next-Gen Glassmorphism</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Outfit', marginBottom: 16 }}>Everything you need, nothing you don't.</h2>
          <p style={{ color: 'var(--text-muted)' }}>Engineered for the modern developer experience.</p>
        </div>
        
        <div className="bento-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="glass-card bento-col-8 feature-card" style={{ padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 20 }}>📊</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Real-time Analytics</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Track team velocity, project completion rates, and individual performance with beautiful interactive charts.</p>
          </div>
          <div className="glass-card bento-col-4 feature-card" style={{ padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 20 }}>🔒</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Bank-Grade Security</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Your data is encrypted at rest and in transit using state-of-the-art protocols.</p>
          </div>
          <div className="glass-card bento-col-4 feature-card" style={{ padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 20 }}>👥</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Team Collaboration</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Invite unlimited members, assign roles, and manage permissions with ease.</p>
          </div>
          <div className="glass-card bento-col-8 feature-card" style={{ padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 20 }}>⚡</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Blazing Fast Kanban</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Smooth drag-and-drop interactions and instant updates ensure your team stays in flow.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: 'var(--text-dim)' }}>
          © 2026 TaskFlow Inc. Built for the future of work.
        </div>
      </footer>
    </div>
  );
}
