

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

  if (!product) {
    return (
      <main>
        <section className="p-6 text-center">
          <h1 className="text-2xl font-bold">❌ المنتج غير موجود</h1>
          <p className="mt-2">تأكد أن الرابط صحيح أو أن المنتج موجود في قاعدة البيانات.</p>
        </section>
      </main>
    );
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
