/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { loginSchema } from "@/validations/auth"
import { z } from "zod"
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react"
import Loader from "@/components/ui/loader"
import { Routes } from "@/constants/enums"


export function SigninForm() {
  const tValidation = useTranslations("validation"); 
 const tAuth = useTranslations("auth.login"); 
  const tMessages = useTranslations("messages")

  const router = useRouter();
  const { locale } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const formSchema = loginSchema(tValidation); // ✅ استخدم `tValidation` هنا فقط
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, 
      });
      if (res?.error) {
        const validationError = JSON.parse(res?.error).validationError;
        setError(validationError);
        const responseError = JSON.parse(res?.error).responseError;
        if (responseError) {
          toast.error(responseError);
          
        }
      }
      if (res?.ok) {
        toast.success(tMessages('loginSuccessful'));
        router.replace(`/${Routes.PROFILE}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader />  : tAuth("submit")}
        </Button>
      </form>
    </Form>
  )
}
