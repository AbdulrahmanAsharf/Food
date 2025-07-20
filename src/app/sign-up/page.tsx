/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { signUpSchema } from '@/validations/auth';
import { ZodError } from 'zod';

export default function SignUpPage() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = signUpSchema.safeParse(form);
    if (!validation.success) {
      (validation.error as ZodError).issues.forEach((issue) =>
        toast.error(`❌ ${issue.message}`)
      );
      setLoading(false);
      return;
    }

    if (!isLoaded || !signUp) {
      setLoading(false);
      return;
    }

    try {
      const { email, password, username } = form;

      const res = await signUp.create({ emailAddress: email, password, username });

      if (res.status !== 'complete') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        toast.success('✅ Check your email for verification');
        router.push('/verify-email');
      }
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || '❌ Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="max-w-md mx-auto mt-20 space-y-4 p-6 border rounded"
    >
      <h2 className="text-xl font-bold text-center">Sign Up</h2>

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

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        name="username"
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Loading...' : 'Sign Up'}
      </Button>
    </form>
  );
}


