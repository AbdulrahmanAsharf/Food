import Link from "next/link";
import { Product } from "@prisma/client";
import Image from "next/image";

async function MenuItems({ products }: { products: Product[] }) {
  return products && products.length > 0 ? (
    <ul className="grid grid-cols-3 gap-4 sm:max-w-[625px] mx-auto">
      {products.map((product) => (
        <li
          key={product.id}
          className="bg-gray-100 hover:bg-gray-200 duration-200 transition-colors rounded-md"
        >
          <Link
            href={`/admin/menu-items/${product.id}/edit`}
            className="element-center flex-col py-4"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
            />
            <h3 className="text-lg text-gray-600 font-semibold">{product.name}</h3>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-700 text-center">No Products Found</p>
  );
}

export default MenuItems;