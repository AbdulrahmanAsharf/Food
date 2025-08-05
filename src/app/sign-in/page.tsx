/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { signInSchema } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Inputs = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { isLoaded: authReady, isSignedIn } = useAuth();
  const { isLoaded: signInReady, signIn, setActive } = useSignIn();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: Inputs) => {
    if (!signInReady || !signIn || !setActive) {
      toast.error('المصادقة غير جاهزة');
      return;
    }

    try {
      const res = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (res.status === 'complete') {
        await setActive({ session: res.createdSessionId });
        toast.success('✅ تم تسجيل الدخول بنجاح');
        router.push('/dashboard');
      } else {
        toast.error('لم يكتمل تسجيل الدخول');
      }
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || '❌ حدث خطأ ما');
    }
  };

  if (!authReady || !signInReady || isSignedIn) return null;

  return (
    <div className="max-w-sm mx-auto mt-10" dir="rtl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-xl font-bold text-center">🔐 تسجيل الدخول</h2>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
