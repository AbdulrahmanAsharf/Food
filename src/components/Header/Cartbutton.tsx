"use client"
import React, { useEffect, useState } from 'react'
import {Link} from '@/i18n/navigation';
import { Routes } from '@/constants/enums';
import { ShoppingCartIcon } from 'lucide-react';
import { getCartQuantity } from '@/lib/cart';
import { useAppSelector } from '@/redux/hooks';
import { selectCartItems  } from '@/redux/features/cart/cartSlice';
function Cartbutton() {
  const [isClient, setIsClient] = useState(false);
  const cart = useAppSelector(selectCartItems)
  const quantity = getCartQuantity(cart)

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; 
  return (
    <Link  href={`/${Routes.CART}`} className=' block relative group'>
        <span className='absolute -top-4 start-4 w-5 h-5 text-sm bg-primary rounded-full text-white text-center'
        >{quantity}
        </span>
        <ShoppingCartIcon
        className={`text-accent group-hover:text-primary duration-200 transition-colors !w-6 !h-6`}
      />
    </Link>
  )
}

export default Cartbutton