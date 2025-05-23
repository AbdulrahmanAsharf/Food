
import { getTranslations } from 'next-intl/server';
import MenuItem from './MenuItem';
import { ProductWithRelations } from '@/type/product';


async function Menu({ items }: { items:ProductWithRelations[] }) {
  const t = await getTranslations("");
  return items.length > 0 ? (
    <ul className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </ul>
  ) : (
    <p className='text-accent text-center'>{t("noProductsFound")}</p>
  );
}

export default Menu;
