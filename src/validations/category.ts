import { z } from "zod";


export const addCategorySchema = (t: (key: string) => string) =>{
  return z.object({
    name: z.string().trim().min(2, {
      message: t("validation.required"),
    }),
  });
}

export const  updateCategorySchema=(t: (key: string) => string) =>{
  return z.object({
    categoryName:z.string().trim().min(2,{
      message: t("validation.required"),
    })
  })
}