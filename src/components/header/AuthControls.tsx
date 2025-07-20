'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function AuthControls() {
  const { isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await getToken(); // نضمن إن فيه جلسة فعلًا
        if (!token) return;

        const res = await fetch('/api/get-role');
        if (!res.ok) throw new Error('Failed to fetch role');

        const data = await res.json();
        setRole(data.role);
      } catch (error) {
        console.error('Error fetching role:', error);
        toast.error('تعذر جلب بيانات المستخدم');
      }
    };

    if (isSignedIn) {
      fetchRole();
    }
  }, [isSignedIn, getToken]);

  const handleLogout = async () => {
    await signOut();
    toast.success('تم تسجيل الخروج بنجاح');
    window.location.href = '/';
  };

  const renderButtons = () => {
    if (!isSignedIn) {
      return (
        <>
          <Link href="/sign-in">
            <Button className="mr-2">Login</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </>
      );
    }

    return (
      <>
        {role && (
          <Link href={role === 'ADMIN' ? '/admin' : '/profile'}>
            <Button className="mr-2">{role === 'ADMIN' ? 'Admin' : 'Profile'}</Button>
          </Link>
        )}
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </>
    );
  };

  return <>{renderButtons()}</>;
}
