"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Menu, XIcon } from "lucide-react";
import { Routes } from "@/constants/enums";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import AuthButtons from "./AuthButtons";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { UserRole } from "@prisma/client";


function Navbar() {
  const { data: session } = useSession();
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const { locale } = useParams();
  const links = [
    {
      id:crypto.randomUUID(), 
      title: t("menu"),
      href: Routes.MENU,
    },
    {
      id: crypto.randomUUID(),
      title: t("about"),
      href: Routes.ABOUT,
    },
    {
      id: crypto.randomUUID(),
      title: t("contact"),
      href: Routes.CONTACT,
    },
  ];

  const isAdmin = session?.user?.role === UserRole.ADMIN;

  return (
    <nav>

      <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setOpenMenu(true)}>
        <Menu className="!w-6 !h-6" />
      </Button>

      <ul
        className={`fixed lg:static ${
          openMenu ? "left-0 z-50" : "-left-full"
        } top-0 px-10 py-20 lg:p-0 bg-background lg:bg-transparent transition-all duration-200 h-full lg:h-auto flex-col lg:flex-row w-full lg:w-auto flex items-start lg:items-center gap-10`}
      >
        <Button variant="secondary" size="sm" className="absolute top-10 right-10 lg:hidden" onClick={() => setOpenMenu(false)}>
          <XIcon className="!w-6 !h-6" />
        </Button>

        {links.map((link) => (
          <li key={link.id}>
            <Link
              onClick={() => setOpenMenu(false)}
              href={`/${link.href}`}
              className={`hover:text-primary duration-200 transition-colors font-semibold ${
                pathname.startsWith(`/${locale}/${link.href}`) ? "text-primary" : "text-accent"
              }`}
            >
              {link.title}
            </Link>
          </li>
        ))}
      
        {session?.user && (
          <li>
            <Link
              href={
                isAdmin
                  ? `/${Routes.ADMIN}`
                  : `/${Routes.PROFILE}`
              }
              onClick={() => setOpenMenu(false)}
              className={`${
                pathname.startsWith(
                  isAdmin
                    ? `/${Routes.ADMIN}`
                    : `/${Routes.PROFILE}`
                )
                  ? "text-primary"
                  : "text-accent"
              } hover:text-primary duration-200 transition-colors font-semibold`}
            >
              {isAdmin? t("admin"): t("profile")}
            </Link>
          </li>
        )}
        
        <li className="lg:hidden flex flex-col gap-4">
          <div onClick={() => setOpenMenu(false)}>
            <AuthButtons />
          </div>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
