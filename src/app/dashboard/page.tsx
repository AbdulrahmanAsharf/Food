// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function DashboardPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const res = await fetch('/api/get-role');
      const data = await res.json();

      if (data?.role === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/profile');
      }
    };

    if (isSignedIn) {
      checkRole();
    }
  }, [isSignedIn, router]);

  return <p className="text-center mt-20">🔄 Redirecting...</p>;
}
