"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const isEnglish = pathname.startsWith("/en");
  const newLocale = isEnglish ? "ar" : "en";


  const newPathname =
    pathname === "/" ? `/${newLocale}` : pathname.replace(/^\/(en|ar)/, `/${newLocale}`);

  const toggleLanguage = () => {

    router.push(newPathname);
  };
  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 text-gray-700  font-semibold rounded-full shadow-md hover:text-primary duration-200   transition-all   flex items-center gap-2"
    >
      🌍 {isEnglish ? "العربية" : "English"}
    </button>
  );
}
