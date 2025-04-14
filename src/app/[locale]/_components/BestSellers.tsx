
import MainHeading from '@/components/main-heading';
import Menu from '@/components/menu';
import { getBestSellers } from '@/server/db/products';
import { getTranslations } from "next-intl/server";

async function   BestSellers() {
  const bestSellers = await getBestSellers(3); 
  console.log(bestSellers)
  const t =await getTranslations('home.bestSeller'); 
  return (
    <section>
      <div className='container'>
        <div className='text-center mb-4'>
          <MainHeading
            subTitle={t("checkOut")}
            title={t("OurBestSellers")}
          />
        </div>
        <Menu items={bestSellers} />
      </div>
    </section>
  );
}

export default BestSellers;