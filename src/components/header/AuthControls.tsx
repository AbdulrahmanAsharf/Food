'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function AuthControls() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();

  if (!isLoaded) return;

  const handleLogout = async () => {
    await signOut();
    toast.success('تم تسجيل الخروج بنجاح');
    window.location.href = '/';
  };

  const role = user?.publicMetadata?.role;

  // تحديد الرابط والنص حسب الدور
  let profileButton = null;

  if (isSignedIn) {
    if (role === 'user') {
      profileButton = (
        <Link href="/profile">
          <Button className="mr-2">Profile</Button>
        </Link>
      );
    } else if (role === 'admin') {
      profileButton = (
        <Link href="/admin">
          <Button className="mr-2">Admin</Button>
        </Link>
      );
    }
  }

  return (
    <>
      {isSignedIn ? (
        <>
          {profileButton}
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/sign-in">
            <Button className="mr-2">Login</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </>
      )}
    </>
  );
}
