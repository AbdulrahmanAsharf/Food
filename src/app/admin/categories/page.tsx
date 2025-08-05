import { getCategories } from '@/server/db/categories';
import React from 'react'
import CategoryItem from './_components/CategoryItem';
import Form from './_components/From';

async function page() {
  const categories = await getCategories();
  return (
    <main className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <Form />
      {categories.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </ul>
      ):(
        <p className="text-accent text-center py-10">
          No Categories Found
        </p>
      )}
    </main>
  )
}

export default page
