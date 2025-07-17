/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSignIn, useAuth, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { signInSchema } from '@/validations/auth';
import { ZodError } from 'zod';

export default function SignInPage() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authLoaded && isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (role === 'admin') router.replace('/admin');
      else router.replace('/profile');
    }
  }, [authLoaded, isSignedIn, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      (validation.error as ZodError).issues.forEach((issue) =>
        toast.error(`❌ ${issue.message}`)
      );
      setLoading(false);
      return;
    }

    if (!isLoaded || !signIn || !setActive) {
      toast.error('Authentication not ready, please try again.');
      setLoading(false);
      return;
    }

    try {
      const res = await signIn.create({ identifier: email, password });

      if (res.status === 'complete') {
await setActive({ session: res.createdSessionId });
toast.success('✅ Signed in');

// ✅ استخدم API لجلب الدور بدلاً من الاعتماد على user
const response = await fetch('/api/get-role');
const data = await response.json();

if (data.role === 'admin') router.replace('/admin');
else router.replace('/profile');

      } else {
        toast.error('Sign-in not complete. Please try again.');
      }
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !authLoaded || isSignedIn) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4 p-6 border rounded">
      <h2 className="text-xl font-bold text-center">🔐 Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Loading...' : 'Sign In'}
      </Button>
    </form>
  );
}
