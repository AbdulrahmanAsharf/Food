'use client';

import { useUser } from '@clerk/nextjs';

export default function AdminPage() {
  const { user } = useUser();

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      <p>Role: {user?.publicMetadata?.role as string}</p>
    </div>
  );
}
