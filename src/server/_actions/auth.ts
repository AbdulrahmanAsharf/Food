/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { Pages, Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { loginSchema , signSchema} from "@/validations/auth"
import bcrypt from "bcrypt";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

export const login = async (
    credentials: Record<"email" | "password", string>) =>{

        const t = await getTranslations("messages");
        const schema = loginSchema(t); 
        const result = schema.safeParse(credentials)
    
    if (result.success === false) {
        return {
            status: 400,
            error: result.error.formErrors.fieldErrors,
            
        };
    }
    try {
        const user = await db.user.findUnique({
            where: {
                email: result.data.email,
            },
        });
        if (!user) {
            return { status: 401 , message: t('userNotFound')   };
            
        }
        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(
            result.data.password,
            hashedPassword
        );
        if (!isValidPassword) {
            return {
                status: 401,
                message: t('incorrectPassword'),
            };
        }
        const { password, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                status: 200,
                message: t('loginSuccessful'),
            };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message:t('unexpectedError'),
        }
    }
        
}



export const signup = async (credentials: Record<"name" | "email" | "password" | "confirmPassword" , string>) => {
    const t = await getTranslations("messages");
    
    try {
        
        const schema = signSchema(t);
        const result = schema.safeParse(credentials);

        if (!result.success) {
            return {
                error: result.error.formErrors.fieldErrors,
                status: 400,
            };
        }

        const existingUser = await db.user.findUnique({
            where: { email: result.data.email },
        });

        if (existingUser) {
            return {
                message: t("userAlreadyExists"),
                status: 409,
            };
        }

        const hashedPassword = await bcrypt.hash(result.data.password, 10);

        const createdUser = await db.user.create({
            data: {
                name: result.data.name,
                email: result.data.email,
                password: hashedPassword,
            },
        });
        revalidatePath(`/${Routes.ADMIN}/${Pages.USERS}`);
        revalidatePath(
        `/${Routes.ADMIN}/${Pages.USERS}/${createdUser.id}/${Pages.EDIT}`);
        return {
            status: 201,
            message: t("accountCreated"),
            user: {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
            },
        };
    }  catch (error) {
        console.error(error);
        return {
            status: 500,
            message: t("unexpectedError"),
        };
    }
};
