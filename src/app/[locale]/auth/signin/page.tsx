/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { Pages, Routes } from "@/constants/enums";
import { Link } from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import {  SigninForm } from './_components/SigninForm';


function page() {
  const t = useTranslations('auth.login');
  return (
<div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-lg shadow-lg p-4 rounded-lg ">
    <h1 className="text-center text-2xl font-bold text-black sm:text-3xl">
    {t('title')}
    </h1>
    <SigninForm />
    <p className="mt-2 flex items-center justify-center text-accent text-sm">
      <span>{t('authPrompt.message')}</span>
        <Link
          href={`/${Routes.AUTH}/${Pages.Register}`}
          className={`${buttonVariants({
            variant: "link",
            size: "sm",
          })} !text-black`}
        >
          {t('authPrompt.signUpLinkText')}
        </Link>
    </p>
  </div>
</div>
  )
}

export default page