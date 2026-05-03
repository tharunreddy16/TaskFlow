import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Avatar, Badge, Modal, Field, Btn, Spinner, Empty, ProgressBar } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#f97316'];

export default function ProjectsPage({ toast }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [showMembers, setShowMembers] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#8b5cf6' });
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
      setForm({ name: '', description: '', color: '#8b5cf6' });
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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Spinner />
    </div>
  );

  return (
    <div style={{ padding: '40px', animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: "'Inter', system-ui, sans-serif", color: 'var(--text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8, background: 'linear-gradient(to right, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
            {projects.length} active workspace{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Btn onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>+</span> New Project
        </Btn>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {projects.length === 0 && (
          <div style={{ gridColumn: '1/-1' }}>
            <Empty icon="🚀" text="No projects yet — create your first one!" />
          </div>
        )}

        {projects.map((p, i) => {
          const myMember = p.members.find(m => m.user._id === user._id || m.user === user._id);
          const isAdmin = myMember?.role === 'admin';
          return (
            <div key={p._id}
              className="glass-card"
              style={{
                padding: 28, cursor: 'pointer',
                animationDelay: `${i * 0.07}s`,
              }}
              onClick={() => navigate('/tasks', { state: { projectId: p._id } })}
            >
              {/* Top glow line in project color */}
              <div style={{ position: 'absolute', top: 0, left: 20, right: 20, height: 2, background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`, borderRadius: '0 0 4px 4px', opacity: 0.8 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${p.color}18`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 20px ${p.color}20` }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: p.color, display: 'block', boxShadow: `0 0 10px ${p.color}` }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.members.length} member{p.members.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setShowMembers(p)}
                    title="Manage members"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', padding: '6px 8px', fontSize: 14, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.color = '#a78bfa'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >👥</button>
                  {isAdmin && (
                    <button
                      onClick={() => deleteProject(p)}
                      title="Delete project"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', padding: '6px 8px', fontSize: 14, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >🗑</button>
                  )}
                </div>
              </div>

              {p.description && <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>{p.description}</p>}

              <ProgressBar value={0} color={p.color} />

              {/* Members avatars */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                <div style={{ display: 'flex' }}>
                  {p.members.slice(0, 5).map((m, i) => (
                    <div key={i} style={{ marginLeft: i ? -10 : 0, zIndex: 10 - i, borderRadius: '50%', border: '2px solid var(--bg)' }}>
                      <Avatar name={m.user?.name || '?'} size={28} />
                    </div>
                  ))}
                  {p.members.length > 5 && (
                    <div style={{ marginLeft: -10, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                      +{p.members.length - 5}
                    </div>
                  )}
                </div>
                <Badge type={isAdmin ? 'admin' : 'member'} />
              </div>
            </div>
          );
        })}

        {/* New project card */}
        <button onClick={() => setShowNew(true)} style={{
          background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 20,
          padding: 28, cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 200,
          color: 'var(--text-muted)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: 'inherit',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.color = '#a78bfa'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, border: '1.5px dashed currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>+</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>New Project</span>
        </button>
      </div>

      {/* ── Create Project Modal ── */}
      {showNew && (
        <Modal title="Create New Project" onClose={() => setShowNew(false)}>
          <Field label="Project Name" value={form.name} onChange={set('name')} placeholder="e.g. Marketing Campaign" required />
          <Field label="Description" value={form.description} onChange={set('description')} placeholder="What is this project about?" />
          <div style={{ marginBottom: 24 }}>
            <label style={modalLabelStyle}>Color</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                  width: 32, height: 32, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                  outline: form.color === c ? `3px solid ${c}` : '3px solid transparent',
                  outlineOffset: 3,
                  boxShadow: form.color === c ? `0 0 12px ${c}80` : 'none',
                  transition: 'all 0.2s',
                  transform: form.color === c ? 'scale(1.15)' : 'scale(1)',
                }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setShowNew(false)}>Cancel</Btn>
            <Btn onClick={createProject} disabled={saving}>{saving ? <Spinner /> : 'Create Project'}</Btn>
          </div>
        </Modal>
      )}

      {/* ── Manage Members Modal ── */}
      {showMembers && (
        <Modal title={`Team — ${showMembers.name}`} onClose={() => { setShowMembers(null); setMemberEmail(''); }} width={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {showMembers.members.map((m, i) => {
              const isCurrentUser = m.user._id === user._id;
              const myRole = showMembers.members.find(x => x.user._id === user._id || x.user === user._id)?.role;
              const canRemove = myRole === 'admin' && !isCurrentUser;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
                  <Avatar name={m.user?.name || '?'} size={38} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{m.user?.name}{isCurrentUser ? ' (you)' : ''}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.user?.email}</div>
                  </div>
                  <Badge type={m.role} />
                  {canRemove && (
                    <button onClick={() => removeMember(m.user._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', cursor: 'pointer', fontSize: 13, padding: '5px 10px', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    >Remove</button>
                  )}
                </div>
              );
            })}
          </div>

          {showMembers.members.find(m => (m.user._id === user._id || m.user === user._id) && m.role === 'admin') && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
              <label style={modalLabelStyle}>Invite by Email</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="email" placeholder="teammate@example.com" value={memberEmail}
                  onChange={e => setMemberEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMember()}
                  style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                />
                <Btn onClick={addMember} disabled={saving}>{saving ? <Spinner /> : 'Invite'}</Btn>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

const modalLabelStyle = { display: 'block', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.8px' };
