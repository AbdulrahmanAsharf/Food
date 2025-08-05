import { getProduct, getProducts } from "@/server/db/products";
import { redirect } from "next/navigation";
import { Menuform } from "../../_components/Form";
import { getCategories } from "@/server/db/categories";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ productId: product.id }));
}

type Props = {
  params: {
    productId: string;
  };
};


export default async function EditProductPage({ params }: Props) {
  const { productId } = params;
  const product = await getProduct(productId);
  const categories = await getCategories();

  if (!product) {
    redirect(`/admin/menu-items`);
  }

  return (
    <main>
      <section>
        <div className="container">
          <Menuform categories={categories} product={product} />
        </div>
      </section>
    </main>
  );
}
