import React from 'react'
import { Button } from '../ui/button'
import data from '@/db/data'
import Image from 'next/image'
import { formatCurrency } from '@/lib/formatters'
function Menu() {
  return (
    <>
    
      {data.map((item) => (
  <div className='bg-gray-300 rounded-2xl' key={item.id}>
    <div className='p-4 text-center'>
      <div className='flex justify-center'>
        <Image src={item.image} width={130} height={130} alt={item.name} />
      </div>
      <div className='py-4'>
        <h2 className='text-2xl font-bold'>{item.name}</h2>
        <p className=' text-gray-600'>{item.description}</p>
      </div>
      <Button className='cursor-pointer font-semibold text-white'>
        Add To Cart {formatCurrency(item.price)}
      </Button>
    </div>
  </div>
))}
</>
    
  )
}

export default Menu
