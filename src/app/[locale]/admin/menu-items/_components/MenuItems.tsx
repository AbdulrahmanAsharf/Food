
import { Pages, Routes } from "@/constants/enums";
import { Link } from "@/i18n/navigation";
import { Product } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

async function MenuItems({ products }: { products: Product[] }) {
    const t =  await getTranslations('')
    return products && products.length > 0 ? (
        <ul className="grid grid-cols-3 gap-4 sm:max-w-[625px] mx-auto">
          {products.map((product) => (
            <li
              key={product.id}
              className="bg-gray-100 hover:bg-gray-200 duration-200 transition-colors rounded-md"
            >
              <Link
                href={`/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${product.id}/${Pages.EDIT}`}
                className="element-center flex-col py-4"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={100}
                />
                <h3 className="text-lg text-accent font-medium">{product.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-accent text-center">{t("noProductsFound")}</p>
      );
}

export default MenuItems;

