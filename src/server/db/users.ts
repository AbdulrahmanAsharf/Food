import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getUsers = cache(
  async () => {
    const users =await db.user.findMany();
    return users;
  },
  ["users"],
  { revalidate: 3600 }
);


export const getUser = (userId: string) =>
  cache(
    async () => {
      const user = await db.user.findUnique({ where: { id: userId } });
      return user;
    },
    [`user-${userId}`],
    { revalidate: 3600 }
  )();