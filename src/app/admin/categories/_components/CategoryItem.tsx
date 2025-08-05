import { Category } from '@prisma/client'
import React from 'react'
import DeleteCategory from './DeleteCategory'
import EditCategory from './EditCategory'

function CategoryItem({ category }: { category: Category }) {
  return (
    <li className="bg-gray-300 p-4 rounded-md flex justify-between">
        <h3 className="text-black font-medium text-lg flex-1">{category.name}</h3>
        <div className="flex items-center gap-2">
            <EditCategory category={category} />
            <DeleteCategory id={category.id} />
        </div>
    </li>
  )
}

export default CategoryItem
