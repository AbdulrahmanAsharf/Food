"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { useState } from "react"
import Loader from "@/components/ui/loader";
import { useTranslations } from "next-intl";
import { addCategorySchema } from "@/validations/category"
import { addCategory } from "../_actions/category"
import { toast } from "sonner";

function Categortyform() {
  const [isLoading, setIsLoading] = useState(false);
  const messages = useTranslations("messages"); 
  const categories = useTranslations("admin.categories.form.name");
  const formSchema = addCategorySchema(categories);
  const t = useTranslations("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const formData = new FormData();
        formData.append("name", values.name);

        const result = await addCategory(formData);

        if (result.status === 201) {
            form.reset();
            toast.success(messages("categoryAdded"));
        } else {
            console.error(result.error);
            toast.error(messages("unexpectedError"));
        }
    } catch (error) {
        console.error(error);
        toast.error(messages("unexpectedError"));
    } finally {
        setIsLoading(false);
    }
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{categories("label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={categories("placeholder")}
                  {...field}
                  className="flex items-center gap-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader /> : t("save")} {/* ✅ استخدام `t("save")` بدلاً من `create("save")` */}
        </Button>
      </form>
    </Form>
  );
}

export default Categortyform;
