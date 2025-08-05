
'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Category, Extra,  ExtraIngredients,  ProductSizes,  Size } from "@prisma/client"
import { ProductWithRelations } from "@/types/product"
import {  ProductFormValues, productSchema } from "@/validations/products"
import ItemOptions, { ItemOptionsKeys } from "./ItemOptions"
import { createProduct, updateProduct, deleteProduct } from "../_actions/product"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UploadImage } from "@/components/upload-image"



export function Menuform({product,categories,}:{categories:Category[];product?: ProductWithRelations}) 
  {
  const router = useRouter()
  const form = useForm<ProductFormValues>({
  resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      basePrice: product?.basePrice ?? 0, // ✅ خليه number مباشرةً
      categoryId: product?.categoryId || "",
      sizes: product?.sizes || [],
      extras: product?.extras || [],
      image: product?.image || "", // ✅ هنا
    }
  })

  const [sizes, setSizes] = useState<Partial<Size>[]>(product?.sizes || [])
  const [extras, setExtras] = useState<Partial<Extra>[]>(product?.extras || [])
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);




async function onSubmit(values: ProductFormValues) {
  setLoading(true);
  try {
    const cleanedSizes = sizes
      .filter((size) => size.name && size.price !== undefined)
      .map((size) => ({
        name: size.name as ProductSizes,
        price: size.price as number,
      }));

    const cleanedExtras = extras
      .filter((extra) => extra.name && extra.price !== undefined)
      .map((extra) => ({
        name: extra.name as ExtraIngredients,
        price: extra.price as number,
      }));

    const finalValues: ProductFormValues = {
      ...values,
      image: values.image,
      sizes: cleanedSizes,
      extras: cleanedExtras,
    };
    if (selectedFile) {
      const formData = new FormData();
        formData.append("file", selectedFile);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
            finalValues.image = data.url; // استخدم هذا الرابط
    }

    if (product) {
      await updateProduct(product.id, finalValues);
      toast.success("تم التعديل بنجاح");
      } else {
      await createProduct(finalValues);
      toast.success("تم الإنشاء بنجاح");
    }
    router.push("/admin/menu-items");
    router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false); // ✅ ضروري
    }

}




  const onDelete = async () => {
    if (!product) return
    try {
      await deleteProduct(product.id)
      toast.success("تم الحذف")
      router.push("/admin/menu-items")
    } catch {
      toast.error("فشل الحذف")
    }
  }
  return (
    <main className="max-w-2xl mx-auto my-10 p-6 border rounded-lg shadow bg-white space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
              <FormLabel>صورة المنتج</FormLabel>
                <UploadImage
                  previewUrl={
                    selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : field.value || ""
                  }
                  onFileSelect={(file) => {
                    setSelectedFile(file)
                    const fakeUrl = URL.createObjectURL(file)
                    form.setValue("image", fakeUrl) // دي مؤقتة بس تخلي Zod يسكت
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* الاسم */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المنتج</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: بيتزا مارجريتا" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* الوصف */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوصف</FormLabel>
                <FormControl>
                  <Textarea placeholder="اكتب وصفاً للمنتج" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* السعر */}
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السعر الأساسي</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="مثال: 50" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* الفئة */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الفئة</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded px-3 py-2 bg-white"
                  >
                    <option value="">اختر فئة</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Accordion للأحجام والإضافات */}
          <Accordion
            type="multiple"
            className="bg-gray-100 rounded-md  px-4  w-full"
          >
            {/* SIZES */}
            <AccordionItem value="sizes" className="border-none ">
              <AccordionTrigger className="text-black font-medium">
                الأحجام (Sizes)
              </AccordionTrigger>
              <AccordionContent>
                <ItemOptions
                  state={sizes}
                  setState={setSizes}
                  optionKey={ItemOptionsKeys.SIZES}
                />
              </AccordionContent>
            </AccordionItem>

            {/* EXTRAS */}
            <AccordionItem value="extras" className="border-none">
              <AccordionTrigger className="text-black font-medium">
                الإضافات (Extras)
              </AccordionTrigger>
              <AccordionContent>
                <ItemOptions
                  state={extras}
                  setState={setExtras}
                  optionKey={ItemOptionsKeys.EXTRAS}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="space-y-3">
           <Button type="submit" disabled={loading} className="w-full">
  {loading ? "جارٍ الحفظ..." : product ? "تعديل المنتج" : "حفظ المنتج"}
</Button>

            {product ? (
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={onDelete}
            >
              🗑️ حذف المنتج
            </Button>
            ) : (
<Button
  type="button"
  variant="outline"
  className="w-full"
  onClick={() => router.push("/menu-items")}
>
  Cancel
</Button>
        )}
        </div>
        </form>
      </Form>
    </main>
  )
}




/*<FormField
            control={form.control}
            name="image"
            render={({ field }) => (
            <FormItem>
              <FormLabel>صورة المنتج</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {(selectedFile || field.value) && (
                    <div className="relative group w-full max-h-64">
                      <Image
                        src={selectedFile ? URL.createObjectURL(selectedFile) : field.value}
                        alt="صورة المنتج"
                        width={300}
                        height={100}
                        className="w-full h-auto max-h-64 object-contain rounded"
                      />
                    <div className="absolute inset-0 text-gray-900 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded cursor-pointer">
                    <span className="text-white text-sm font-medium">اضغط لتغيير الصورة</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                 onChange={(e) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedFile(file);
  }
}}

                />
              </div>
            </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
     // ✅ تنظيف الأحجام والإضافات قبل الإرسال
    const cleanedSizes = sizes
      .filter((size) => size.name && size.price !== undefined)
      .map((size) => ({
        name: size.name as ProductSizes,
        price: size.price as number,
      }));

    const cleanedExtras = extras
      .filter((extra) => extra.name && extra.price !== undefined)
      .map((extra) => ({
        name: extra.name as ExtraIngredients,
        price: extra.price as number,
      }));

    
    
    
    
    
    
    
    */