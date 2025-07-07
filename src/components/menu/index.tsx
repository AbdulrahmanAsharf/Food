import { ProductWithRelations } from '@/types/product';
import MenuItem from './MenuItem';


async function Menu({ items }: { items: ProductWithRelations[]}) {
  return items.length > 0 ? (
    <ul className='grid grid-cols-1 sm:grid-cols-3 gap-4 py-9'>
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </ul>
  ) : (
    <p className='text-gray-600 text-center'>No Products Found</p>
  );
}

export default Menu;