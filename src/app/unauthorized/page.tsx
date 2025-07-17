// src/app/unauthorized/page.tsx
'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Unauthorized</h1>
      <p className="text-gray-600 mb-6">You do not have permission to access this page.</p>
      <Link href="/" className="text-blue-500 underline">
        Go back to Home
      </Link>
    </div>
  );
}
