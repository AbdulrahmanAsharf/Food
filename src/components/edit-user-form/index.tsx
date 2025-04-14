"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { updateProfileSchema } from "@/validations/profile";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CameraIcon } from "lucide-react";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { updateProfile, getImageUrl } from "../edit-user-form/_actions/profile";
import Loader from "@/components/ui/loader";

export function EditUserForm({ user }: { user: Session["user"] }) {
  const tValidation = useTranslations("validation");
  const t = useTranslations("profile.form");
  const save = useTranslations();
  const messages = useTranslations("messages");

  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);
  const session = useSession();
  const userSession = session?.data?.user;
  const [selectedImage, setSelectedImage] = useState<File | string>(userSession?.image ?? "");
  const [previewImage, setPreviewImage] = useState<string>(userSession?.image ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = updateProfileSchema(tValidation);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      streetAddress: user.streetAddress ?? "",
      postalCode: user.postalCode ?? "",
      city: user.city ?? "",
      country: user.country ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      streetAddress: user.streetAddress ?? "",
      postalCode: user.postalCode ?? "",
      city: user.city ?? "",
      country: user.country ?? "",
    });
  
    // خليه يجيب صورة الـ user اللي انت فاتح صفحته مش من السيشن
    const userImage = user.image ?? "";
    setSelectedImage(userImage);
    setPreviewImage(userImage);
  }, [user, form]);
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      let imageUrl = typeof selectedImage === "string" ? selectedImage : user.image;
  
      if (selectedImage instanceof File) {
        imageUrl = await getImageUrl(selectedImage);
      }
  
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString());
      });
  
      if (imageUrl) formData.append("image", imageUrl);
      formData.append("isAdmin", isAdmin.toString());
  
      const result = await updateProfile(formData, isAdmin);
  
      if (result.status === 200) {
        toast.success(messages("updateProfileSucess"));
  
        if (session?.update) {
          await session.update({ user: { ...userSession, image: imageUrl } });
        }
  
        setPreviewImage(imageUrl || "");
        setSelectedImage(imageUrl || "");
  
      } else {
        toast.error(result.message || messages("updateProfileError"));
      }
    } catch (error) {
      console.error(error);
      toast.error(messages("unexpectedError"));
    }finally {
      setIsLoading(false);
    }
  }
  
  
  const userFields = [
    "name",
    "email",
    "phone",
    "streetAddress",
    "postalCode",
    "city",
    "country"
  ] as const;
  
  type UserField = typeof userFields[number];
  

  return (
    <Form {...form}>
      <div className="flex flex-col md:flex-row gap-10">
      <div className="group relative w-[200px] h-[200px] overflow-hidden rounded-full mx-auto">
      {previewImage && (
        <Image
            src={previewImage}
            alt={user.name}
            width={200}
            height={200}
            className="rounded-full object-cover"
        />
      )}
      <div className={`absolute top-0 left-0 w-full h-full bg-gray-50/40 flex items-center justify-center 
        ${previewImage ? "hidden group-hover:flex" : "flex"}`}>
        <UploadImage setSelectedImage={setSelectedImage} setPreviewImage={setPreviewImage} />
      </div>
      </div>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4">
        {userFields.map((field: UserField) => (
          <FormField
          key={field}
          control={form.control}
          name={field}
          render={({ field: formField }) => (
          <FormItem>
          <FormLabel>{t(`${field}.label`)}</FormLabel>
          <FormControl>
            <Input placeholder={t(`${field}.placeholder`)} {...formField} />
          </FormControl>
          <FormMessage />
          </FormItem>
        )}
          />
        ))}

          {session.data?.user.role === UserRole.ADMIN && (
            <div className="flex items-center gap-2 my-4">
              <Checkbox name="admin" checked={isAdmin} onClick={() => setIsAdmin(!isAdmin)} />
              <span>Admin</span>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader /> : save("save")}
          </Button>
        </form>
      </div>
    </Form>
  );
}

const UploadImage = ({
  setSelectedImage,
  setPreviewImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<File | string>>;
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <input type="file" accept="image/*" className="hidden" id="image-upload" onChange={handleImageChange} name="image" />
      <label htmlFor="image-upload" className="border rounded-full w-[200px] h-[200px] element-center cursor-pointer">
        <CameraIcon className="!w-8 !h-8 text-accent" />
      </label>
    </>
  );
};
