import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #222', borderTopColor: '#d4a017', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  return session ? <>{children}</> : <Navigate to="/admin/login" replace />;
}
