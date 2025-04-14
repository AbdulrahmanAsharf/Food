import { buttonVariants } from '@/components/ui/button'
import { Languages, Pages, Routes } from '@/constants/enums'
import { Link } from '@/i18n/navigation'
import { ArrowRightCircle } from 'lucide-react'
import React from 'react'
import MenuItems from './_components/MenuItems'
import { getProducts } from '@/server/db/products'
import { getLocale, getTranslations } from 'next-intl/server'

async function Menutiemdpages() {
    const t =  await getTranslations('admin.menu-items')
    const locale = await getLocale();
    const products = await getProducts();
    return (
    <main>
        <section className='section-gap'>
            <div className='container'>
                <Link 
                    href={`/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`}
                    className={`${buttonVariants({
                        variant:"outline"
                    })} !mx-auto !flex !w-80 !h-10 mb-8`}
                >
                {t("createNewMenuItem")}
                <ArrowRightCircle 
                    className={`!w-5 !h-5 ${
                        locale === Languages.ARABIC ? "rotate-180" :""
                    }`}
                />
                </Link>
                <MenuItems products={products} />
            </div>
        </section>
    </main>
    )
}

export default Menutiemdpages