"use client"
import { Pages, Routes } from '@/constants/enums'
import React from 'react'
import { useTranslations } from "next-intl";
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';
import { useParams, usePathname } from 'next/navigation';


function AdminTabs() {
    const pathname = usePathname();
    const { locale } = useParams();
    const t = useTranslations("admin.tabs");
    const tabs=[
        {
        id:crypto.randomUUID(),
        title :t('profile'),
        href:Routes.ADMIN
        },
        {
            id:crypto.randomUUID(),
            title :t("categories"),
            href:`${Routes.ADMIN}/${Pages.CATEGORIES}`
        },
        {
            id:crypto.randomUUID(),
            title :t("menuItems"),
            href:`${Routes.ADMIN}/${Pages.MENU_ITEMS}`
        },
        {
            id:crypto.randomUUID(),
            title :t("users"),
            href:`${Routes.ADMIN}/${Pages.USERS}`
        },
        {
            id:crypto.randomUUID(),
            title :t("orders"),
            href:`${Routes.ADMIN}/${Pages.ORDERS}`
        },
    ]
    const isActiveTab = (href: string) => {
        const hrefArray = href.split("/");
        return hrefArray.length > 1
        ? pathname.startsWith(`/${locale}/${href}`)
        : pathname === `/${locale}/${href}`;
    }

  return (
    <nav className='mt-20'>
        <ul className='flex items-center justify-center gap-4'>
            {tabs.map((tab) => (
                <li key={tab.id}>
                    <Link 
                    href={`/${tab.href}`}
                    className={`hover:!text-white ${
                        isActiveTab(tab.href)
                        ? buttonVariants({ variant: "default" })
                        : buttonVariants({ variant: "outline" })
                    }`}
                    >
                    {tab.title}</Link>
                </li>
            ))}
        </ul>
    </nav>
  )
}

export default AdminTabs