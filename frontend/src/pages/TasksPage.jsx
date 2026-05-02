import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Avatar, Badge, Modal, Field, Btn, Spinner, Empty } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const STATUS_COLS = [
  { id: 'todo',        label: 'To Do',       color: 'var(--text-muted)' },
  { id: 'in_progress', label: 'In Progress',  color: 'var(--blue)' },
  { id: 'done',        label: 'Done',         color: 'var(--green)' },
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

  // Load projects list
  useEffect(() => {
    api.get('/projects').then(({ data }) => {
      setProjects(data);
      if (!selectedId && data.length > 0) setSelectedId(data[0]._id);
    }).catch(() => toast('Failed to load projects', 'error')).finally(() => setLoading(false));
  }, []); // eslint-disable-line

  // Load tasks when project changes
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

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}><Spinner /></div>;
  if (projects.length === 0) return (
    <div style={{ padding: '32px 36px', fontFamily: "'DM Sans', system-ui", color: 'var(--text)' }}>
      <Empty icon="📁" text="No projects yet. Create a project first, then add tasks." />
    </div>
  );

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeUp 0.3s ease', fontFamily: "'DM Sans', system-ui, sans-serif", color: 'var(--text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            {project && <span style={{ width: 10, height: 10, borderRadius: '50%', background: project.color, flexShrink: 0, display: 'inline-block' }} />}
            <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setFilter('all'); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 22, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>
              {projects.map(p => <option key={p._id} value={p._id} style={{ background: 'var(--surface)' }}>{p.name}</option>)}
            </select>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} · {project?.members.length} member{project?.members.length !== 1 ? 's' : ''}
            {isAdmin && <span style={{ color: 'var(--accent)', marginLeft: 8 }}>· Admin</span>}
          </p>
        </div>
        {isAdmin && <Btn onClick={() => { resetForm(); setShowNew(true); }}>+ Add task</Btn>}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--surface)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {[['all', 'All'], ...STATUS_COLS.map(c => [c.id, c.label])].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, transition: 'all 0.12s', fontFamily: 'inherit',
            background: filter === id ? 'var(--surface-high)' : 'transparent',
            color: filter === id ? 'var(--text)' : 'var(--text-muted)',
          }}>
            {label}
            <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 4 }}>
              {id === 'all' ? tasks.length : tasks.filter(t => t.status === id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Kanban board */}
      {taskLoading
        ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}><Spinner /></div>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {STATUS_COLS.map(col => {
              const colTasks = filter === 'all'
                ? tasks.filter(t => t.status === col.id)
                : filtered.filter(t => t.status === col.id);
              return (
                <div key={col.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: col.color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{col.label}</span>
                    <span style={{ fontSize: 11, background: 'var(--surface-high)', color: 'var(--text-muted)', borderRadius: 20, padding: '1px 7px' }}>{colTasks.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {colTasks.length === 0 && (
                      <div style={{ border: '1px dashed var(--border)', borderRadius: 10, padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 12 }}>
                        No tasks
                      </div>
                    )}
                    {colTasks.map(task => (
                      <TaskCard key={task._id} task={task} colColor={col.color}
                        isAdmin={isAdmin}
                        isAssignee={task.assignedTo?._id === user._id || task.assignedTo === user._id}
                        onStatusChange={updateStatus}
                        onDelete={deleteTask}
                        onEdit={openEdit}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Team members panel */}
      {project && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, marginTop: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Team members</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {project.members.map((m, i) => {
              const memberTasks = tasks.filter(t => t.assignedTo?._id === m.user._id || t.assignedTo === m.user._id);
              const done = memberTasks.filter(t => t.status === 'done').length;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg)', borderRadius: 9 }}>
                  <Avatar name={m.user?.name || '?'} size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{m.user?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{m.user?.email}</div>
                  </div>
                  <Badge type={m.role} />
                  <span style={{ fontSize: 12, color: 'var(--text-dim)', minWidth: 60, textAlign: 'right' }}>
                    {done}/{memberTasks.length} done
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Create Task Modal ── */}
      {showNew && (
        <Modal title="New task" onClose={() => setShowNew(false)}>
          <Field label="Title" value={form.title} onChange={set('title')} placeholder="What needs to be done?" required />
          <Field label="Description" value={form.description} onChange={set('description')} placeholder="Optional details" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={form.priority} onChange={e => set('priority')(e.target.value)} style={selectStyle}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Due date</label>
              <input type="date" value={form.dueDate} onChange={e => set('dueDate')(e.target.value)} style={selectStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Assign to</label>
            <select value={form.assignedTo} onChange={e => set('assignedTo')(e.target.value)} style={selectStyle}>
              <option value="">Unassigned</option>
              {project?.members.map(m => (
                <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setShowNew(false)}>Cancel</Btn>
            <Btn onClick={createTask} disabled={saving}>{saving ? <Spinner /> : 'Create task'}</Btn>
          </div>
        </Modal>
      )}

      {/* ── Edit Task Modal ── */}
      {editTask && (
        <Modal title="Edit task" onClose={() => { setEditTask(null); resetForm(); }}>
          {isAdmin ? (
            <>
              <Field label="Title" value={form.title} onChange={set('title')} placeholder="Task title" required />
              <Field label="Description" value={form.description} onChange={set('description')} placeholder="Optional details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <select value={form.priority} onChange={e => set('priority')(e.target.value)} style={selectStyle}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Due date</label>
                  <input type="date" value={form.dueDate} onChange={e => set('dueDate')(e.target.value)} style={selectStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Assign to</label>
                <select value={form.assignedTo} onChange={e => set('assignedTo')(e.target.value)} style={selectStyle}>
                  <option value="">Unassigned</option>
                  {project?.members.map(m => (
                    <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            /* Members can only update status */
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Status</label>
              <select value={editTask.status} onChange={e => { updateStatus(editTask._id, e.target.value); setEditTask(null); }} style={selectStyle}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>As a member, you can only update the status of tasks assigned to you.</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => { setEditTask(null); resetForm(); }}>Cancel</Btn>
            {isAdmin && <Btn onClick={updateTask} disabled={saving}>{saving ? <Spinner /> : 'Save changes'}</Btn>}
          </div>
        </Modal>
      )}
    </div>
  );
}

function TaskCard({ task, colColor, isAdmin, isAssignee, onStatusChange, onDelete, onEdit }) {
  const now = new Date();
  const isOverdue = task.dueDate && task.status !== 'done' && new Date(task.dueDate) < now;
  const [menuOpen, setMenuOpen] = useState(false);
  const canEdit = isAdmin || isAssignee;

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11,
      padding: '13px 14px', position: 'relative', transition: 'border-color 0.15s',
      borderLeft: `3px solid ${colColor}`,
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = colColor + '80'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{task.title}</div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => setMenuOpen(m => !m)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, padding: '0 4px', lineHeight: 1 }}>⋯</button>
          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', background: 'var(--surface-high)',
              border: '1px solid var(--border)', borderRadius: 9, minWidth: 168, zIndex: 50,
              overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }} onMouseLeave={() => setMenuOpen(false)}>
              <div style={{ padding: '6px 0' }}>
                {canEdit && (
                  <>
                    <div style={{ padding: '4px 12px', fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Move to</div>
                    {STATUS_COLS.filter(s => s.id !== task.status).map(s => (
                      <button key={s.id} onClick={() => { onStatusChange(task._id, s.id); setMenuOpen(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        {s.label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                    <button onClick={() => { onEdit(task); setMenuOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      Edit task
                    </button>
                  </>
                )}
                {isAdmin && (
                  <>
                    <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                    <button onClick={() => { onDelete(task._id); setMenuOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--red)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Delete task
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 6, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge type={task.priority} />
          {isOverdue && <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700, background: 'var(--red-soft)', padding: '2px 7px', borderRadius: 20 }}>OVERDUE</span>}
          {task.dueDate && !isOverdue && (
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        {task.assignedTo && <Avatar name={task.assignedTo.name} size={22} />}
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' };
const selectStyle = { width: '100%', padding: '9px 11px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit', marginBottom: 16 };
