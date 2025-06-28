import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { Provider } from "next-auth/providers"
import prisma from "./lib/prisma";

const providers: Provider[] = [
    Credentials({
        credentials: { accessToken: { label: "Access Token", type: "text" } },
        authorize: async (credentials) => {
            if (!credentials?.accessToken) return null;
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        accessToken: credentials.accessToken as string
                    },
                });
                if (!user) {
                    return null;
                }
                return user;

            } catch (error) {
                return null;
            }
        },
    }),
];
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers,
    secret: process.env.AUTH_SECRET,
    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",

    },
    trustHost: true,
});