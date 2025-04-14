import { EditUserForm } from '@/components/edit-user-form'
import { Pages, Routes } from '@/constants/enums';
import { getUser, getUsers } from '@/server/db/users';
import { redirect } from 'next/navigation';
import React from 'react'

export async function generateStaticParams() {
    const users = await getUsers();
    return users.map((user) => ({ userId: user.id }));
}

async function page({params}: {params: Promise<{ userId: string }>;}) {
    const {  userId } = await params;
    const user = await getUser(userId);
    if (!user) {
      redirect(`/${Routes.ADMIN}/${Pages.USERS}`);
    }
  
    return (
        <main>
            <section className='section-gap'>
                <div className='container'>
                    <EditUserForm user={user}/>
                </div>
            </section>
        </main>
    )
}

export default page