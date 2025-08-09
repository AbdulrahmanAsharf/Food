

import { getProduct, getProducts } from "@/server/db/products";

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


  return (
  <main>
    <section>
      <div className="container">
        <Menuform
          product={product ?? undefined}
          categories={categories}
        />
      </div>
    </section>
  </main>
);

}
