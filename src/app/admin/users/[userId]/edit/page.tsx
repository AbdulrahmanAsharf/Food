import { ProfileForm } from '@/app/profile/ProfileForm';
import {getUser} from '@/server/db/users'; // تعمل دالة تجيب بيانات المستخدم من DB
import { notFound } from 'next/navigation';
import { ProfileFormData } from '@/validations/profile';

interface Props {
  params: {
    userId: string;
  };
}

export default async function EditUserPage({ params }: Props) {
  const { userId } = params;

  const user = await getUser(userId); // ✅ اجلب بيانات المستخدم من قاعدة البيانات

  if (!user) return notFound();

  const defaultValues: ProfileFormData = {
    name: user.name || '',
    phone: user.phone || '',
    streetAddress: user.streetAddress || '',
    postalCode: user.postalCode || '',
    city: user.city || '',
    country: user.country || '',
    role: user.role, // 'ADMIN' | 'USER'
  };

  return (
    <main className="max-w-xl mx-auto my-10 p-6 border rounded-lg shadow-lg bg-white">
      <ProfileForm defaultValues={defaultValues} userRole="ADMIN" userId={user.id} />
    </main>
  );
}
