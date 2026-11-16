import { useState } from 'react';
import { Sparkles, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../services/api';

export default function AISubtasks({ task, token, onAdd }) {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const generate = async () => {
    setBusy(true);
    try {
      const data = await apiRequest('/ai/suggest', { token, method: 'POST', body: JSON.stringify({ taskTitle: task.title, description: task.description, count: 5 }) });
      setItems(data.subtasks.map((title, index) => ({ id: `${Date.now()}-${index}`, title })));
      toast.success('Subtasks generated');
    } catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };
  return <div className="ai-panel">
    <div className="ai-panel-head"><div className="ai-heading"><span className="ai-icon"><Sparkles size={17}/></span><div><strong>AI task breakdown</strong><small>Turn this task into clear next steps</small></div></div><button className="ai-btn" onClick={generate} disabled={busy}><RefreshCw size={14} className={busy?'spin':''}/>{busy?'Thinking…':'Generate'}</button></div>
    {busy ? <div className="suggestion-skeleton"><i/><i/><i/></div> : items.length ? <div className="suggestion-list">{items.map(item=><div className="suggestion" key={item.id}><span>{item.title}</span><button title="Add to task" onClick={()=>{onAdd(item.title);setItems(old=>old.filter(x=>x.id!==item.id));}}><Plus size={16}/></button></div>)}</div> : <p className="ai-hint">Generate a few practical steps to get moving.</p>}
  </div>;
}
