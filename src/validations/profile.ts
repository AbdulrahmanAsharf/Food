import { z } from "zod";


export const updateProfileSchema = (t: (key: string) => string) =>{
    return z.object({
        name: z
            .string()
            .trim()
            .min(1, { message: t("nameRequired")}),
        email: z.string().trim().email({message: t("validEmail"),}),
        phone: z
            .string()
            .trim()
            .optional()
            .refine(
            (value) => {
                if (!value) return true;
                return /^\+?[1-9]\d{1,14}$/.test(value);
                },
            {
                message: t('phoneinvalid'),
            }
            ),
        streetAddress: z.string().optional(),
        postalCode: z
            .string()
            .optional()
            .refine(
            (value) => {
                if (!value) return true;
                return /^\d{5,10}$/.test(value);
            },
            {
                message: t('postalCodeinvalid'),
            }
            ),
        city: z.string().optional(),
        country: z.string().optional(),
        image: z.string().url().nullable().optional(),


    });
}