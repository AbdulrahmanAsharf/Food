"use server"

import { Pages, Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { addProductSchema, updateProductSchema } from "@/validations/product";
import { Extra, ExtraIngredients, ProductSizes, Size } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";


const getImageUrl = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "product_images");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const image = (await response.json()) as { url: string };
    return image.url;
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    return undefined;
  }
};


export const addProduct = async (
  args: {
    categoryId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  _prevState: unknown,
  formData: FormData
) => {
  const messages = await getTranslations("messages");
  const validation = await getTranslations("admin.menu-items.form");

  const result = addProductSchema(validation).safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
    };
  }

  const data = result.data;
  const basePrice = Number(data.basePrice);
  const imageFile = formData.get("image") as File;

  const imageUrl = imageFile?.size ? await getImageUrl(imageFile) : undefined;
  if (!imageUrl) {
    throw new Error('Image URL is required');
  }
  try {
    const createdProduct = await db.product.create({
      data: {
        ...data,
        basePrice,
        image: imageUrl,
        categoryId: args.categoryId,
        sizes: {
          createMany: {
            data: args.options.sizes.map((size) => ({
              name: size.name as ProductSizes,
              price: Number(size.price),
            })),
          },
        },
        extras: {
          createMany: {
            data: args.options.extras.map((extra) => ({
              name: extra.name as ExtraIngredients,
              price: Number(extra.price),
            })),
          },
        },
      },
    });

    revalidatePath(`/${Routes.MENU}`);
    revalidatePath(`/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);

    return {
      status: 201,
      message: messages("productAdded"),
      product: createdProduct,
    };
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return {
      status: 500,
      message: messages("unexpectedError"),
    };
  }
};

export const updateProduct = async (
  args: {
    productId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  _prevState: unknown,
  formData: FormData
) => {
  const messages = await getTranslations("messages");
  const validation = await getTranslations("admin.menu-items.form");

  const result = updateProductSchema(validation).safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
    };
  }

  const data = result.data;
  const basePrice = Number(data.basePrice);
  const imageFile = formData.get("image") as File;

  const imageUrl = imageFile?.size ? await getImageUrl(imageFile) : undefined;

  const product = await db.product.findUnique({
    where: { id: args.productId },
  });

  if (!product) {
    return {
      status: 404,
      message: messages("unexpectedError"),
    };
  }

  try {
    const updatedProduct = await db.product.update({
      where: { id: args.productId },
      data: {
        ...data,
        basePrice,
        image: imageUrl ?? product.image,
      },
    });

    await db.size.deleteMany({ where: { productId: args.productId } });
    await db.size.createMany({
      data: args.options.sizes.map((size) => ({
        productId: args.productId,
        name: size.name as ProductSizes,
        price: Number(size.price),
      })),
    });

    await db.extra.deleteMany({ where: { productId: args.productId } });
    await db.extra.createMany({
      data: args.options.extras.map((extra) => ({
        productId: args.productId,
        name: extra.name as ExtraIngredients,
        price: Number(extra.price),
      })),
    });

    revalidatePath(`/${Routes.MENU}`);
    revalidatePath(`/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(`/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${product.id}/${Pages.EDIT}`);

    return {
      status: 200,
      message: messages("updateProductSucess"),
      product: updatedProduct,
    };
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return {
      status: 500,
      message: messages("unexpectedError"),
    };
  }
};


export const deleteProduct = async (productId: string) => {
  const messages = await getTranslations("messages");

  try {
    await db.size.deleteMany({ where: { productId } });
    await db.extra.deleteMany({ where: { productId } });
    await db.product.delete({ where: { id: productId } });

    revalidatePath(`/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    return {
      status: 200,
      message: messages("deleteProductSucess"),
    };
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return {
      status: 500,
      message: messages("unexpectedError"),
    };
  }
};
