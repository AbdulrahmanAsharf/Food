import * as z from "zod";

export const addCategorySchema = z.object({
  name: z.string().trim().min(1, {
    message: "اسم القسم مطلوب",
  }),
});

export const updateCategorySchema = z.object({
  categoryName: z.string().trim().min(1, {
    message: "اسم القسم مطلوب",
  }),
});
