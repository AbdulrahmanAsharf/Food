import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getProductsByCategory = cache(
  async () => {
    const products = await db.category.findMany({
      include: {
        products: {
          include: {
            sizes: true,
            extras: true,
          },
        },
      },
    });
    return products;
  },
  ["products-by-category"],
  { revalidate: 3600 }
);
export const getBestSellers = cache(
  async (limit?: number) => {
    const bestSellers = await db.product.findMany({
      where: {
        orders: {
          some: {},
        },
      },
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      include: {
        sizes: true,
        extras: true,
      },
      take: limit,
    });
    return bestSellers;
  },
  ["best-sellers"],
  { revalidate: 3600 }
);

export const getProducts = cache(
  async () => {
    const products = await db.product.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return products;
  },
  ["products"],
  { revalidate: 3600 }
);


export const getProduct = (id: string) =>
  cache(
    async () => {
      const product = await db.product.findUnique({
        where: {
          id,
        },
        include: {
          sizes: true,
          extras: true,
        },
      });
      return product;
    },
    [`product-${id}`],
    { revalidate: 3600 }
  )();
