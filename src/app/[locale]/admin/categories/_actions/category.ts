"use server"

import { Pages, Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { addCategorySchema, updateCategorySchema } from "@/validations/category"
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";




export const addCategory = async (formData: FormData) => {
    const t = await getTranslations("messages");
    const result = addCategorySchema(t).safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) {
        return { error: result.error.formErrors.fieldErrors, status: 400 };
    }

    const data = result.data;
    try {
        await db.category.create({ data });
        revalidatePath(`/${Routes.ADMIN}/${Pages.CATEGORIES}`);
        revalidatePath(`/${Routes.MENU}`);
        
        
        return { status: 201, message: t("categoryAdded") };
    } catch (error) {
        console.error(error);
        return { error: t("unexpectedError"), status: 500 };
    }
};


export const updateCategory = async(id:string,formData:FormData)=>{
    const t = await getTranslations("messages");
    const result = updateCategorySchema(t).safeParse(Object.fromEntries(formData.entries()))
    if (!result.success) {
        return { error: result.error.formErrors.fieldErrors, status: 400 };
    }
    const data = result.data
    try {
        await db.category.update({
            where: { 
                id, 
            },
            data:{
                name:data.categoryName
            }
        })
        revalidatePath(`/${Routes.ADMIN}/${Pages.CATEGORIES}`);
        revalidatePath(`/${Routes.MENU}`);
        return { status: 201, message: t("updateProductSucess") };
    } catch (error) {
        console.error(error);
        return { error: t("unexpectedError"), status: 500 };
    }
}


export const deletecategory = async (id: string) => {
    let t = (key: string) => key; 
    
    try {
        t = await getTranslations("messages");

        await db.category.delete({ where: { id } });

        revalidatePath(`/${Routes.ADMIN}/${Pages.CATEGORIES}`);
        revalidatePath(`/${Routes.MENU}`);

        return { status: 201, message: t("deleteCategorySucess") };
    } catch (error) {
        console.error(error);
        return { error:  t("unexpectedError") , status: 500 };
    }
};

