import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Avatar, Badge, Modal, Field, Btn, Spinner, Empty } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const STATUS_COLS = [
  { id: 'todo',        label: 'To Do',      color: '#9ca3af', glow: 'rgba(156,163,175,0.3)' },
  { id: 'in_progress', label: 'In Progress', color: '#60a5fa', glow: 'rgba(96,165,250,0.3)' },
  { id: 'done',        label: 'Done',        color: '#34d399', glow: 'rgba(52,211,153,0.3)' },
];

export default function TasksPage({ toast }) {
  const { user } = useAuth();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(location.state?.projectId || '');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  useEffect(() => {
    api.get('/projects').then(({ data }) => {
      setProjects(data);
      if (!selectedId && data.length > 0) setSelectedId(data[0]._id);
    }).catch(() => toast('Failed to load projects', 'error')).finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const loadTasks = useCallback(async (projId) => {
    if (!projId) return;
    setTaskLoading(true);
    try {
      const { data } = await api.get(`/tasks?projectId=${projId}`);
      setTasks(data);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to load tasks', 'error');
    } finally {
      setTaskLoading(false);
    }
  }, [toast]);

  useEffect(() => { if (selectedId) loadTasks(selectedId); }, [selectedId, loadTasks]);

  const project = projects.find(p => p._id === selectedId);
  const myMember = project?.members.find(m => m.user._id === user._id || m.user === user._id);
  const isAdmin = myMember?.role === 'admin';
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const resetForm = () => setForm({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });

  const createTask = async () => {
    if (!form.title.trim()) return toast('Task title required', 'error');
    setSaving(true);
    try {
      const payload = { title: form.title, description: form.description, priority: form.priority, projectId: selectedId };
      if (form.dueDate) payload.dueDate = form.dueDate;
      if (form.assignedTo) payload.assignedTo = form.assignedTo;
      const { data } = await api.post('/tasks', payload);
      setTasks(ts => [data, ...ts]);
      resetForm(); setShowNew(false);
      toast('Task created!');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create task', 'error');
    } finally { setSaving(false); }
  };

  const updateTask = async () => {
    if (!editTask) return;
    setSaving(true);
    try {
      const payload = { title: form.title, description: form.description, priority: form.priority };
      if (form.dueDate !== undefined) payload.dueDate = form.dueDate || null;
      if (form.assignedTo !== undefined) payload.assignedTo = form.assignedTo || null;
      const { data } = await api.put(`/tasks/${editTask._id}`, payload);
      setTasks(ts => ts.map(t => t._id === data._id ? data : t));
      setEditTask(null); resetForm();
      toast('Task updated!');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update task', 'error');
    } finally { setSaving(false); }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status });
      setTasks(ts => ts.map(t => t._id === data._id ? data : t));
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(ts => ts.filter(t => t._id !== taskId));
      toast('Task deleted');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete task', 'error');
    }
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
    });
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spinner /></div>;

  if (projects.length === 0) return (
    <div style={{ padding: '40px', fontFamily: "'Inter', system-ui", color: 'var(--text)' }}>
      <Empty icon="📁" text="No projects yet. Create a project first, then add tasks." />
    </div>
  );

  return (
    <div style={{ padding: '40px', animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: "'Inter', system-ui, sans-serif", color: 'var(--text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            {project && <span style={{ width: 14, height: 14, borderRadius: '50%', background: project.color, boxShadow: `0 0 12px ${project.color}`, flexShrink: 0 }} />}
            <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setFilter('all'); }}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 32, fontWeight: 800, cursor: 'pointer', outline: 'none', fontFamily: 'Outfit', letterSpacing: '-1px', appearance: 'none' }}>
              {projects.map(p => <option key={p._id} value={p._id} style={{ background: '#0a0a0f' }}>{p.name}</option>)}
            </select>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            {' · '}{project?.members.length} member{project?.members.length !== 1 ? 's' : ''}
            {isAdmin && <span style={{ color: '#a78bfa', marginLeft: 8, fontWeight: 600, fontSize: 13 }}>· Admin</span>}
          </p>
        </div>
        {isAdmin && (
          <Btn onClick={() => { resetForm(); setShowNew(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>+</span> Add Task
          </Btn>
        )}
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {[['all', 'All'], ...STATUS_COLS.map(c => [c.id, c.label])].map(([id, label]) => {
          const count = id === 'all' ? tasks.length : tasks.filter(t => t.status === id).length;
          const isActive = filter === id;
          return (
            <button key={id} onClick={() => setFilter(id)} style={{
              padding: '8px 18px', borderRadius: 30, border: isActive ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
              fontSize: 14, fontWeight: isActive ? 600 : 400, transition: 'all 0.2s', fontFamily: 'inherit',
              background: isActive ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.02)',
              color: isActive ? '#a78bfa' : 'var(--text-muted)',
              boxShadow: isActive ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
            }}>
              {label}
              <span style={{ fontSize: 12, marginLeft: 8, opacity: 0.7, background: 'rgba(255,255,255,0.1)', padding: '1px 7px', borderRadius: 10 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Kanban board */}
      {taskLoading
        ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}><Spinner /></div>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {STATUS_COLS.map(col => {
              const colTasks = filter === 'all'
                ? tasks.filter(t => t.status === col.id)
                : filtered.filter(t => t.status === col.id);
              return (
                <div key={col.id}>
                  {/* Column Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '0 4px' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color, boxShadow: `0 0 8px ${col.glow}` }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '1px' }}>{col.label}</span>
                    <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>{colTasks.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {colTasks.length === 0 && (
                      <div style={{ border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 16, padding: '28px 20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
                        Drop tasks here
                      </div>
                    )}
                    {colTasks.map((task, i) => (
                      <TaskCard key={task._id} task={task} col={col}
                        isAdmin={isAdmin}
                        isAssignee={task.assignedTo?._id === user._id || task.assignedTo === user._id}
                        onStatusChange={updateStatus}
                        onDelete={deleteTask}
                        onEdit={openEdit}
                        delay={i * 0.05}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Team Members Panel */}
      {project && (
        <div className="glass-card" style={{ padding: 28, marginTop: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Team Members</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {project.members.map((m, i) => {
              const memberTasks = tasks.filter(t => t.assignedTo?._id === m.user._id || t.assignedTo === m.user._id);
              const done = memberTasks.filter(t => t.status === 'done').length;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
                  <Avatar name={m.user?.name || '?'} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.user?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{done}/{memberTasks.length} tasks done</div>
                  </div>
                  <Badge type={m.role} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Create Task Modal ── */}
      {showNew && (
        <Modal title="New Task" onClose={() => setShowNew(false)}>
          <Field label="Title" value={form.title} onChange={set('title')} placeholder="What needs to be done?" required />
          <Field label="Description" value={form.description} onChange={set('description')} placeholder="Optional details…" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={form.priority} onChange={e => set('priority')(e.target.value)} style={selectStyle}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => set('dueDate')(e.target.value)} style={selectStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Assign To</label>
            <select value={form.assignedTo} onChange={e => set('assignedTo')(e.target.value)} style={selectStyle}>
              <option value="">Unassigned</option>
              {project?.members.map(m => (
                <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setShowNew(false)}>Cancel</Btn>
            <Btn onClick={createTask} disabled={saving}>{saving ? <Spinner /> : 'Create Task'}</Btn>
          </div>
        </Modal>
      )}

      {/* ── Edit Task Modal ── */}
      {editTask && (
        <Modal title="Edit Task" onClose={() => { setEditTask(null); resetForm(); }}>
          {isAdmin ? (
            <>
              <Field label="Title" value={form.title} onChange={set('title')} placeholder="Task title" required />
              <Field label="Description" value={form.description} onChange={set('description')} placeholder="Optional details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <select value={form.priority} onChange={e => set('priority')(e.target.value)} style={selectStyle}>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => set('dueDate')(e.target.value)} style={selectStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Assign To</label>
                <select value={form.assignedTo} onChange={e => set('assignedTo')(e.target.value)} style={selectStyle}>
                  <option value="">Unassigned</option>
                  {project?.members.map(m => (
                    <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Status</label>
              <select value={editTask.status} onChange={e => { updateStatus(editTask._id, e.target.value); setEditTask(null); }} style={selectStyle}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>As a member, you can only update the status of tasks assigned to you.</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => { setEditTask(null); resetForm(); }}>Cancel</Btn>
            {isAdmin && <Btn onClick={updateTask} disabled={saving}>{saving ? <Spinner /> : 'Save Changes'}</Btn>}
          </div>
        </Modal>
      )}
    </div>
  );
}

function TaskCard({ task, col, isAdmin, isAssignee, onStatusChange, onDelete, onEdit, delay }) {
  const now = new Date();
  const isOverdue = task.dueDate && task.status !== 'done' && new Date(task.dueDate) < now;
  const [menuOpen, setMenuOpen] = useState(false);
  const canEdit = isAdmin || isAssignee;

  return (
    <div
      className="glass-card animate-fadeup"
      style={{
        padding: '18px 20px', position: 'relative',
        borderLeft: `3px solid ${col.color}`,
        borderRadius: 16,
        animationDelay: `${delay}s`,
        cursor: canEdit ? 'pointer' : 'default',
      }}
      onClick={() => canEdit && onEdit(task)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, flex: 1, color: '#fff' }}>{task.title}</div>
        <div style={{ position: 'relative', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          <button onClick={() => setMenuOpen(m => !m)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, padding: '4px 8px', lineHeight: 1, borderRadius: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >⋯</button>
          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)',
              background: 'rgba(15,15,20,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, minWidth: 180, zIndex: 50,
              overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(20px)',
            }} onMouseLeave={() => setMenuOpen(false)}>
              <div style={{ padding: '8px 0' }}>
                {canEdit && (
                  <>
                    <div style={{ padding: '6px 14px', fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Move to</div>
                    {STATUS_COLS.filter(s => s.id !== task.status).map(s => (
                      <button key={s.id} onClick={() => { onStatusChange(task._id, s.id); setMenuOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', color: 'var(--text)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                        {s.label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
                    <button onClick={() => { onEdit(task); setMenuOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', color: 'var(--text)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      ✏️ Edit task
                    </button>
                  </>
                )}
                {isAdmin && (
                  <>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
                    <button onClick={() => { onDelete(task._id); setMenuOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', color: '#f87171', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      🗑 Delete task
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge type={task.priority} />
          {isOverdue && <span style={{ fontSize: 11, color: '#f87171', fontWeight: 700, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 8px', borderRadius: 20, letterSpacing: '0.3px' }}>OVERDUE</span>}
          {task.dueDate && !isOverdue && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
              📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        {task.assignedTo && (
          <div title={task.assignedTo.name}>
            <Avatar name={task.assignedTo.name} size={26} />
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' };
const selectStyle = { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit', marginBottom: 20, transition: 'all 0.2s' };
