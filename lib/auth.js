import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import bcrypt from "bcrypt";

export const authConfig = {
    useSecureCookies: process.env.NODE_ENV === "production",
    providers: [
        // Credentials Provider
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) return null;

                const dbUser = await prisma.user.findFirst({
                    where: { email: credentials.email },
                });

                if (!dbUser) {
                    const hashedPassword = bcrypt.hashSync(credentials.password, 10);
                    const newUser = await prisma.user.create({
                        data: {
                            email: credentials.email,
                            password: hashedPassword,
                            name: credentials.email.split("@")[0],
                        },
                    });

                    const { password, ...newUserWithoutPassword } = newUser;
                    return newUserWithoutPassword;
                } else {
                    if (!dbUser.password) return null;
                    const isPasswordValid = bcrypt.compareSync(credentials.password, dbUser.password);
                    if (!isPasswordValid) return null;
                }

                const { password, ...dbUserWithoutPassword } = dbUser;
                return dbUserWithoutPassword;
            },
        }),

        // Google OAuth Provider
        GoogleProvider({

            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "email profile",
                },
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account }) {
            if (account && account.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!existingUser) {
                    const newUser = await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            provider: account.provider,

                            googleId: account.providerAccountId,
                        },
                    });

                    await prisma.account.create({
                        data: {
                            userId: newUser.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refresh_token: account.refresh_token,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                        },
                    });
                } else {
                    const existingAccount = await prisma.account.findFirst({
                        where: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    });

                    if (!existingAccount) {
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refresh_token: account.refresh_token,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token,
                            },
                        });
                    }
                }
            }
            return true;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    email: token.email,
                    name: token.name,
                    image: token.image,
                    googleId: token.googleId, // Ensure googleId is added to the session
                };
            }
            console.log("session:", token);
            return session;
        },

        async jwt({ token, user, account }) {
            // Google login
            if (account?.provider === "google") {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                });

                if (dbUser) {
                    token.id = dbUser.id;             // ✅ Prisma ID
                    token.googleId = dbUser.googleId; // Google sub
                    token.name = dbUser.name;
                    token.image = dbUser.image;
                }
            }

            // Credentials login
            if (user && !account) {
                token.id = user.id; // already Prisma ID
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
            }

            return token;
        },

        // Redirect logic after successful sign-in
        async redirect({ url, baseUrl }) {
            // Check if the URL is the base URL, if so, redirect to /users page
            if (url === baseUrl) {
                return `${baseUrl}/users`; // Redirect to /users page after login
            }
            return url; // Default behavior for other URLs
        },
    },

    pages: {
        signIn: "/auth/signin", // Custom sign-in page
    },
};

export default NextAuth(authConfig);
