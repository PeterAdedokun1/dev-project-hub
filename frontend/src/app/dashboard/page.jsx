'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const STATUS_LABEL = {
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
};

const STATUS_COLOR = {
  not_started: 'bg-gray-700 text-gray-300',
  in_progress: 'bg-yellow-900 text-yellow-300',
  completed: 'bg-green-900 text-green-300',
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.getProjects().then(setProjects).finally(() => setFetching(false));
    }
  }, [user]);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const project = await api.createProject(form);
      setProjects([project, ...projects]);
      setForm({ title: '', description: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project and all its tasks?')) return;
    await api.deleteProject(id);
    setProjects(projects.filter((p) => p._id !== id));
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  const active = projects.filter((p) => !p.shipped);
  const shipped = projects.filter((p) => p.shipped);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Projects</h1>
            <p className="text-gray-400 text-sm mt-1">
              {active.length} active · {shipped.length} shipped
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            + New Project
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 space-y-4"
          >
            <h2 className="font-semibold text-lg">New project</h2>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <input
              type="text"
              required
              placeholder="Project title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {submitting ? 'Creating…' : 'Create project'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white text-sm px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {projects.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-4">🚀</p>
            <p className="text-lg">No projects yet. Start your first one!</p>
          </div>
        )}

        {active.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {active.map((p) => (
              <ProjectCard key={p._id} project={p} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {shipped.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4 text-gray-400">Shipped</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shipped.map((p) => (
                <ProjectCard key={p._id} project={p} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function ProjectCard({ project, onDelete }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/projects/${project._id}`} className="font-semibold hover:text-blue-400 transition-colors leading-snug">
          {project.title}
        </Link>
        {project.shipped && (
          <span className="text-xs bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full font-medium shrink-0">
            Shipped
          </span>
        )}
      </div>
      {project.description && (
        <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
      )}
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[project.status]}`}>
          {STATUS_LABEL[project.status]}
        </span>
        <div className="flex gap-3 text-xs text-gray-500">
          <Link href={`/projects/${project._id}`} className="hover:text-white transition-colors">
            Open
          </Link>
          <button onClick={() => onDelete(project._id)} className="hover:text-red-400 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
