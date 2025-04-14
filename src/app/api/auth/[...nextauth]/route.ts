import { authOptions } from "@/server/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


export const dynamic = "force-static"; 
export const revalidate = 60; 


