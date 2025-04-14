import { z } from "zod";

export const loginSchema = (t: (key: string) => string) =>{
    return z.object({
    email: z.string().trim().email({message:t("validEmail")}),
    password: z.string().min(6,  { message:t("passwordMinLength")})
    .max(40,{message:t("passwordMaxLength")}) ,
});
}

export const signSchema = (t : (key: string) => string) =>{
    return z.object({
        name: z.string().trim().min(1, { message: t("nameRequired" )}),
        email: z.string().trim().email({message: t("validEmail")}),
        password: z.string().min(6, t("passwordMinLength"))
        .max(40,{message: t("passwordMinLength")}),
        confirmPassword:z.string().min(6, { message: t("confirmPasswordRequired")}),
    }).refine((data) => data.password === data.confirmPassword , {
        message: t("passwordMismatch"),
        path: ["confirmPassword"],
    })
}