import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const res = await api.get('/tasks/');
    setTasks(res.data);  // FastAPI returns array directly (not wrapped in {tasks:[]})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, form);
        setMessage('Task updated!');
        setEditId(null);
      } else {
        await api.post('/tasks/', form);
        setMessage('Task created!');
      }
      setForm({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Error');
    }
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setForm({ title: task.title, description: task.description || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="dashboard">
      <header>
        <h2>Welcome, {user?.name} <span className="role-badge">{user?.role}</span></h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {message && <p className="success">{message}</p>}

      <section className="task-form">
        <h3>{editId ? 'Edit Task' : 'Create Task'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Task Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit">{editId ? 'Update' : 'Create'}</button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm({ title: '', description: '' }); }}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="task-list">
        <h3>Tasks ({tasks.length})</h3>
        {tasks.length === 0 && <p>No tasks yet. Create one above!</p>}
        {tasks.map((task) => (
          <div key={task.id} className={`task-card ${task.status}`}>
            <h4>{task.title}</h4>
            {task.description && <p>{task.description}</p>}
            <small>Status: {task.status.replace('_', ' ')}</small>
            <div className="task-actions">
              <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task.id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}