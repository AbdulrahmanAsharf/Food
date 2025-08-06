//app/admin/menu-items/[productId]/edit/page_.tsx

import { getProduct, getProducts } from "@/server/db/products";
import { redirect } from "next/navigation";
import { Menuform } from "../../_components/Form";
import { getCategories } from "@/server/db/categories";

export async function generateStaticParams(): Promise<{ productId: string }[]> {
  const products = await getProducts();
  return products.map((product) => ({
    productId: String(product.id),
  }));
}

type PageProps = {
  params: {
    productId: string;
  };
};

export default async function EditProductPage({ params }: PageProps) {
  const product = await getProduct(params.productId);
  const categories = await getCategories();

  if (!product) {
    redirect("/admin/menu-items");
  }

  return (
    <main>
      <section>
        <div className="container">
          <Menuform product={product} categories={categories} />
        </div>
      </section>
    </main>
  );
}
