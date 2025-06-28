import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRightCircle } from 'lucide-react';
import Image from 'next/image';

async function Section() {
  return (
    <section className='container'>
      <div className=' grid grid-cols-1 md:grid-cols-2'>
        <div className='md:py-12'>
          <h1 className='text-4xl font-semibold'>
            Everything<br />
            is better<br />
            with a&nbsp;
          <span className="text-primary">
            Pizza
          </span>
          </h1>
          <p className='text-gray-500 my-4'>
            Pizza is the missing piece that makes every day complete, a simple yet delicious joy in life
          </p>
          <div className='flex items-center gap-4'>
            <Link
              href='/MENU'className={`${buttonVariants({
                size: 'lg',
              })} space-x-2 !px-4 !rounded-full uppercase`}
            >
              Order now
              <ArrowRightCircle className={`!w-5 !h-5 `}/>
            </Link>
            <Link href='Routes.ABOUT'
              className='flex gap-2 items-center text-black hover:text-primary duration-200 transition-colors font-semibold'
            >
              Learn more
              <ArrowRightCircle className={`!w-5 !h-5 `}/>
            </Link>
          </div>
        </div>
        <div className='relative hidden md:block'>
          <Image
            src='/pizza.png'
            alt='Pizza'
            fill
            className='object-contain'
            loading='eager'
            priority
          />
        </div>
      </div>
    </section>
  );
}


export default Section
