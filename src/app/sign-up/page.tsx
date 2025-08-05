/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const signUpSchema = z
  .object({
    email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
    password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
    confirmPassword: z.string(),
    username: z.string().min(3, { message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمة المرور غير متطابقة',
    path: ['confirmPassword'],
  });

type Inputs = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
    },
  });

  const onSubmit = async (data: Inputs) => {
    if (!isLoaded || !signUp) return;

    try {
      const { email, password, username } = data;

      const res = await signUp.create({
        emailAddress: email,
        password,
        username,
      });

      if (res.status !== 'complete') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        toast.success('✅ من فضلك تحقق من بريدك الإلكتروني');
        router.push('/verify-email');
      }
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || 'حدث خطأ ما ❌');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded" dir="rtl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold text-center">📝 إنشاء حساب جديد</h2>

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تأكيد كلمة المرور</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المستخدم</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسمك" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div id="clerk-captcha" />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'جارٍ التسجيل...' : 'إنشاء حساب'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
