import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getcategories = cache(
  () => {
    const categories = db.category.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return categories;
  },
  ["categories"],
  { revalidate: 3600 }
);