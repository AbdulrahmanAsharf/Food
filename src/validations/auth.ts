import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z
      .string()
      .refine((val) => z.string().email().safeParse(val).success, {
        message: 'Invalid email address',
      }), // ✅ شلنا الفاصلة الزائدة هنا
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters' })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message: 'Only letters, numbers, - and _ allowed',
      }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
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
