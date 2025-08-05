
import { getCategories } from "@/server/db/categories";
import { Menuform } from "../_components/Form";

async function NewProductPage() {

  const categories = await getCategories();


  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <Menuform  categories={categories} />
        </div>
      </section>
    </main>
  );
}

export default NewProductPage;