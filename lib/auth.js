import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import bcrypt from "bcrypt";

export const authConfig = {
    useSecureCookies: process.env.NODE_ENV === "production",
    providers: [
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
        maxAge: 24 * 60 * 60, 
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
            if (session.user) {
                session.user.id = token.id || token.sub;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.image;
                session.user.googleId = token.googleId;
            }

            console.log("Session:", session);
            return session;
        },



        async jwt({ token, user, account }) {
            if (account?.provider === "google") {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                });

                if (dbUser) {
                    token.id = dbUser.id;             
                    token.googleId = dbUser.googleId; 
                    token.name = dbUser.name;
                    token.image = dbUser.image;
                }
            }

           
            if (user && !account) {
                token.id = user.id; 
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
            }

            return token;
        },

        async redirect({ url, baseUrl }) {
            if (url === baseUrl) {
                return `${baseUrl}/users`;
            }
            return url; 
        },
    },

    pages: {
        signIn: "/auth/signin", 
    },
};

export default NextAuth(authConfig);
