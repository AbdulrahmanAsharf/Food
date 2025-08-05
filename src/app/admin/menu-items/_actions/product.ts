//menu-items/actios/product.ts
'use server'

import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { productSchema } from "@/validations/products";




export async function createProduct(data: unknown) {
  console.log("🛠️ Received data:", data);
  const validated = productSchema.parse(data);

  const product = await db.product.create({
    data: {
      image: validated.image,
      name: validated.name,
      description: validated.description,
      basePrice: validated.basePrice,
      categoryId: validated.categoryId,
      sizes: {
        createMany: {
          data: validated.sizes || [],
        },
      },
      extras: {
        createMany: {
          data: validated.extras || [],
        },
      },
    },
  })

  revalidatePath('/admin/menu-items')
  return product
}

export async function updateProduct(productId: string, data: unknown) {
  const validated = productSchema.parse(data)

  const product = await db.product.update({
    where: { id: productId },
    data: {
      image: validated.image,
      name: validated.name,
      description: validated.description,
      basePrice: validated.basePrice,
      categoryId: validated.categoryId,
      ...(validated.sizes && validated.sizes.length > 0 && {
        sizes: {
          deleteMany: {},
          createMany: { data: validated.sizes },
        },
      }),

      ...(validated.extras && validated.extras.length > 0 && {
        extras: {
          deleteMany: {},
          createMany: { data: validated.extras },
        },
      }),
    },
  })

  revalidatePath('/admin/menu-items')
  return product
}

export async function deleteProduct(productId: string) {
  await db.product.delete({ where: { id: productId } })
  revalidatePath('/admin/menu-items')
}
