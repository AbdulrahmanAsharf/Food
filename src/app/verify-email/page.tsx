/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ✅ src/app/verify-email/page.tsx
'use client';

import { useSignUp, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userLoaded || !user) return;

    const isVerified = user.emailAddresses[0]?.verification?.status === 'verified';
    const role = user.publicMetadata?.role;

    if (isVerified) {
      if (role === 'admin') router.replace('/admin');
      else router.replace('/profile');
    }
  }, [user, userLoaded, router]);

const handleVerify = async () => {
  setLoading(true);
  try {
    const result = await signUp!.attemptEmailAddressVerification({ code });

    if (result?.status === 'complete') {
  const userId = result.createdUserId;

  const res = await fetch('/api/set-role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) throw new Error('Failed to set role');

  // ✅ فقط لو session مش موجودة
  if (!user?.id) {
    await setActive?.({ session: result.createdSessionId });
  }

  const data = await res.json();
  const role = data?.role || 'user';

  if (role === 'admin') {
    window.location.replace('/admin');
  } else {
    window.location.replace('/profile');
  }

  return;
}

    toast.error('❌ Verification failed');
  } catch (err: any) {
    console.error('[verify] error:', err);
    toast.error(err?.message || 'Unexpected error');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded space-y-4 text-center">
      <div className="flex justify-end">
        <Button variant="link" onClick={() => router.push('/sign-in')}>
          🔐 Sign In
        </Button>
      </div>

      <h2 className="text-xl font-bold text-center">📧 Verify Your Email</h2>
      <p className="text-sm text-gray-600 mb-4">
        Please check your inbox and enter the verification code to continue.
      </p>

      <input
        type="text"
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <Button onClick={handleVerify} disabled={loading} className="w-full">
        {loading ? 'Verifying...' : 'Verify Email'}
      </Button>
    </div>
  );
}
