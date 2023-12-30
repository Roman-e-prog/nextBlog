import { JWT as NextAuthJWT, User as NextAuthUser, Session as NextAuthSession } from "next-auth";
import { AdapterUser as NextAuthUser } from "next-auth/adapters";

declare module "next-auth" {
  interface User extends NextAuthUser {
    _id:string,
    isAdmin: boolean;
    vorname: string;
    nachname: string;
    profilePicture?:string,
    username: string;
    email: string;
    password: string;
    }
}

declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    _id:string,
    isAdmin: boolean;
    vorname: string;
    nachname: string;
    username: string;
    email: string;
    password: string;
  }
}

declare module "next-auth" {
  interface Session extends NextAuthSession {
    user: {
      _id:string,
      vorname: string;
      nachname: string;
      username: string;
      profilePicture?:string,
      email: string;
      password: string;
      isAdmin: boolean;
    };
  }
}

declare module "next-auth/adapters" {
  export interface AdapterUser extends NextAuthUser {
    _id:string,
    vorname: string;
    nachname: string;
    username: string;
    profilePicture?:string,
    email: string;
    password: string;
    isAdmin: boolean;
    }
}
