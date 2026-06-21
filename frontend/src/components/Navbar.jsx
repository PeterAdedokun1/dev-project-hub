'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-lg tracking-tight">
          Dev Project Hub
        </Link>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">{user.name}</span>
            <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
