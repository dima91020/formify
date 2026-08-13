import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "./schemas/auth.schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    pages: { signIn: "/login"},
    callbacks: {
        async jwt({ user, token }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = (token.id || token.sub) as string;
            }

            return session;
        },
    },
    providers: [
        Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }),
        GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET }),
        Credentials({
            async authorize(credentials) {
                const validated = loginSchema.safeParse(credentials);

                if (!validated.success) return null;

                const { email, password } = validated.data;
                
                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        }
                    });

                    if (!user) return null;

                    if (!password || !user.password) return null;

                    const isPasswordCorrect = await bcrypt.compare(password, user.password);

                    if (!isPasswordCorrect) return null;

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
});