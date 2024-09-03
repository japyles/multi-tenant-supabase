'use client'

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get the current session
    const session = supabase.auth.session();
    setSession(session);

    if (!session) {
      // If no session, redirect to the login page
      router.push('/auth/login');
    } else {
      setLoading(false); // Session is found, stop loading
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.push('/auth/login');
      }
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading while checking authentication
  }

  return (
    <div>
      {/* This wraps all tenant-specific pages */}
      {children}
    </div>
  );
}
