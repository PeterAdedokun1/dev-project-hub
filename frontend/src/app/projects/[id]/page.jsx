'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

export default function ProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: '' });
  const [saving, setSaving] = useState(false);

  const [taskInput, setTaskInput] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  const [shipping, setShipping] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api
        .getProject(id)
        .then(({ tasks: t, ...p }) => {
          setProject(p);
          setTasks(t);
          setEditForm({ title: p.title, description: p.description, status: p.status });
        })
        .catch(() => router.replace('/dashboard'))
        .finally(() => setFetching(false));
    }
  }, [user, id, router]);

  async function handleEdit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateProject(id, editForm);
      setProject(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setAddingTask(true);
    try {
      const task = await api.createTask({ projectId: id, title: taskInput.trim() });
      setTasks([...tasks, task]);
      setTaskInput('');
    } finally {
      setAddingTask(false);
    }
  }

  async function handleToggleTask(taskId) {
    const updated = await api.toggleTask(taskId);
    setTasks(tasks.map((t) => (t._id === taskId ? updated : t)));
  }

  async function handleDeleteTask(taskId) {
    await api.deleteTask(taskId);
    setTasks(tasks.filter((t) => t._id !== taskId));
  }

  async function handleShip() {
    if (!confirm('Mark this project as shipped? This cannot be undone.')) return;
    setShipping(true);
    try {
      const updated = await api.shipProject(id);
      setProject(updated);
    } finally {
      setShipping(false);
    }
  }

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>
    );
  }

  if (!project) return null;

  const done = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">
          ← Dashboard
        </Link>

        {project.shipped && (
          <div className="mb-6 bg-emerald-950 border border-emerald-800 rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <p className="font-semibold text-emerald-300">This project has been shipped!</p>
              <p className="text-emerald-500 text-sm">
                {new Date(project.shippedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {editing ? (
          <form onSubmit={handleEdit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 space-y-4">
            <h2 className="font-semibold">Edit project</h2>
            <input
              type="text"
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 font-semibold text-lg"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 resize-none text-sm"
              placeholder="Description"
            />
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 text-sm"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="text-gray-400 hover:text-white text-sm px-4 py-2">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-2xl font-bold">{project.title}</h1>
              <div className="flex gap-3 text-sm shrink-0">
                <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-white transition-colors">
                  Edit
                </button>
                {!project.shipped && (
                  <button
                    onClick={handleShip}
                    disabled={shipping}
                    className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold px-3 py-1 rounded-lg transition-colors"
                  >
                    {shipping ? 'Shipping…' : '🚀 Ship it'}
                  </button>
                )}
              </div>
            </div>
            {project.description && <p className="text-gray-400 mb-4">{project.description}</p>}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(project.status)}`}>
              {STATUS_OPTIONS.find((o) => o.value === project.status)?.label}
            </span>
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Tasks</h2>
            {tasks.length > 0 && (
              <span className="text-sm text-gray-400">
                {done}/{tasks.length} done
              </span>
            )}
          </div>

          {tasks.length > 0 && (
            <div className="h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Add a task…"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 text-sm"
            />
            <button
              type="submit"
              disabled={addingTask || !taskInput.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              Add
            </button>
          </form>

          {tasks.length === 0 && (
            <p className="text-gray-500 text-sm py-6 text-center">No tasks yet. Add one above.</p>
          )}

          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 group"
              >
                <button
                  onClick={() => handleToggleTask(task._id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    task.done
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-600 hover:border-blue-500'
                  }`}
                >
                  {task.done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 text-sm ${task.done ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </span>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-lg leading-none"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function statusColor(status) {
  return {
    not_started: 'bg-gray-700 text-gray-300',
    in_progress: 'bg-yellow-900 text-yellow-300',
    completed: 'bg-green-900 text-green-300',
  }[status] || 'bg-gray-700 text-gray-300';
}
