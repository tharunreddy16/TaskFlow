import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Avatar, Badge, RingChart, ProgressBar, Spinner, Empty } from '../components/UI';

export default function DashboardPage({ toast }) {
  const [overall, setOverall] = useState(null);
  const [projects, setProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dashRes, projRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/projects'),
        ]);
        if (cancelled) return;
        setOverall(dashRes.data);
        setProjects(projRes.data);

        // Fetch tasks for each project (up to 3 projects for recency)
        const taskResults = await Promise.all(
          projRes.data.slice(0, 3).map(p => api.get(`/tasks?projectId=${p._id}`))
        );
        if (!cancelled) {
          const all = taskResults.flatMap(r => r.data);
          all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRecentTasks(all.slice(0, 6));
        }
      } catch (err) {
        if (!cancelled) toast(err.response?.data?.message || 'Failed to load dashboard', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  if (loading) return <PageLoader />;

  const stats = [
    { label: 'Total Tasks',  value: overall?.totalTasks  ?? 0, color: '#fff', bg: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))' },
    { label: 'Completed',    value: overall?.doneTasks    ?? 0, color: '#34d399', bg: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0))' },
    { label: 'Overdue',      value: overall?.overdueTasks ?? 0, color: '#f87171', bg: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0))' },
    { label: 'Projects',     value: overall?.totalProjects ?? 0, color: '#a855f7', bg: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0))' },
  ];

  return (
    <div style={{ padding: '40px', animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8, background: 'linear-gradient(to right, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Your team's mission control center.</p>
        </div>
      </div>

      <div className="bento-grid">
        {/* Stat cards (Row 1) */}
        {stats.map((s, i) => (
          <div key={s.label} className={`glass-card bento-col-3 bento-item animate-fadeup`} style={{ animationDelay: `${i * 0.1}s`, background: s.bg, padding: '24px' }}>
            <div style={{ fontSize: 42, fontWeight: 700, color: s.color, letterSpacing: '-1.5px', fontFamily: 'Outfit' }}>{s.value}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 8 }}>{s.label}</div>
          </div>
        ))}

        {/* Completion Ring (Row 2, Left) */}
        <div className="glass-card bento-col-4 bento-row-2 bento-item animate-fadeup" style={{ animationDelay: '0.4s', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 32, alignSelf: 'flex-start' }}>Overall Progress</h2>
          <RingChart value={overall?.completionRate ?? 0} />
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 24, textAlign: 'center', fontWeight: 500 }}>
            {overall?.doneTasks ?? 0} out of {overall?.totalTasks ?? 0} tasks completed
          </p>
        </div>

        {/* Projects (Row 2, Middle/Right) */}
        <div className="glass-card bento-col-8 bento-row-2 bento-item animate-fadeup" style={{ animationDelay: '0.5s', padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Active Projects</h2>
            <button onClick={() => navigate('/projects')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
              View All →
            </button>
          </div>
          {projects.length === 0
            ? <Empty icon="📁" text="No active projects. Time to start building!" />
            : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                {projects.slice(0, 4).map((p, i) => (
                  <div key={p._id} style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} onClick={() => navigate('/tasks', { state: { projectId: p._id } })}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.color}` }} />
                        <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{p.name}</span>
                      </div>
                    </div>
                    <ProgressBar value={0} color={p.color} />
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.members.length} member{p.members.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Recent Tasks (Row 3, Full width) */}
        <div className="glass-card bento-col-12 bento-item animate-fadeup" style={{ animationDelay: '0.6s', padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 24 }}>Recent Activity</h2>
          {recentTasks.length === 0
            ? <Empty icon="✅" text="You're all caught up!" />
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentTasks.map((task, i) => {
                  const now = new Date();
                  const overdue = task.dueDate && task.status !== 'done' && new Date(task.dueDate) < now;
                  return (
                    <div key={task._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', animationDelay: `${i * 0.05}s` }} className="animate-fadeup" onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
                      <StatusDot status={task.status} />
                      <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: '#fff' }}>{task.title}</span>
                      {task.assignedTo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.2)', padding: '4px 12px 4px 4px', borderRadius: 20 }}>
                          <Avatar name={task.assignedTo.name} size={24} />
                          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{task.assignedTo.name}</span>
                        </div>
                      )}
                      <Badge type={task.priority} />
                      {overdue && <span style={{ fontSize: 11, color: '#f87171', fontWeight: 700, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '4px 10px', borderRadius: 20, letterSpacing: '0.5px' }}>OVERDUE</span>}
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const colors = { todo: 'rgba(255,255,255,0.2)', in_progress: '#3b82f6', done: '#10b981' };
  const glows = { todo: 'transparent', in_progress: 'rgba(59,130,246,0.5)', done: 'rgba(16,185,129,0.5)' };
  return <span style={{ width: 12, height: 12, borderRadius: '50%', background: colors[status], boxShadow: `0 0 8px ${glows[status]}`, flexShrink: 0, display: 'inline-block' }} />;
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <Spinner />
    </div>
  );
}
