import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const empty = { title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' };
export default function TaskModal({ task, onClose, onSave, saving }) {
  const [form, setForm] = useState(empty);
  useEffect(() => {
    if (task) setForm({ title: task.title || '', description: task.description || '', priority: task.priority || 'Medium', status: task.status || 'Todo', dueDate: task.dueDate ? task.dueDate.slice(0,10) : '' });
    else setForm(empty);
  }, [task]);
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const submit = (e) => { e.preventDefault(); onSave({ ...form, dueDate: form.dueDate ? new Date(`${form.dueDate}T00:00:00.000Z`).toISOString() : null }); };
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget && onClose()}>
    <section className="modal-card">
      <div className="modal-head"><div><span className="eyebrow">{task ? 'UPDATE TASK' : 'NEW TASK'}</span><h2>{task ? 'Edit task' : 'Create a task'}</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
      <form onSubmit={submit} className="form-stack">
        <label>Task title<input autoFocus required minLength="2" maxLength="150" value={form.title} onChange={e=>update('title',e.target.value)} placeholder="What needs to get done?"/></label>
        <label>Description<textarea rows="3" maxLength="2000" value={form.description} onChange={e=>update('description',e.target.value)} placeholder="Add a little context…"/></label>
        <div className="form-grid">
          <label>Priority<select value={form.priority} onChange={e=>update('priority',e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
          <label>Status<select value={form.status} onChange={e=>update('status',e.target.value)}><option>Todo</option><option>In Progress</option><option>Done</option></select></label>
        </div>
        <label>Due date<input type="date" value={form.dueDate} onChange={e=>update('dueDate',e.target.value)}/></label>
        <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={saving}>{saving ? 'Saving…' : task ? 'Save changes' : 'Create task'}</button></div>
      </form>
    </section>
  </div>;
}
