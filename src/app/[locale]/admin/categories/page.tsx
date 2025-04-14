import {getcategories  } from '@/server/db/categories'
import { getTranslations } from 'next-intl/server';
import React from 'react'
import CategoryItem from './_components/CategoryItem';
import  Categortyform  from './_components/Categortyform';





async function page() {
    const noFound = await getTranslations("");
    const categories = await getcategories ()
  return (
    <main>
        <section className='section-gap'>
            <div className="container">
                <div  className="sm:max-w-[625px] mx-auto space-y-6">
                <Categortyform />
                {categories.length > 0 ? (
                    <ul className="flex flex-col gap-4">
                        {categories.map((categorie) =>(
                            <CategoryItem key={categorie.id} category={categorie} />
                        ))}
                    </ul>
                )
                :
                (<p className="text-accent text-center py-10">
                    {noFound('noCategoriesFound')}
                </p>)
                }
                </div>
                
            </div>
        </section>
    </main>
  )
}

export default page