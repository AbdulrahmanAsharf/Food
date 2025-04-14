"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {useTranslations} from 'next-intl';
import { z } from "zod"
import { signSchema } from "@/validations/auth"
import { signup} from "@/server/_actions/auth"
import { toast } from "sonner"
import { useState } from "react"; 
import { useRouter } from "next/navigation"
import Loader from "@/components/ui/loader"
import { Pages, Routes } from "@/constants/enums"



function SignupFrom() {
    const router = useRouter();
   const tValidation = useTranslations("validation"); // ✅ ترجمة الفاليديشن
   const tAuth = useTranslations("auth.register"); // ✅ ترجمة النصوص الأخرى
    const formSchema = signSchema(tValidation); // ✅ استخدم `tValidation` هنا فقط
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            email: "",
            password:"",
            confirmPassword: "",
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await signup({ ...values}); 
            if (response.status === 201) {
            toast.success(response.message);
            router.replace(`/${Routes.AUTH}/${Pages.LOGIN}`);
        } else {
            toast.warning(response.message);
            }
        }catch (error) {
            console.error("🔴 خطأ في التسجيل:", error);
            toast.error("حدث خطأ غير متوقع");
        }
        finally {
            setIsLoading(false);
        }
    }
return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
            <FormItem>
            <FormLabel>{tAuth("name.label")}</FormLabel>
            <FormControl>
                <Input type="text"  placeholder={tAuth("name.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
            <FormItem>
            <FormLabel>{tAuth("email.label")}</FormLabel>
            <FormControl>
                <Input type="email"  placeholder={tAuth("email.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
            <FormItem>
            <FormLabel>{tAuth("password.label")}</FormLabel>
            <FormControl>
                <Input type="password" placeholder={tAuth("password.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
            <FormItem>
            <FormLabel>{tAuth("confirmPassword.label")}</FormLabel>
            <FormControl>
                <Input type="password" placeholder={tAuth("confirmPassword.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader /> : tAuth("submit")}
        </Button>
    </form>
</Form>
)
}

export default SignupFrom

