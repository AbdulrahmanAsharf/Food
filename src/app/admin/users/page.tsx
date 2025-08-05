import { buttonVariants } from '@/components/ui/button';
import { getUsers } from '@/server/db/users';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import DeleteUserButton from './_components/DeleteUserButton';


async function page() {
  const users =await getUsers();
  console.log(users);
  
  return (
    <main className="max-w-xl mx-auto my-10 p-6 border rounded-lg shadow-lg bg-white">
      <ul className='flex flex-col gap-4'>
        {users.map((user) => (
        <li 
          key={user.id} 
          className='flex justify-between items-center gap-4 p-4 rounded-md bg-gray-100'>
          <div className="md:flex justify-between flex-1" >
            <h3 className="text-black font-medium text-sm flex-1">{user.name}</h3>
            <p className="text-gray-600 font-medium text-sm flex-1">{user.email}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/admin/users/${user.id}/edit`}
              className={`${buttonVariants({ variant: "outline" })}`}
            >
              <Edit />
            </Link>
            <DeleteUserButton userId={user.id} />
          </div>
        </li>
      ))}</ul>
    </main>
  )
}

export default page
