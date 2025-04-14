import Link from 'next/link'
import React from 'react'
import Navber from './Navber'
import Cartbutton from './Cartbutton'
import {useTranslations} from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher'
import AuthButtons from './AuthButtons';
function Header() {
  const t = useTranslations();
  return (
    <header className='py-4 md:my-6'>
        <div className='container flex items-center justify-between gap-6 lg:gap-10'>
            <Link href='/' className='font-semibold text-2xl text-primary'>
            🍕 {t('logo')}
            </Link>
            <Navber />
            <div className="flex items-center gap-6 flex-1 justify-end">
              <div className='hidden lg:flex lg:items-center lg:gap-6'>
                <AuthButtons />
                <LanguageSwitcher /> 
              </div>
                <Cartbutton />
            </div>
        </div>
    </header>
  )
}

export default Header