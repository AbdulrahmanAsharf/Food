"use server"

import { Pages, Routes } from "@/constants/enums";
import { db } from "@/lib/prisma"
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";


export const deleteUser = async (id:string)=>{
    const messages = await getTranslations("messages");
    try {
        await db.user.delete({
            where: {id}
        })
        revalidatePath(`/${Routes.ADMIN}/${Pages.USERS}`);
        revalidatePath(
            `/${Routes.ADMIN}/${Pages.USERS}/${id}/${Pages.EDIT}`
        );
        return { 
            status: 200,
            message: messages("deleteUserSucess"),
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: messages("unexpectedError")
        }
    }
}