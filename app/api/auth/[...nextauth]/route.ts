import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";
const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        uname: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.Users.findUnique({
          where: { uname: credentials?.uname, role: "1" },
        });
        // return { id: user.id };
        if (!user) {
          return null; // 用户名不存在
        }
        const password = createHash("md5")
          .update(credentials?.password)
          .digest("hex");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return null; // 密码错误
        }

        if (user) {
          return { id: user.id, uname: user.uname, role: user.role };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.uname = user.uname;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.uname = token.uname as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url + "?token=xxx";
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8h
  },
  secret: process.env.SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
