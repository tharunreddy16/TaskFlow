// ─── Shared UI primitives ─────────────────────────────────────────────────────

// Toast stack
export function ToastContainer({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {toasts.map(t => (
        <div key={t.id} className="glass-panel" style={{
          background: t.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          border: `1px solid ${t.type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
          color: '#fff', borderRadius: 14, padding: '14px 20px',
          fontSize: 14, fontWeight: 500, maxWidth: 360,
          animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 18 }}>{t.type === 'error' ? '⚠️' : '✨'}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// Avatar with initials
export function Avatar({ name = '', size = 36 }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const palette = [
    { bg: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#fff' }
  ];
  const style = palette[(name.charCodeAt(0) || 0) % palette.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: style.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color: style.color,
      boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
    }}>
      {initials}
    </div>
  );
}

// Status / Priority badge
const BADGE = {
  todo:        { bg: 'rgba(255,255,255,0.05)', color: '#9ca3af', label: 'To Do', border: 'rgba(255,255,255,0.1)' },
  in_progress: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'In Progress', border: 'rgba(59,130,246,0.3)' },
  done:        { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', label: 'Done', border: 'rgba(16,185,129,0.3)' },
  high:        { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', label: 'High', border: 'rgba(239,68,68,0.3)' },
  medium:      { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24', label: 'Medium', border: 'rgba(245,158,11,0.3)' },
  low:         { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', label: 'Low', border: 'rgba(16,185,129,0.3)' },
  admin:       { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa', label: 'Admin', border: 'rgba(139,92,246,0.3)' },
  member:      { bg: 'rgba(255,255,255,0.05)', color: '#9ca3af', label: 'Member', border: 'rgba(255,255,255,0.1)' },
};
export function Badge({ type }) {
  const s = BADGE[type] || BADGE.todo;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: '0.3px', backdropFilter: 'blur(4px)'
    }}>
      {s.label}
    </span>
  );
}

// Form field
export function Field({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder} required={required}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '12px 16px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12,
          color: '#ffffff', fontSize: 15, fontFamily: 'inherit',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
        }}
      />
    </div>
  );
}

// Modal overlay
export function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-panel" style={{ borderRadius: 24, padding: 32, width, maxWidth: 'calc(100vw - 32px)', animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', fontFamily: 'Outfit' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Primary button
export function Btn({ children, onClick, variant = 'primary', type = 'button', disabled, style: extra }) {
  const isPrimary = variant === 'primary';
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      padding: '12px 24px', border: isPrimary ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border)', 
      borderRadius: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
      background: disabled ? 'rgba(139, 92, 246, 0.3)' : (isPrimary ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'rgba(255,255,255,0.05)'),
      color: disabled ? 'rgba(255,255,255,0.5)' : '#fff',
      boxShadow: isPrimary && !disabled ? '0 4px 14px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      letterSpacing: '0.3px',
      transform: 'translateY(0)',
      ...extra,
    }}
    onMouseEnter={e => { if(!disabled) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isPrimary ? '0 6px 20px rgba(139, 92, 246, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 4px 12px rgba(0,0,0,0.3)'; } }}
    onMouseLeave={e => { if(!disabled) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isPrimary ? '0 4px 14px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none'; } }}
    >
      {children}
    </button>
  );
}

// Inline loading spinner
export function Spinner() {
  return <span className="spinner" />;
}

// Empty state
export function Empty({ icon = '✨', text }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      <div className="animate-float" style={{ fontSize: 48, marginBottom: 16, filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}>{icon}</div>
      <p style={{ fontSize: 15, fontWeight: 500 }}>{text}</p>
    </div>
  );
}

// Progress bar
export function ProgressBar({ value, color = '#8b5cf6' }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, height: 8, overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}>
      <div style={{ 
        width: `${value}%`, height: '100%', 
        background: `linear-gradient(90deg, ${color}, #fff)`, 
        borderRadius: 8, transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: `0 0 10px ${color}`
      }} />
    </div>
  );
}

// SVG ring chart
export function RingChart({ value }) {
  const r = 60, stroke = 12;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
      <svg width={160} height={160} viewBox="0 0 160 160" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
        <circle cx={80} cy={80} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle cx={80} cy={80} r={r} fill="none" stroke="url(#gradient)" strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 80 80)" style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fill: '#fff', fontSize: 32, fontWeight: 700, fontFamily: 'Outfit', background: '-webkit-linear-gradient(#fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}%</div>
        <div style={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Done</div>
      </div>
    </div>
  );
}
