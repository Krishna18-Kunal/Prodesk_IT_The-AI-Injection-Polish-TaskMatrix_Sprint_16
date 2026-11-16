import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Activity, CalendarDays, Check, CheckCircle2, Circle, ClipboardList, LayoutDashboard, LogOut, Menu, Plus, Search, Sparkles, Target, Trash2, X } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import TaskModal from './components/TaskModal';
import AISubtasks from './components/AISubtasks';
import { apiRequest } from './services/api';

function Dashboard() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadTasks = async () => {
    try { const data = await apiRequest('/tasks', { token }); setTasks(data.tasks); }
    catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadTasks(); }, []);

  const counts = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter(t=>t.status!=='Done').length,
    done: tasks.filter(t=>t.status==='Done').length,
    high: tasks.filter(t=>t.priority==='High' && t.status!=='Done').length
  }), [tasks]);
  const visible = useMemo(() => tasks.filter(t => (filter==='All' || t.status===filter) && `${t.title} ${t.description}`.toLowerCase().includes(search.toLowerCase())), [tasks,filter,search]);

  const saveTask = async (payload) => {
    setSaving(true);
    try {
      const editing = modal?.task;
      const data = await apiRequest(editing ? `/tasks/${editing._id}` : '/tasks', { token, method: editing ? 'PATCH' : 'POST', body: JSON.stringify(payload) });
      setTasks(old => editing ? old.map(t=>t._id===data.task._id?data.task:t) : [data.task,...old]);
      setModal(null); toast.success(editing?'Task updated':'Task created');
    } catch (error) { toast.error(error.message); }
    finally { setSaving(false); }
  };
  const removeTask = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try { await apiRequest(`/tasks/${id}`, { token, method:'DELETE' }); setTasks(old=>old.filter(t=>t._id!==id)); if(selected?._id===id)setSelected(null); toast.success('Task deleted'); }
    catch(error){toast.error(error.message);}
  };
  const changeStatus = async (task) => {
    const status = task.status==='Done'?'Todo':'Done';
    try { const data=await apiRequest(`/tasks/${task._id}`,{token,method:'PATCH',body:JSON.stringify({status})}); setTasks(old=>old.map(t=>t._id===task._id?data.task:t)); if(selected?._id===task._id)setSelected(data.task); }
    catch(error){toast.error(error.message);}
  };
  const addSubtask = async (title) => {
    const subtasks = [...(selected.subtasks||[]),{title,completed:false}];
    try { const data=await apiRequest(`/tasks/${selected._id}`,{token,method:'PATCH',body:JSON.stringify({subtasks})}); setTasks(old=>old.map(t=>t._id===selected._id?data.task:t));setSelected(data.task);toast.success('Subtask added'); }
    catch(error){toast.error(error.message);}
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen?'open':''}`}>
      <div className="brand"><span className="brand-mark">T</span> TaskMatrix <button className="mobile-close icon-btn" onClick={()=>setMobileOpen(false)}><X/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="nav-item active" onClick={()=>{setFilter('All');setMobileOpen(false);}}><LayoutDashboard size={18}/> Overview</button>
      <button className="nav-item" onClick={()=>{setFilter('Todo');setMobileOpen(false);}}><ClipboardList size={18}/> To do</button>
      <button className="nav-item" onClick={()=>{setFilter('In Progress');setMobileOpen(false);}}><Activity size={18}/> In progress</button>
      <button className="nav-item" onClick={()=>{setFilter('Done');setMobileOpen(false);}}><CheckCircle2 size={18}/> Completed</button>
      <div className="sidebar-bottom"><div className="profile-chip"><div className="avatar">{user?.name?.[0]?.toUpperCase()||'U'}</div><div className="profile-info"><strong>{user?.name}</strong><small>{user?.email}</small></div><button className="icon-btn logout" title="Sign out" onClick={logout}><LogOut size={17}/></button></div><p className="version-label">TASKMATRIX · SPRINT 16</p></div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={()=>setMobileOpen(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-btn" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> Overview</div><div className="topbar-right"><span className="today-label"><CalendarDays size={15}/> Your focus space</span><div className="avatar small">{user?.name?.[0]?.toUpperCase()}</div></div></header>
      <div className="page-content">
        <section className="welcome-row"><div><span className="eyebrow">YOUR DAILY OVERVIEW</span><h1>Good to see you, {user?.name?.split(' ')[0]} <span className="wave">✦</span></h1><p className="muted">A little progress each day adds up to big results.</p></div><button className="primary-btn" onClick={()=>setModal({task:null})}><Plus size={17}/> New task</button></section>
        <section className="stats-grid">
          <Stat icon={<Target/>} label="Total tasks" value={counts.total} tone="violet"/>
          <Stat icon={<Activity/>} label="Active tasks" value={counts.active} tone="blue"/>
          <Stat icon={<CheckCircle2/>} label="Completed" value={counts.done} tone="green"/>
          <Stat icon={<Sparkles/>} label="High priority" value={counts.high} tone="amber"/>
        </section>
        <section className="content-grid">
          <div className="tasks-panel panel">
            <div className="panel-header"><div><h2>Your tasks</h2><p className="muted">Keep your next steps in sight.</p></div><span className="count-pill">{visible.length} items</span></div>
            <div className="task-tools"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks…"/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Todo</option><option>In Progress</option><option>Done</option></select></div>
            {loading ? <div className="task-skeletons"><i/><i/><i/></div> : visible.length===0 ? <div className="empty-state"><div className="empty-icon"><ClipboardList size={25}/></div><h3>{tasks.length?'No matching tasks':'Your workspace is clear'}</h3><p>{tasks.length?'Try another filter or search term.':'Create your first task and turn an idea into action.'}</p>{!tasks.length&&<button className="primary-btn" onClick={()=>setModal({task:null})}><Plus size={16}/> Create first task</button>}</div> :
              <div className="task-list">{visible.map(task=><article className={`task-row ${selected?._id===task._id?'selected':''}`} key={task._id} onClick={()=>setSelected(task)}><button className={`task-check ${task.status==='Done'?'checked':''}`} onClick={e=>{e.stopPropagation();changeStatus(task);}} aria-label="Toggle task complete">{task.status==='Done'?<Check size={14}/>:<Circle size={17}/>}</button><div className="task-main"><strong className={task.status==='Done'?'completed-title':''}>{task.title}</strong><p>{task.description||'No description added'}</p><div className="task-meta"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span><span className={`status-dot ${task.status==='Done'?'done':task.status==='In Progress'?'progress':''}`}>{task.status}</span>{task.dueDate&&<span className="due-date">{new Date(task.dueDate).toLocaleDateString()}</span>}</div></div><div className="task-actions"><button className="icon-btn" title="Edit" onClick={e=>{e.stopPropagation();setModal({task});}}><span className="edit-glyph">✎</span></button><button className="icon-btn danger-hover" title="Delete" onClick={e=>{e.stopPropagation();removeTask(task._id);}}><Trash2 size={16}/></button></div></article>)}</div>}
          </div>
          <aside className="detail-column">
            {selected ? <div className="panel detail-panel"><div className="panel-header"><div><span className="eyebrow">TASK DETAILS</span><h2>{selected.title}</h2></div><button className="icon-btn" onClick={()=>setSelected(null)}><X size={17}/></button></div><p className="detail-description">{selected.description||'No description yet.'}</p><div className="detail-line"><span>Status</span><strong>{selected.status}</strong></div><div className="detail-line"><span>Priority</span><strong>{selected.priority}</strong></div><div className="detail-line"><span>Subtasks</span><strong>{selected.subtasks?.length||0}</strong></div><AISubtasks task={selected} token={token} onAdd={addSubtask}/>{selected.subtasks?.length>0&&<div className="subtask-list">{selected.subtasks.map((s,i)=><div key={i}><Circle size={13}/>{s.title}</div>)}</div>}</div> :
            <div className="focus-card"><div className="focus-orbit"><Sparkles size={23}/></div><span className="eyebrow">STAY IN FLOW</span><h3>One thing at a time.</h3><p>Choose a task to see its details, or let AI help you map out the next steps.</p><div className="focus-decoration"><span/><span/><span/><span/><span/></div></div>}
            <div className="tip-card"><div className="tip-icon"><Sparkles size={17}/></div><div><strong>A small tip</strong><p>Break bigger goals into smaller actions. Momentum follows clarity.</p></div></div>
          </aside>
        </section>
        <footer className="page-footer">Made for focused work <span>·</span> TaskMatrix Sprint 16</footer>
      </div>
    </main>
    {modal&&<TaskModal task={modal.task} onClose={()=>setModal(null)} onSave={saveTask} saving={saving}/>}
  </div>;
}
function Stat({icon,label,value,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>; }
function AppContent() {
  const { token, checking } = useAuth();
  if (checking) return <div className="checking-screen"><div className="loader"/><span>Preparing your workspace…</span></div>;
  return token ? <Dashboard/> : <AuthScreen/>;
}
export default function App() { return <AuthProvider><AppContent/></AuthProvider>; }
