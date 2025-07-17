'use client';
import { useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <p>Loading...</p>;

  console.log('🔍 user data:', user);

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.firstName || user?.username}
      </h1>
      <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
      <p>Role: {String(user?.publicMetadata?.role)}</p>

      <pre className="mt-4 text-sm text-gray-600">
        🔍 Debug Metadata
        {JSON.stringify(user?.publicMetadata, null, 2)}
      </pre>
    </div>
  );
}


//F@stPizza2025!
//Limo@2025!Burger$App باسورد ايميل