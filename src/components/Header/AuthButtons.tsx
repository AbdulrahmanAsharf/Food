"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Routes, Pages } from "@/constants/enums"; 

function AuthButtons() {
  const t = useTranslations("navbar");
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
    const { locale } = useParams();
  return (
    <div>
      {session?.user && (
        <div className="flex items-center gap-10">
          <Button
            className="!px-8 !rounded-full"
            size="lg"
            onClick={() => signOut()}
          >
            {t("signOut")}
          </Button>
        </div>
      )}

      {!session?.user && (
        <div className="flex items-center gap-6">
          <Button
            className={`${
              pathname.startsWith(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`)
                ? "text-primary"
                : "text-accent"
            } hover:text-primary duration-200 transition-colors font-semibold hover:no-underline !px-0`}
            size="lg"
            variant="link"
            onClick={() => router.push(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`)} // ✅ تأكد من وجود `/` في البداية
          >
            {t("login")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default AuthButtons;
