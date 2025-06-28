'use client'

import { ShoppingCart} from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import SheetDemo from './menu'


export default function Header() {
  return (
    <header className="container my-3 ">
      <div className="mx-auto flex h-16 items-center justify-between ">
        <div className='flex items-center gap-4'>
        <Link href="/" className="font-bold text-3xl text-primary uppercase">
          <span>st</span> pizza
        </Link>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-gray-500 text-xl  transition font-semibold hover:text-primary" >Home</Link>
              <Link href="/about" className="text-gray-500 text-xl  transition font-semibold hover:text-primary">About</Link>
              <Link href="/contact" className="text-gray-500 text-xl  transition font-semibold hover:text-primary">Contact</Link>
              <Link href="/menu" className="text-gray-500 text-xl  transition font-semibold hover:text-primary">Menu</Link>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4 " >
                <Link href="/">
                  <Button size="lg" className="h-10 px-6  rounded-full text-sm font-semibold">
                    Login
                  </Button>
                </Link>
                <Link href="/cart" className='relative pt-3 '>
                  <ShoppingCart/>
                  <span className='absolute top-2 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>7</span>
                </Link>
                <SheetDemo />
        </div>
      </div>
    </header>
  )
}


