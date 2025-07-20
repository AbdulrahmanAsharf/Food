import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email({ message: 'بريد غير صالح' }),
    username: z.string().min(3, { message: 'اسم المستخدم قصير' }),
    password: z.string().min(6, { message: 'كلمة المرور قصيرة' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمة المرور غير متطابقة',
    path: ['confirmPassword'], // حدد مكان الخطأ
  });

export const signInSchema = z.object({
  email: z
    .string()
    .refine((val) => z.string().email().safeParse(val).success, {
      message: 'Invalid email address',
    }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});
