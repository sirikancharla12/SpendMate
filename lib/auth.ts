import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import bcrypt from "bcrypt";

export const authConfig: NextAuthOptions = {
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
      
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "email profile", // Ensure these scopes are set
        },
      },
    }),
  ],
  session: {
    strategy: "jwt", // Ensure session strategy is set to JWT
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
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
              providerAccountId: account.providerAccountId!,
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
              providerAccountId: account.providerAccountId!,
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId!,
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
          id: token.id as string,
          email: token.email as string,
          name: token.name as string | null,
          image: token.image as string | null,
          googleId: token.googleId as string | null, // Ensure googleId is added to the session
        };
      }
      console.log("session:", token);
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email!;
        token.name = user.name!;
        token.image = user.image!;
      }

      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId!;
        token.googleId = account.providerAccountId!; // Add googleId to the JWT token
      }else{
        token.googleId = null;
      }
      console.log("JWT token:", token);
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
