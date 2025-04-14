import { getcategories } from "@/server/db/categories";
import { Newform } from "../_components/Form"



async function page() {
  const categories = await getcategories();
  return (
    <main>
      <section className='section-gap'>
        <div className="container">
          <Newform categories={categories} />
        </div>
      </section>
    </main>
  )
}

export default page