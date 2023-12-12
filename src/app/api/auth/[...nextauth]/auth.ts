import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions, DefaultUser, User } from "next-auth";
import prisma from "@/app/prisma/prisma";
declare module "next-auth" {
  interface Session {
    user?: DefaultUser;
  }
}
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },

  // pages: { signIn: "/auth/signin", newUser: "/" },
};
