import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0f0f11",
  surface: "#18181c",
  surfaceHigh: "#222228",
  border: "#2a2a32",
  borderLight: "#38383f",
  text: "#f0f0f4",
  textMuted: "#888898",
  textDim: "#55555f",
  accent: "#7c6af7",
  accentHover: "#9080ff",
  accentSoft: "rgba(124,106,247,0.12)",
  green: "#22c55e",
  greenSoft: "rgba(34,197,94,0.1)",
  amber: "#f59e0b",
  amberSoft: "rgba(245,158,11,0.1)",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.1)",
  blue: "#3b82f6",
  blueSoft: "rgba(59,130,246,0.1)",
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const INITIAL_DATA = {
  user: { id: "u1", name: "Alex Chen", email: "alex@example.com" },
  projects: [],
  tasks: {}
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "error" ? C.red : C.green,
          color: "#fff", borderRadius: 10, padding: "10px 16px",
          fontSize: 13, fontWeight: 500, maxWidth: 300,
          animation: "slideIn 0.2s ease"
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "alex@example.com", password: "password123" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ id: "u1", name: form.name || "Alex Chen", email: form.email });
    }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap'); @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <div style={{ width: "100%", maxWidth: 420, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="2" fill="white" opacity="0.9"/>
                <rect x="10" y="2" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="2" y="10" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="10" y="10" width="6" height="6" rx="2" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 600, color: C.text, letterSpacing: "-0.3px" }}>TaskFlow</span>
          </div>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Team task management, simplified</p>
        </div>

        {/* Card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: C.bg, borderRadius: 10, padding: 4, marginBottom: 28, gap: 4 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 500, transition: "all 0.15s",
                background: mode === m ? C.surface : "transparent",
                color: mode === m ? C.text : C.textMuted,
                boxShadow: mode === m ? `0 1px 3px rgba(0,0,0,0.3)` : "none"
              }}>
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <Field label="Full name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Your name" />
            )}
            <Field label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="you@example.com" />
            <Field label="Password" type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} placeholder="••••••••" />

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "11px", marginTop: 8,
              background: loading ? C.accentSoft : C.accent,
              color: loading ? C.accent : "#fff",
              border: loading ? `1px solid ${C.accent}` : "none",
              borderRadius: 10, cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14, fontWeight: 600, transition: "all 0.15s",
              letterSpacing: "0.1px"
            }}>
              {loading ? "Signing in…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: C.textDim, fontSize: 12, marginTop: 20, marginBottom: 0 }}>
            Demo: use any email/password to continue
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", color: C.textMuted, fontSize: 12, fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box", padding: "10px 12px",
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9,
          color: C.text, fontSize: 14, outline: "none",
          transition: "border 0.15s"
        }}
        onFocus={e => e.target.style.borderColor = C.accent}
        onBlur={e => e.target.style.borderColor = C.border}
      />
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function Layout({ children }) {
  const { user, page, setPage, projects, selectedProject, setSelectedProject, logout } = useApp();

  const navItems = [
    { id: "dashboard", label: "Overview", icon: "⬡" },
    { id: "projects", label: "Projects", icon: "◫" },
    { id: "tasks", label: "Tasks", icon: "◻" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.text }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Sidebar */}
      <aside style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* Brand */}
        <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="2" fill="white" opacity="0.9"/>
                <rect x="10" y="2" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="2" y="10" width="6" height="6" rx="2" fill="white" opacity="0.6"/>
                <rect x="10" y="10" width="6" height="6" rx="2" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: C.text, letterSpacing: "-0.2px" }}>TaskFlow</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 9, width: "100%",
              padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer",
              marginBottom: 2, transition: "all 0.12s",
              background: page === item.id ? C.accentSoft : "transparent",
              color: page === item.id ? C.accent : C.textMuted,
              fontSize: 14, fontWeight: page === item.id ? 500 : 400,
            }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Projects list */}
          {projects.length > 0 && (
            <>
              <div style={{ padding: "14px 10px 6px", fontSize: 10, fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "1px" }}>Projects</div>
              {projects.map(p => (
                <button key={p.id} onClick={() => { setSelectedProject(p); setPage("tasks"); }} style={{
                  display: "flex", alignItems: "center", gap: 9, width: "100%",
                  padding: "8px 10px", borderRadius: 9, border: "none", cursor: "pointer",
                  marginBottom: 2, transition: "all 0.12s",
                  background: selectedProject?.id === p.id && page === "tasks" ? C.accentSoft : "transparent",
                  color: selectedProject?.id === p.id && page === "tasks" ? C.text : C.textMuted,
                  fontSize: 13, textAlign: "left"
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* User */}
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={user.name} size={30} />
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: C.textDim }}>Admin</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = C.red} onMouseLeave={e => e.currentTarget.style.color = C.textDim} title="Sign out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: "auto", maxHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 32 }) {
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const colors = [C.accent, "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];
  const color = colors[name?.charCodeAt(0) % colors.length] || C.accent;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: color + "20", border: `1.5px solid ${color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 600, color, fontFamily: "inherit"
    }}>
      {initials}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ label, type }) {
  const styles = {
    todo: { bg: C.surfaceHigh, color: C.textMuted },
    in_progress: { bg: C.blueSoft, color: C.blue },
    done: { bg: C.greenSoft, color: C.green },
    high: { bg: C.redSoft, color: C.red },
    medium: { bg: C.amberSoft, color: C.amber },
    low: { bg: C.greenSoft, color: C.green },
    admin: { bg: C.accentSoft, color: C.accent },
    member: { bg: C.surfaceHigh, color: C.textMuted },
  };
  const s = styles[type] || styles.todo;
  const labels = { todo: "To Do", in_progress: "In Progress", done: "Done", high: "High", medium: "Medium", low: "Low", admin: "Admin", member: "Member" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, letterSpacing: "0.2px" }}>
      {labels[type] || label}
    </span>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage() {
  const { projects, tasks } = useApp();
  const allTasks = Object.values(tasks).flat();
  const now = new Date();

  const stats = {
    total: allTasks.length,
    done: allTasks.filter(t => t.status === "done").length,
    inProgress: allTasks.filter(t => t.status === "in_progress").length,
    todo: allTasks.filter(t => t.status === "todo").length,
    overdue: allTasks.filter(t => t.dueDate && t.status !== "done" && new Date(t.dueDate) < now).length,
  };

  const completion = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div style={{ padding: "32px 36px", animation: "fadeUp 0.3s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, letterSpacing: "-0.3px" }}>Overview</h1>
        <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>Your team's task landscape at a glance</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total tasks", value: stats.total, accent: C.text },
          { label: "Completed", value: stats.done, accent: C.green },
          { label: "In progress", value: stats.inProgress, accent: C.blue },
          { label: "To do", value: stats.todo, accent: C.textMuted },
          { label: "Overdue", value: stats.overdue, accent: C.red },
        ].map(s => (
          <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.accent, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Projects + completion */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        {/* Projects */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Active projects</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {projects.length === 0 && (
              <div style={{ color: C.textMuted, fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                No active projects yet
              </div>
            )}
            {projects.map(p => {
              const ptasks = tasks[p.id] || [];
              const done = ptasks.filter(t => t.status === "done").length;
              const pct = ptasks.length ? Math.round((done / ptasks.length) * 100) : 0;
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                      <span style={{ fontSize: 12, color: C.textMuted }}>{done}/{ptasks.length}</span>
                    </div>
                    <div style={{ background: C.surfaceHigh, borderRadius: 4, height: 5, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: p.color, borderRadius: 4, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: C.textMuted, minWidth: 32, textAlign: "right" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion ring */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, alignSelf: "flex-start" }}>Completion</h2>
          <RingChart value={completion} />
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 16, textAlign: "center" }}>
            {stats.done} of {stats.total} tasks completed
          </p>
        </div>
      </div>

      {/* Recent tasks */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginTop: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Recent tasks</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {allTasks.slice(0, 5).map(task => (
            <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 9, background: C.bg }}>
              <StatusDot status={task.status} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 400 }}>{task.title}</span>
              {task.assignedTo && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Avatar name={task.assignedTo.name} size={22} /><span style={{ fontSize: 12, color: C.textMuted }}>{task.assignedTo.name}</span></div>}
              <Badge type={task.priority} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RingChart({ value }) {
  const r = 54, stroke = 8;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={130} height={130} viewBox="0 0 130 130">
      <circle cx={65} cy={65} r={r} fill="none" stroke={C.surfaceHigh} strokeWidth={stroke} />
      <circle cx={65} cy={65} r={r} fill="none" stroke={C.accent} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 65 65)" style={{ transition: "stroke-dasharray 0.5s ease" }} />
      <text x={65} y={62} textAnchor="middle" fill={C.text} fontSize={22} fontWeight={700} fontFamily="DM Sans">{value}%</text>
      <text x={65} y={78} textAnchor="middle" fill={C.textMuted} fontSize={11} fontFamily="DM Sans">done</text>
    </svg>
  );
}

function StatusDot({ status }) {
  const colors = { todo: C.textDim, in_progress: C.blue, done: C.green };
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors[status] || C.textDim, flexShrink: 0 }} />;
}

// ─── Projects Page ────────────────────────────────────────────────────────────
function ProjectsPage() {
  const { projects, setProjects, tasks, setSelectedProject, setPage, toast } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: "#7c6af7" });

  const colors = ["#7c6af7", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6"];

  const createProject = () => {
    if (!form.name.trim()) return toast("Project name required", "error");
    const proj = {
      id: "p" + Date.now(), name: form.name, description: form.description,
      color: form.color,
      members: [{ user: { id: "u1", name: "Alex Chen", email: "alex@example.com" }, role: "admin" }]
    };
    setProjects(ps => [...ps, proj]);
    setForm({ name: "", description: "", color: "#7c6af7" });
    setShowNew(false);
    toast("Project created!");
  };

  return (
    <div style={{ padding: "32px 36px", animation: "fadeUp 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.3px" }}>Projects</h1>
          <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>{projects.length} active project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowNew(true)} style={btnStyle(C.accent)}>+ New project</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {projects.map(p => {
          const ptasks = tasks[p.id] || [];
          const done = ptasks.filter(t => t.status === "done").length;
          return (
            <div key={p.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, cursor: "pointer", transition: "border-color 0.15s" }}
              onClick={() => { setSelectedProject(p); setPage("tasks"); }}
              onMouseEnter={e => e.currentTarget.style.borderColor = p.color + "60"}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: p.color + "20", border: `1px solid ${p.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: p.color, display: "block" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 1 }}>{p.members.length} member{p.members.length !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              </div>
              {p.description && <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16, lineHeight: 1.5 }}>{p.description}</p>}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textMuted, marginBottom: 10 }}>
                <span>{ptasks.length} tasks</span><span>{done} done</span>
              </div>
              <div style={{ background: C.surfaceHigh, borderRadius: 4, height: 4, overflow: "hidden" }}>
                <div style={{ width: `${ptasks.length ? (done / ptasks.length) * 100 : 0}%`, height: "100%", background: p.color, borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", marginTop: 14, gap: -6 }}>
                {p.members.slice(0, 4).map((m, i) => (
                  <div key={i} style={{ marginLeft: i ? -8 : 0, position: "relative", zIndex: p.members.length - i }}>
                    <Avatar name={m.user.name} size={26} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* New project card */}
        <button onClick={() => setShowNew(true)} style={{
          background: "transparent", border: `1px dashed ${C.border}`, borderRadius: 14,
          padding: 22, cursor: "pointer", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8, minHeight: 160,
          color: C.textDim, transition: "all 0.15s"
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}>
          <span style={{ fontSize: 24 }}>+</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>New project</span>
        </button>
      </div>

      {/* Modal */}
      {showNew && (
        <Modal title="New project" onClose={() => setShowNew(false)}>
          <Field label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Marketing Campaign" />
          <Field label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Optional" />
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Color</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {colors.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                  width: 28, height: 28, borderRadius: "50%", background: c, border: form.color === c ? `2.5px solid white` : "2.5px solid transparent",
                  cursor: "pointer", outline: form.color === c ? `2px solid ${c}` : "none", outlineOffset: 2
                }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowNew(false)} style={btnStyle(C.surfaceHigh, C.textMuted)}>Cancel</button>
            <button onClick={createProject} style={btnStyle(C.accent)}>Create project</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Tasks Page ───────────────────────────────────────────────────────────────
function TasksPage() {
  const { projects, selectedProject, setSelectedProject, tasks, setTasks, toast } = useApp();
  const [filter, setFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", dueDate: "", assignedTo: "" });

  const project = selectedProject || projects[0];
  const ptasks = (project ? tasks[project.id] : []) || [];
  const filtered = filter === "all" ? ptasks : ptasks.filter(t => t.status === filter);

  const resetForm = () => setForm({ title: "", description: "", priority: "medium", dueDate: "", assignedTo: "" });

  const createTask = () => {
    if (!form.title.trim()) return toast("Task title required", "error");
    const member = project.members.find(m => m.user.id === form.assignedTo);
    const task = {
      id: "t" + Date.now(), title: form.title, description: form.description,
      status: "todo", priority: form.priority, dueDate: form.dueDate || null,
      assignedTo: member ? member.user : null,
      createdBy: { id: "u1", name: "Alex Chen" }
    };
    setTasks(ts => ({ ...ts, [project.id]: [task, ...(ts[project.id] || [])] }));
    resetForm(); setShowNew(false);
    toast("Task created!");
  };

  const updateStatus = (taskId, status) => {
    setTasks(ts => ({
      ...ts,
      [project.id]: ts[project.id].map(t => t.id === taskId ? { ...t, status } : t)
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(ts => ({ ...ts, [project.id]: ts[project.id].filter(t => t.id !== taskId) }));
    toast("Task deleted");
  };

  const columns = [
    { id: "todo", label: "To Do", color: C.textMuted },
    { id: "in_progress", label: "In Progress", color: C.blue },
    { id: "done", label: "Done", color: C.green },
  ];

  if (!project) return <div style={{ padding: 40, color: C.textMuted }}>No projects yet. Create one first.</div>;

  return (
    <div style={{ padding: "32px 36px", animation: "fadeUp 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: project.color }} />
            <select value={project.id} onChange={e => setSelectedProject(projects.find(p => p.id === e.target.value))}
              style={{ background: "transparent", border: "none", color: C.text, fontSize: 22, fontWeight: 600, cursor: "pointer", outline: "none", fontFamily: "inherit", letterSpacing: "-0.3px" }}>
              {projects.map(p => <option key={p.id} value={p.id} style={{ background: C.surface }}>{p.name}</option>)}
            </select>
          </div>
          <p style={{ color: C.textMuted, fontSize: 13 }}>{ptasks.length} tasks · {project.members.length} members</p>
        </div>
        <button onClick={() => { resetForm(); setShowNew(true); }} style={btnStyle(C.accent)}>+ Add task</button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 22, background: C.surface, borderRadius: 10, padding: 4, width: "fit-content" }}>
        {[["all", "All"], ...columns.map(c => [c.id, c.label])].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 500, transition: "all 0.12s",
            background: filter === id ? C.surfaceHigh : "transparent",
            color: filter === id ? C.text : C.textMuted
          }}>{label} <span style={{ fontSize: 11, opacity: 0.7 }}>{id === "all" ? ptasks.length : ptasks.filter(t => t.status === id).length}</span></button>
        ))}
      </div>

      {/* Kanban board */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {columns.map(col => {
          const colTasks = ptasks.filter(t => t.status === col.id);
          return (
            <div key={col.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: col.color, textTransform: "uppercase", letterSpacing: "0.8px" }}>{col.label}</span>
                <span style={{ fontSize: 11, background: C.surfaceHigh, color: C.textMuted, borderRadius: 20, padding: "1px 7px" }}>{colTasks.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {colTasks.map(task => (
                  <TaskCard key={task.id} task={task} colColor={col.color}
                    onStatusChange={updateStatus} onDelete={deleteTask} onEdit={setEditTask} />
                ))}
                {colTasks.length === 0 && (
                  <div style={{ border: `1px dashed ${C.border}`, borderRadius: 10, padding: "20px", textAlign: "center", color: C.textDim, fontSize: 12 }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Members sidebar info */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginTop: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Team members</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {project.members.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={m.user.name} size={30} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{m.user.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{m.user.email}</div>
              </div>
              <Badge type={m.role} />
              <span style={{ fontSize: 11, color: C.textDim }}>
                {ptasks.filter(t => t.assignedTo?.id === m.user.id).length} tasks
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create task modal */}
      {showNew && (
        <Modal title="New task" onClose={() => setShowNew(false)}>
          <Field label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="What needs to be done?" />
          <Field label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Optional details" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={selectStyle}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Due date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={selectStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Assign to</label>
            <select value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} style={selectStyle}>
              <option value="">Unassigned</option>
              {project.members.map(m => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowNew(false)} style={btnStyle(C.surfaceHigh, C.textMuted)}>Cancel</button>
            <button onClick={createTask} style={btnStyle(C.accent)}>Create task</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TaskCard({ task, colColor, onStatusChange, onDelete, onEdit }) {
  const now = new Date();
  const isOverdue = task.dueDate && task.status !== "done" && new Date(task.dueDate) < now;
  const [menuOpen, setMenuOpen] = useState(false);

  const statuses = [
    { id: "todo", label: "To Do" },
    { id: "in_progress", label: "In Progress" },
    { id: "done", label: "Done" }
  ];

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 11,
      padding: "14px 15px", position: "relative", transition: "border-color 0.15s",
      borderLeft: `3px solid ${colColor}`
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = colColor + "80"}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{task.title}</div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen(m => !m)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 16, padding: "0 4px", lineHeight: 1 }}>⋯</button>
          {menuOpen && (
            <div style={{ position: "absolute", right: 0, top: "100%", background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 9, minWidth: 160, zIndex: 10, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
              onMouseLeave={() => setMenuOpen(false)}>
              <div style={{ padding: "6px 0" }}>
                <div style={{ padding: "4px 12px", fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.8px" }}>Move to</div>
                {statuses.filter(s => s.id !== task.status).map(s => (
                  <button key={s.id} onClick={() => { onStatusChange(task.id, s.id); setMenuOpen(false); }} style={{
                    display: "block", width: "100%", textAlign: "left", padding: "8px 12px",
                    background: "none", border: "none", color: C.text, fontSize: 13, cursor: "pointer"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = C.border}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    {s.label}
                  </button>
                ))}
                <div style={{ height: 1, background: C.border, margin: "4px 0" }} />
                <button onClick={() => { onDelete(task.id); setMenuOpen(false); }} style={{
                  display: "block", width: "100%", textAlign: "left", padding: "8px 12px",
                  background: "none", border: "none", color: C.red, fontSize: 13, cursor: "pointer"
                }}>Delete task</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {task.description && <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{task.description}</p>}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 6, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <Badge type={task.priority} />
          {isOverdue && <span style={{ fontSize: 10, color: C.red, fontWeight: 600, background: C.redSoft, padding: "2px 7px", borderRadius: 20 }}>OVERDUE</span>}
          {task.dueDate && !isOverdue && <span style={{ fontSize: 11, color: C.textDim }}>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
        </div>
        {task.assignedTo && <Avatar name={task.assignedTo.name} size={22} />}
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: 440, maxWidth: "calc(100vw - 32px)", animation: "slideIn 0.2s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const labelStyle = { display: "block", color: C.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" };
const selectStyle = { width: "100%", padding: "9px 11px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit", marginBottom: 16 };
const btnStyle = (bg, color = "#fff") => ({
  padding: "9px 18px", background: bg, color, border: "none", borderRadius: 9,
  cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.12s",
  fontFamily: "inherit", letterSpacing: "0.1px"
});

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('taskflow_user')) || null);
  const [page, setPage] = useState("dashboard");
  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('taskflow_projects')) || INITIAL_DATA.projects);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('taskflow_tasks')) || INITIAL_DATA.tasks);
  const [selectedProject, setSelectedProject] = useState(() => JSON.parse(localStorage.getItem('taskflow_selectedProject')) || null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { localStorage.setItem('taskflow_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('taskflow_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('taskflow_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('taskflow_selectedProject', JSON.stringify(selectedProject)); }, [selectedProject]);

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(ts => [...ts, { id, msg, type }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3000);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  if (!user) return <AuthPage onLogin={setUser} />;

  const ctx = { user, page, setPage, projects, setProjects, tasks, setTasks, selectedProject, setSelectedProject, toast, logout };

  return (
    <AppCtx.Provider value={ctx}>
      <Layout>
        {page === "dashboard" && <DashboardPage />}
        {page === "projects" && <ProjectsPage />}
        {page === "tasks" && <TasksPage />}
      </Layout>
      <Toast toasts={toasts} />
    </AppCtx.Provider>
  );
}
