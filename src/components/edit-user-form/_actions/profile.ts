"use server";

import { db } from "@/lib/prisma";
import { updateProfileSchema } from "@/validations/profile";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { Pages, Routes } from "@/constants/enums";
import { getTranslations } from "next-intl/server";

export const updateProfile = async (formData: FormData, isAdmin: boolean) => {
  const rawData = Object.fromEntries(formData.entries());

  if (rawData.image === "null") {
    delete rawData.image;
  }

  const t = await getTranslations("messages");
  const schema = updateProfileSchema(t);
  const result = schema.safeParse(rawData);

  if (!result.success) {
    return {
      error: result.error.formErrors.fieldErrors,
      formData,
    };
  }

  const data = result.data;

  const user = await db.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    return {
      message: t("userNotFound"),
      status: 401,
      formData,
    };
  }

  let imageUrl = user.image || "";

  const imageFile = formData.get("image");

  if (imageFile instanceof File) {
    imageUrl = await getImageUrl(imageFile); 
  } else if (typeof imageFile === "string" && imageFile.startsWith("http")) {
    imageUrl = imageFile; 
  }

  try {
    await db.user.update({
      where: { email: user.email },
      data: {
        ...data,
        image: imageUrl, // ✅ تأكد من تمرير الصورة النهائية
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      },
    });

    // ✅ تحديث البيانات على الصفحة
    revalidatePath(`/${Routes.PROFILE}`);
    revalidatePath(`/${Routes.ADMIN}`);
    revalidatePath(`/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(`/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`);

    return {
      status: 200,
      message: t("updateProfileSucess"),
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: t("unexpectedError"),
    };
  }
};



export const getImageUrl = async (imageFile: File) => {
  if (!imageFile) {
    console.warn("⚠️ لم يتم تحديد صورة جديدة، سيتم الاحتفاظ بالصورة القديمة.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "profile_images");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("❌ فشل رفع الصورة إلى Cloudinary. HTTP Status:", response.status);
      return null;
    }

    const image = await response.json();
    
    if (!image.url) {
      console.error("❌ Cloudinary لم يرجع رابط الصورة الجديد!");
      return null;
    }

    return image.url;
  } catch (error) {
    console.error("❌ خطأ أثناء رفع الصورة إلى Cloudinary:", error);
    return null;
  }
};

  


