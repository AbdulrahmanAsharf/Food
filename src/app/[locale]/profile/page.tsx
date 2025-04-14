import { Pages, Routes } from "@/constants/enums";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth"; 
import { UserRole } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { EditUserForm } from "@/components/edit-user-form";


async function Page() {
    const session = await getServerSession(authOptions);

  
    if (!session) {
      redirect(`/${Routes.AUTH}/${Pages.LOGIN}`);
    }
    if (session && session.user.role === UserRole.ADMIN) {
      redirect(`/${Routes.ADMIN}`);
    }
    const t = await getTranslations("profile");


    return   (  
    <main>
    <section className="section-gap">
        <div className="container ">
        <h1 className="text-primary text-center font-bold text-4xl italic mb-10">
            {t("title")}
        </h1>
        <EditUserForm user={session?.user}  />
        </div>
    </section>
    </main>
    )
}

export default Page;
//user={session?.user} 