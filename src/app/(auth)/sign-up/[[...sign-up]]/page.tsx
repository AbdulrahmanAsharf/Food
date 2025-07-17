/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSignUp, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { signUpSchema } from '@/validations/auth';
import { ZodError } from 'zod';

export default function SignUpPage() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (authLoaded && isSignedIn) router.replace('/profile');
  }, [authLoaded, isSignedIn, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = signUpSchema.safeParse({ email, password, confirmPassword, username });

    if (!validation.success) {
      (validation.error as ZodError).issues.forEach((issue) => toast.error(`❌ ${issue.message}`));
      setLoading(false);
      return;
    }

    if (!isLoaded || !signUp || !setActive) {
      setLoading(false);
      return;
    }

    try {
      const res = await signUp.create({
        emailAddress: email,
        password,
        username,
      });

      if (res.status !== 'complete') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        toast.success('✅ Check your email for verification');
        router.push('/verify-email');
        return;
      }

      await setActive({ session: res.createdSessionId });

      // ✅ استخدم signUp.createdUserId بدلاً من res.user.id
      await fetch('/api/set-role', {
        method: 'POST',
        body: JSON.stringify({ userId: signUp.createdUserId, role: 'user' }),
      });

      toast.success('✅ Account created');
      router.push('/profile');
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !authLoaded || isSignedIn) return null;

  return (
    <form onSubmit={handleSignUp} className="max-w-md mx-auto mt-20 space-y-4 p-6 border rounded">
      <h2 className="text-xl font-bold text-center">Sign Up</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded p-2" required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded p-2" required />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border rounded p-2" required />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded p-2" required />
      <div id="clerk-captcha" className="mb-2" />
      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</Button>
    </form>
  );
}

//Limo@2025!Burger$App باسورد ايميل
