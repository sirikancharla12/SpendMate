// types/next-auth.d.ts
import "next-auth";

// Extend the NextAuth module
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      googleId?: string | null; // Add googleId field here
    };
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    image: string;
    googleId?: string | null; // Add googleId field here
  }
}
