"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {  z } from "zod"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { getCommonValidations } from "@/validations/product"
import {useState } from "react"
import Loader from "@/components/ui/loader"
import { Link } from "@/i18n/navigation"
import { Pages, Routes } from "@/constants/enums"
import { ProductWithRelations } from "@/type/product"
import { Category, Extra, Size } from "@prisma/client"
import SelectCategory from "./SelectCategory"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ItemOptions, { ItemOptionsKeys } from "./ItemOptions"
import { addProduct, deleteProduct, updateProduct } from "../_actions/product"
import { toast } from "sonner"
import { CameraIcon } from "lucide-react"
import Image from "next/image";


export function Newform({categories,product}:{
  categories: Category[];product?: ProductWithRelations
}) {
  const [selectedImage, setSelectedImage] = useState(product ? product.image : "");
  const [extras, setExtras] = useState<Partial<Extra>[]>(product?.extras || [])
  const [sizes, setSizes] = useState<Partial<Size>[]>(product?.sizes || [])
  const [loading, setLoading] = useState(false);
  const translation = useTranslations("")
  const t = useTranslations("admin.menu-items.form")
  const formSchema = getCommonValidations(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:product?.name ??"",
      description:product?.description ?? "",
      basePrice:product?.basePrice.toString() ?? "",
      categoryId: product?.categoryId || categories[0]?.id || "",
    },
  })
 

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("basePrice", values.basePrice);
      formData.append("categoryId", values.categoryId);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("extras", JSON.stringify(extras));
      
      const inputFile = document.getElementById("image-upload") as HTMLInputElement;
      const file = inputFile?.files?.[0];
      if (file) {
        formData.append("image", file);
      }
      let res;
  
      if (product) {
        res = await updateProduct(
          {
            productId: product.id,
            options: { sizes, extras },
          },
          null,
          formData
        );
      } else {
        res = await addProduct(
          {
            categoryId: values.categoryId,
            options: { sizes, extras },
          },
          null,
          formData
        );
      }
  
      console.log("📦 Server Response:", res);
  
      if (res?.status === 201 || res?.status === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message || "حدث خطأ");
      }
    } catch (error) {
      console.error("❌ Unexpected Error:", error);
      toast.error("فشل في الإرسال");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-10 items-start">
  {/* الصورة */}
  <div className="w-full md:w-1/3 flex justify-center">
    <UploadImage
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
    />
  </div>

  {/* الفورم */}
  <div className="w-full md:w-2/3">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {["name", "description", "basePrice"].map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as "name" | "description" | "basePrice"}
            render={({ field: inputField }) => (
              <FormItem>
                <FormLabel>{t(`${field}.label`)}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(`${field}.placeholder`)}
                    {...inputField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectCategory
                  categories={categories}
                  field={field}
                  translation={translation}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AddSize translation={translation} sizes={sizes} setSizes={setSizes} />
        <AddExtras translation={translation} extras={extras} setExtras={setExtras} />
        <FormActions loading={loading} product={product} translation={translation} />
      </form>
    </Form>
  </div>
</div>

  )
}






const UploadImage = ({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };
  return (
    <div className="group mt-6 mx-auto md:mx-0 relative w-[200px] h-[200px] overflow-hidden rounded-full">
      {selectedImage && (
        <Image
          src={selectedImage}
          alt="Add Product Image"
          width={200}
          height={200}
          className="rounded-full object-cover"
        />
      )}
      <div
        className={`${
          selectedImage
            ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
            : ""
        } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleImageChange}
          name="image"
        />
        <label
          htmlFor="image-upload"
          className="border rounded-full w-[200px] h-[200px] element-center cursor-pointer"
        >
          <CameraIcon className="!w-8 !h-8 text-accent" />
        </label>
      </div>
    </div>
  );
};






const FormActions = ({
  loading,
  translation,
  product,
}: {
  loading: boolean;
  translation: (key: string) => string;
  product?: ProductWithRelations;
}) => {
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteProduct(id);

      if (res.status === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <div
        className={`${product ? "grid grid-cols-2" : "flex flex-col"} gap-4`}
      >
        {/* زر الحفظ أو الإنشاء */}
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : product ? translation("save") : translation("create")}
        </Button>

        {product && (
        <Button
          variant="outline"
          onClick={() => handleDelete(product.id)}
        >
          {translation("delete")}
        </Button>
      )}
      </div>
      
      <Link
        href={`/${Routes.ADMIN}/${Pages.MENU_ITEMS}`}
        className={`w-full mt-4 ${buttonVariants({ variant: "outline" })}`}
      >
        {translation("cancel")}
      </Link>
    </>
  );
};


const AddSize =({translation,sizes,setSizes}:{
  translation:(key: string) => string;
  sizes: Partial<Size>[];
  setSizes:React.Dispatch<React.SetStateAction<Partial<Size>[]>>
})=> {
  return (
    <Accordion 
      type="single" 
      collapsible 
      className="bg-gray-100 rounded-md px-4 w-80 mb-4">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">
        {translation("sizes")}
        </AccordionTrigger>
        <AccordionContent>
          <ItemOptions
            translation={translation} 
            state={sizes} 
            setState={setSizes}
            optionKey={ItemOptionsKeys.SIZES}
          />
        </AccordionContent>
      </AccordionItem>
      
    </Accordion>
  )
}


const AddExtras = ({
  extras,
  setExtras,
  translation,
}: {
  extras: Partial<Extra>[];
  setExtras: React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
  translation: (key: string) => string;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-gray-100 rounded-md px-4 w-80 mb-4 "
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">
          {translation("extrasIngredients")}
        </AccordionTrigger>
        <AccordionContent>
          <ItemOptions
            state={extras}
            optionKey={ItemOptionsKeys.EXTRAS}
            setState={setExtras}
            translation={translation}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

