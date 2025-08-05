// /api/update-profile/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, city, country, image, role , streetAddress, postalCode} = body;

    // 🟡 نجيب بيانات المستخدم الحالي من الداتا بيز
    const currentUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isAdmin = currentUser.role === "ADMIN";

    const updatedUser = await db.user.update({
      where: { clerkId: userId },
      data: {
        name,
        phone,
        city,
        country,
        image,
        streetAddress,
        postalCode,
        // ✅ فقط الأدمن يقدر يغير role
        ...(isAdmin && role ? { role } : {}),
      },
    });

    return NextResponse.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Failed to update profile", error);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}