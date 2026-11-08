import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logAudit } from "./audit";
import { DEFAULT_USERS } from "./mock-data";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Hospital Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "staff@naseemijaz.pk" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password.");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();
        let user: any = null;

        try {
          user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });
        } catch (dbErr) {
          console.warn("Database lookup failed in auth, falling back to demo credentials:", dbErr);
        }

        if (user) {
          if (!user.active) {
            throw new Error("Invalid email or password, or account disabled.");
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) {
            throw new Error("Invalid email or password.");
          }

          try {
            await logAudit({
              userId: user.id,
              userName: user.name,
              role: user.role,
              action: "USER_LOGIN",
              entity: "User",
              entityId: user.id,
              details: { email: user.email },
            });
          } catch (_) {}

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            doctorId: user.doctorId,
          };
        }

        // Demo user fallback when database is disconnected or unseeded
        const demoUser = DEFAULT_USERS.find(
          (u) => u.email.toLowerCase() === normalizedEmail && u.password === credentials.password
        );

        if (demoUser) {
          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
            doctorId: demoUser.doctorId,
          };
        }

        throw new Error("Invalid email or password.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.doctorId = (user as any).doctorId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).doctorId = token.doctorId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hour staff shift
  },
  secret: process.env.NEXTAUTH_SECRET || "hospital-super-secret-jwt-key-min-32-chars-long",
};
