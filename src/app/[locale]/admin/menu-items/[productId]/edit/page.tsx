import { Pages, Routes } from "@/constants/enums";
import { getProduct, getProducts } from "@/server/db/products";
import { redirect } from "next/navigation";
import { Newform } from "../../_components/Form";
import { getcategories } from "@/server/db/categories";



export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({ productId: product.id }));
}


interface PageProps {
  params: Promise<{ productId: string }>;
}

async function EditProductPage({ params }: PageProps) {
  const { productId } = await params;
  const product = await getProduct(productId);
  const categories = await getcategories();

  if (!product) {
    redirect(`/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
  }

  return (
    <main>
      <section>
        <div className="container">
          <Newform categories={categories} product={product} />
        </div>
      </section>
    </main>
  );
}

export default EditProductPage;
