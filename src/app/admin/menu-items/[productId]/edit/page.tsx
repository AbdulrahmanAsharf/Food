import { getProduct, getProducts } from "@/server/db/products";
import { redirect } from "next/navigation";
import { Menuform } from "../../_components/Form";
import { getCategories } from "@/server/db/categories";

export async function generateStaticParams(): Promise<{ productId: string }[]> {
  const products = await getProducts();
  return products.map((product) => ({
    productId: product.id,
  }));
}

type EditProductPageProps = {
  params: {
    productId: string;
  };
};

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { productId } = params;
  const product = await getProduct(productId);
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
};

export default EditProductPage;
