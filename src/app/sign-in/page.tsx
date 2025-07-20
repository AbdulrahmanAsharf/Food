/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSignIn, useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { signInSchema } from '@/validations/auth';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { isLoaded: authReady, isSignedIn } = useAuth();
  const { isLoaded: signInReady, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = signInSchema.safeParse(form);
    if (!validation.success) {
      validation.error.issues.forEach(issue =>
        toast.error(`❌ ${issue.message}`)
      );
      setLoading(false);
      return;
    }

    if (!signInReady || !signIn || !setActive) {
      toast.error('Authentication not ready');
      setLoading(false);
      return;
    }

    try {
      const res = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (res.status === 'complete') {
        await setActive({ session: res.createdSessionId });
        toast.success('✅ Signed in');

        // ✅ التوجيه مباشرة إلى /dashboard
        router.push('/dashboard');
      } else {
        toast.error('Sign-in incomplete');
      }
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!authReady || !signInReady || isSignedIn) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 space-y-4 p-6 border rounded"
    >
      <h2 className="text-xl font-bold text-center">🔐 Sign In</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Loading...' : 'Sign In'}
      </Button>
    </form>
  );
}
