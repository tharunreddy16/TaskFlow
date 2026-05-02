import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Avatar, Badge, Modal, Field, Btn, Spinner, Empty, ProgressBar } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#7c6af7', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6'];

export default function ProjectsPage({ toast }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [showMembers, setShowMembers] = useState(null); // project object
  const [form, setForm] = useState({ name: '', description: '', color: '#7c6af7' });
  const [memberEmail, setMemberEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const load = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const createProject = async () => {
    if (!form.name.trim()) return toast('Project name required', 'error');
    setSaving(true);
    try {
      const { data } = await api.post('/projects', form);
      setProjects(ps => [data, ...ps]);
      setForm({ name: '', description: '', color: '#7c6af7' });
      setShowNew(false);
      toast('Project created!');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create project', 'error');
    } finally { setSaving(false); }
  };

  const addMember = async () => {
    if (!memberEmail.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post(`/projects/${showMembers._id}/members`, { email: memberEmail });
      setShowMembers(data);
      setProjects(ps => ps.map(p => p._id === data._id ? data : p));
      setMemberEmail('');
      toast('Member added!');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to add member', 'error');
    } finally { setSaving(false); }
  };

  const removeMember = async (memberId) => {
    try {
      const { data } = await api.delete(`/projects/${showMembers._id}/members/${memberId}`);
      setShowMembers(data);
      setProjects(ps => ps.map(p => p._id === data._id ? data : p));
      toast('Member removed');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to remove member', 'error');
    }
  };

  const deleteProject = async (proj) => {
    if (!window.confirm(`Delete "${proj.name}"? This will also delete all its tasks.`)) return;
    try {
      await api.delete(`/projects/${proj._id}`);
      setProjects(ps => ps.filter(p => p._id !== proj._id));
      toast('Project deleted');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete project', 'error');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}><Spinner /></div>;

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeUp 0.3s ease', fontFamily: "'DM Sans', system-ui, sans-serif", color: 'var(--text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.3px' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Btn onClick={() => setShowNew(true)}>+ New project</Btn>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {projects.length === 0 && (
          <div style={{ gridColumn: '1/-1' }}>
            <Empty icon="📁" text="No projects yet — create your first one!" />
          </div>
        )}

        {projects.map(p => {
          const myMember = p.members.find(m => m.user._id === user._id || m.user === user._id);
          const isAdmin = myMember?.role === 'admin';
          return (
            <div key={p._id}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, transition: 'border-color 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = p.color + '60'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              onClick={() => navigate('/tasks', { state: { projectId: p._id } })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: p.color + '22', border: `1px solid ${p.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: p.color, display: 'block' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.members.length} member{p.members.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setShowMembers(p)}
                    title="Manage members"
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px 6px', borderRadius: 6, fontSize: 13, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                  >👥</button>
                  {isAdmin && (
                    <button
                      onClick={() => deleteProject(p)}
                      title="Delete project"
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px 6px', borderRadius: 6, fontSize: 13, transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                    >🗑</button>
                  )}
                </div>
              </div>

              {p.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>{p.description}</p>}

              <ProgressBar value={0} color={p.color} />

              {/* Members avatars */}
              <div style={{ display: 'flex', marginTop: 14 }}>
                {p.members.slice(0, 5).map((m, i) => (
                  <div key={i} style={{ marginLeft: i ? -8 : 0, zIndex: 10 - i }}>
                    <Avatar name={m.user?.name || '?'} size={26} />
                  </div>
                ))}
                {p.members.length > 5 && (
                  <div style={{ marginLeft: -8, width: 26, height: 26, borderRadius: '50%', background: 'var(--surface-high)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
                    +{p.members.length - 5}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <Badge type={isAdmin ? 'admin' : 'member'} />
              </div>
            </div>
          );
        })}

        {/* New project card */}
        <button onClick={() => setShowNew(true)} style={{
          background: 'transparent', border: '1px dashed var(--border)', borderRadius: 14,
          padding: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 180,
          color: 'var(--text-dim)', transition: 'all 0.15s', fontFamily: 'inherit',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
        >
          <span style={{ fontSize: 28 }}>+</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>New project</span>
        </button>
      </div>

      {/* ── Create Project Modal ── */}
      {showNew && (
        <Modal title="New project" onClose={() => setShowNew(false)}>
          <Field label="Name" value={form.name} onChange={set('name')} placeholder="e.g. Marketing Campaign" required />
          <Field label="Description" value={form.description} onChange={set('description')} placeholder="Optional" />
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                  width: 28, height: 28, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                  outline: form.color === c ? `3px solid ${c}` : '3px solid transparent', outlineOffset: 2,
                  boxShadow: form.color === c ? `0 0 0 2px var(--bg)` : 'none', transition: 'all 0.15s',
                }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setShowNew(false)}>Cancel</Btn>
            <Btn onClick={createProject} disabled={saving}>{saving ? <Spinner /> : 'Create project'}</Btn>
          </div>
        </Modal>
      )}

      {/* ── Manage Members Modal ── */}
      {showMembers && (
        <Modal title={`Members — ${showMembers.name}`} onClose={() => { setShowMembers(null); setMemberEmail(''); }} width={500}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {showMembers.members.map((m, i) => {
              const isCurrentUser = m.user._id === user._id;
              const memberIsAdmin = m.role === 'admin';
              const myRole = showMembers.members.find(x => x.user._id === user._id || x.user === user._id)?.role;
              const canRemove = myRole === 'admin' && !isCurrentUser;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg)', borderRadius: 9 }}>
                  <Avatar name={m.user?.name || '?'} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{m.user?.name}{isCurrentUser ? ' (you)' : ''}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{m.user?.email}</div>
                  </div>
                  <Badge type={m.role} />
                  {canRemove && (
                    <button onClick={() => removeMember(m.user._id)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13, transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}>✕</button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add member (admin only) */}
          {showMembers.members.find(m => (m.user._id === user._id || m.user === user._id) && m.role === 'admin') && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Add member by email</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email" placeholder="teammate@example.com" value={memberEmail}
                  onChange={e => setMemberEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMember()}
                  style={{ flex: 1, padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                />
                <Btn onClick={addMember} disabled={saving}>{saving ? <Spinner /> : 'Add'}</Btn>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
