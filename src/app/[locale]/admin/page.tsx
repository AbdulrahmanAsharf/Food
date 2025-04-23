import { Pages, Routes } from "@/constants/enums";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth"; 
import { UserRole } from "@prisma/client";
import { EditUserForm } from "@/components/edit-user-form";


async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${Routes.AUTH}/${Pages.LOGIN}`);
  }
  if (session && session.user.role !== UserRole.ADMIN) {
    redirect(`/${Routes.PROFILE}`);
  }


  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <EditUserForm user={session?.user} />
        </div>
      </section>
    </main>
  );
}

export default AdminPage;
