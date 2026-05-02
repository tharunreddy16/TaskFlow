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
    { label: 'Total tasks',  value: overall?.totalTasks  ?? 0, color: 'var(--text)' },
    { label: 'Completed',    value: overall?.doneTasks    ?? 0, color: 'var(--green)' },
    { label: 'Overdue',      value: overall?.overdueTasks ?? 0, color: 'var(--red)' },
    { label: 'Projects',     value: overall?.totalProjects ?? 0, color: 'var(--accent)' },
    { label: 'Completion',   value: `${overall?.completionRate ?? 0}%`, color: 'var(--blue)' },
  ];

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeUp 0.3s ease', fontFamily: "'DM Sans', system-ui, sans-serif", color: 'var(--text)' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.3px' }}>Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Your team's task landscape at a glance</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Projects + ring */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 16 }}>
        {/* Project progress list */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Active projects</h2>
            <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              View all →
            </button>
          </div>
          {projects.length === 0
            ? <Empty icon="📁" text="No projects yet. Create one to get started." />
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {projects.map(p => {
                  const admin = p.members.find(m => m.role === 'admin');
                  return (
                    <div key={p._id} style={{ cursor: 'pointer' }} onClick={() => navigate('/tasks', { state: { projectId: p._id } })}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 9, height: 9, borderRadius: '50%', background: p.color, display: 'inline-block', flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.members.length} member{p.members.length !== 1 ? 's' : ''}</span>
                      </div>
                      <ProgressBar value={0} color={p.color} />
                    </div>
                  );
                })}
              </div>
            )}
        </div>

        {/* Completion ring */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, alignSelf: 'flex-start' }}>Completion</h2>
          <RingChart value={overall?.completionRate ?? 0} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16, textAlign: 'center' }}>
            {overall?.doneTasks ?? 0} of {overall?.totalTasks ?? 0} tasks done
          </p>
        </div>
      </div>

      {/* Recent tasks */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Recent tasks</h2>
        {recentTasks.length === 0
          ? <Empty icon="✅" text="No tasks yet. Open a project and add your first task." />
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentTasks.map(task => {
                const now = new Date();
                const overdue = task.dueDate && task.status !== 'done' && new Date(task.dueDate) < now;
                return (
                  <div key={task._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 9, background: 'var(--bg)' }}>
                    <StatusDot status={task.status} />
                    <span style={{ flex: 1, fontSize: 13 }}>{task.title}</span>
                    {task.assignedTo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Avatar name={task.assignedTo.name} size={22} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{task.assignedTo.name}</span>
                      </div>
                    )}
                    <Badge type={task.priority} />
                    {overdue && <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700, background: 'var(--red-soft)', padding: '2px 7px', borderRadius: 20 }}>OVERDUE</span>}
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const colors = { todo: 'var(--text-dim)', in_progress: 'var(--blue)', done: 'var(--green)' };
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[status] || 'var(--text-dim)', flexShrink: 0, display: 'inline-block' }} />;
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Spinner />
    </div>
  );
}
