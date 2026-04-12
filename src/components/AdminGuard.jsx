import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2, ShieldOff } from 'lucide-react';

export default function AdminGuard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(u => { setUser(u); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-950">
        <Loader2 className="animate-spin text-yellow-400" size={28} />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-950 text-center px-6">
        <div>
          <ShieldOff size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-white font-black text-2xl mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-6">This area is restricted to administrators only.</p>
          <a href="/" className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm font-semibold transition-colors">
            ← Return to Platform
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}