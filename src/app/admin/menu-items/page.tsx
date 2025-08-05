
import { getProducts } from "@/server/db/products";

import MenuItems from "./_components/MenuItems";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";

export default async function MenuItemsPage() {

  const products = await getProducts();

  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <Link
            href="/admin/menu-items/new"
            className={`${buttonVariants({ variant: "outline" })} mx-auto flex w-80 h-10 mb-8`}
          >
            إنشاء عنصر جديد
            <ArrowRightCircle className="w-5 h-5" />
          </Link>
          <MenuItems products={products} />
        </div>
      </section>
    </main>
  );
}
