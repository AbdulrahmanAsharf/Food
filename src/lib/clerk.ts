// src/lib/clerk.ts
import { Clerk } from '@clerk/clerk-sdk-node';

export const clerkClient = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY!,
});
