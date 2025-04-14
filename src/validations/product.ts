import { z } from "zod";


export const imageValidation = (
    t: (key: string) => string,
    isRequired: boolean
) =>
    z.custom<File | string | undefined>(
    (val) => {
        if (!isRequired) return true;
        return (
        val instanceof File &&
        ["image/jpeg", "image/png", "image/gif"].includes(val.type)
        );
    },
    {
        message: t("image.validation.required"),
    }
);


export const getCommonValidations = (t: (key: string) => string) =>
    z.object({
    name: z.string().trim().min(1, {
        message: t("name.validation.required"),
    }),
    description: z.string().trim().min(1, {
        message: t("description.validation.required"),
    }),
    basePrice: z.string().min(1, {
        message: t("basePrice.validation.required"),
    }),
    categoryId: z.string().min(1, {
        message: t("category.validation.required"), 
    }),
});


export const addProductSchema = (t: (key: string) => string) =>
    getCommonValidations(t).merge(
    z.object({
        image: imageValidation(t, true),
    })
);


export const updateProductSchema = (t: (key: string) => string) =>
    getCommonValidations(t).merge(
    z.object({
        image: imageValidation(t, false),
    })
);
