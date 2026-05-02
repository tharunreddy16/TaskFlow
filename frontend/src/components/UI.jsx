// ─── Shared UI primitives ─────────────────────────────────────────────────────

// Toast stack
export function ToastContainer({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? '#ef4444' : '#22c55e',
          color: '#fff', borderRadius: 10, padding: '10px 16px',
          fontSize: 13, fontWeight: 500, maxWidth: 320,
          animation: 'slideIn 0.2s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// Avatar with initials
export function Avatar({ name = '', size = 32 }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const palette = ['#7c6af7', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];
  const color = palette[(name.charCodeAt(0) || 0) % palette.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color + '22', border: `1.5px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 600, color,
    }}>
      {initials}
    </div>
  );
}

// Status / Priority badge
const BADGE = {
  todo:        { bg: '#222228', color: '#888898', label: 'To Do' },
  in_progress: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'In Progress' },
  done:        { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', label: 'Done' },
  high:        { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'High' },
  medium:      { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', label: 'Medium' },
  low:         { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e', label: 'Low' },
  admin:       { bg: 'rgba(124,106,247,0.12)', color: '#7c6af7', label: 'Admin' },
  member:      { bg: '#222228', color: '#888898', label: 'Member' },
};
export function Badge({ type }) {
  const s = BADGE[type] || BADGE.todo;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color, letterSpacing: '0.2px',
    }}>
      {s.label}
    </span>
  );
}

// Form field
export function Field({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', color: '#888898', fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder} required={required}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '10px 12px',
          background: '#0f0f11', border: '1px solid #2a2a32', borderRadius: 9,
          color: '#f0f0f4', fontSize: 14, fontFamily: 'inherit', transition: 'border 0.15s',
        }}
      />
    </div>
  );
}

// Modal overlay
export function Modal({ title, onClose, children, width = 440 }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#18181c', border: '1px solid #2a2a32', borderRadius: 16, padding: 28, width, maxWidth: 'calc(100vw - 32px)', animation: 'slideIn 0.2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#f0f0f4' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888898', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Primary button
export function Btn({ children, onClick, variant = 'primary', type = 'button', disabled, style: extra }) {
  const variants = {
    primary: { background: disabled ? 'rgba(124,106,247,0.4)' : '#7c6af7', color: '#fff' },
    ghost:   { background: '#222228', color: '#888898' },
    danger:  { background: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      padding: '9px 18px', border: 'none', borderRadius: 9,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
      transition: 'all 0.12s', letterSpacing: '0.1px',
      ...v, ...extra,
    }}>
      {children}
    </button>
  );
}

// Inline loading spinner
export function Spinner() {
  return <span className="spinner" />;
}

// Empty state
export function Empty({ icon = '📭', text }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#55555f' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontSize: 13 }}>{text}</p>
    </div>
  );
}

// Progress bar
export function ProgressBar({ value, color = '#7c6af7' }) {
  return (
    <div style={{ background: '#222228', borderRadius: 4, height: 5, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
    </div>
  );
}

// SVG ring chart
export function RingChart({ value }) {
  const r = 54, stroke = 8;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={130} height={130} viewBox="0 0 130 130">
      <circle cx={65} cy={65} r={r} fill="none" stroke="#222228" strokeWidth={stroke} />
      <circle cx={65} cy={65} r={r} fill="none" stroke="#7c6af7" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 65 65)" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      <text x={65} y={62} textAnchor="middle" fill="#f0f0f4" fontSize={22} fontWeight={700} fontFamily="DM Sans">{value}%</text>
      <text x={65} y={78} textAnchor="middle" fill="#888898" fontSize={11} fontFamily="DM Sans">done</text>
    </svg>
  );
}
