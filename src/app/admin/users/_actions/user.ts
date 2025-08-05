"use server";

import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅
import { revalidatePath } from "next/cache";

export const deleteUser = async (id: string) => {
  try {
    // 1. احضر بيانات المستخدم للحصول على userId بتاع Clerk
    const user = await db.user.findUnique({
      where: { id },
      select: { clerkId: true },
    });

    if (!user || !user.clerkId) {
      return {
        status: 404,
        message: "User not found.",
      };
    }

    // 2. احذف من Prisma
    await db.user.delete({
      where: { id },
    });

    // 3. احذف من Clerk
    await clerkClient.users.deleteUser(user.clerkId);

    // 4. تحديث الصفحة أو المسارات
    revalidatePath("/admin/users");

    return {
      status: 200,
      message: "User deleted successfully.",
    };
  } catch (error) {
    console.error("Delete user error:", error);
    return {
      status: 500,
      message: "An unexpected error occurred.",
    };
  }
};
