import NextAuth, { DefaultSession } from "next-auth";

interface IUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string | null;
  token?: string | null;
}

declare module "next-auth" {
  interface Session {
    user?: IUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: IUser;
  }
}
