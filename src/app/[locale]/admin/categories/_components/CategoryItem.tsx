import { Category } from '@prisma/client'
import React from 'react'
import EditCategory from './EditCategory'
import DeleteCategory from './DeleteCategory '

function CategoryItem({category} :{category:Category}) {
  return (
    <li className='bg-gray-300 p-4 flex justify-center rounded-md'>
      <h3 className='text-black text-lg flex-1 font-medium'>{category.name}</h3>
      <div className='flex items-center gap-2'>
        <EditCategory category={category}/>
        <DeleteCategory  id={category.id}/> 
      </div>
    </li>
  )
}

export default CategoryItem