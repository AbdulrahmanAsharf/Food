'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { ProfileForm } from './ProfileForm';
import { ProfileFormData } from '@/validations/profile';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [defaultValues, setDefaultValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('/api/get-role');
        const data = await res.json();

        setDefaultValues({
          name: data.name || '',
          image: user?.imageUrl || '',
          phone: data.phone || '',
          streetAddress: data.streetAddress || '',
          postalCode: data.postalCode || '',
          city: data.city || '',
          country: data.country || '',
          role: data.role || 'USER',
        });
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err);
      }
    };

    if (isLoaded && user) {
      fetchUserProfile();
    }
  }, [isLoaded, user]);

  if (!defaultValues) {
    return <p className="text-center mt-10">Loading your profile...</p>;
  }

  return (
    <main className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-primary text-center font-bold text-4xl italic mb-10">Profile</h1>
      <ProfileForm defaultValues={defaultValues} userRole="USER" />
    </main>
  );
}

