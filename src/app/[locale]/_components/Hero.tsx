import { buttonVariants } from '@/components/ui/button';
import {  Routes } from '@/constants/enums';
import { ArrowRightCircle } from 'lucide-react';

import Link from 'next/link';
import {useTranslations} from 'next-intl';
function Hero() {
  const t = useTranslations('home.hero');
  return (
    <section className='section-gap'>
      <div className='container grid grid-cols-1 md:grid-cols-2'>
        <div className='md:py-12'>
          <h1 className='text-4xl font-semibold'>{t('title')}</h1>
          <p className='text-accent my-4'>{t('description')}</p>
          <div className='flex items-center gap-4'>
            <Link
              href={`/${Routes.MENU}`}
              className={`${buttonVariants({
                size: 'lg',
              })} space-x-2 !px-4 !rounded-full uppercase`}
            >
              {t('orderNow')}
              <ArrowRightCircle
                className={`!w-5 !h-5 `}
              />
            </Link>
            <Link
              href={`/${Routes.ABOUT}`}
              className='flex gap-2 items-center text-black hover:text-primary duration-200 transition-colors font-semibold'
            >
              {t('learnMore')}
              <ArrowRightCircle
                className={`!w-5 !h-5 `}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
