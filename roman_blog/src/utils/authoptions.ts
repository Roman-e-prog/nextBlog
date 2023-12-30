
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcrypt";
import { add } from 'date-fns';

export const authOptions:AuthOptions = {
    providers: [
      CredentialsProvider({ 
          id:"credentials",
          name:"Credentials",
          credentials: {
              username: { label: "Username", type: "text"},
              password: {  label: "Passwort", type: "password" },
              email: {  label: "Email", type: "email" },
            },
          async authorize(credentials) {
              //Check if the user exists.
              await connect();
              try {
                const user = await User.findOne({
                  email: credentials!.email,
                });
                if (user) {
                  const isPasswordCorrect = await bcrypt.compare(
                    credentials!.password,
                    user.password
                  );
                  if (isPasswordCorrect) {
                    return user._doc
                  } else {
                    throw new Error("Falsche Eingabedaten!");
                  }
                } else {
                  throw new Error("Nutzer nicht gefunden!");
                }
              } catch (error:any) {
                throw new Error(error);
              }
            },
      })
    ],
    callbacks:{
      jwt: async ({ token, user }) => {
        if (user) {
          token = {...token, ...user}
          token.vorname = user.vorname;
          token.nachname = user.nachname;
          token._id = user._id;
          token.ProfilePicture = user.profilePicture,
          token.isAdmin = user.isAdmin;
          token.username = user.username;
        }
        return token;
      },
      session: async ({ session, token }) => {
        session.user = token ? token : session.user;
        if (token && typeof token.isAdmin === 'boolean') {
          session.user.isAdmin = token.isAdmin;
        }
        //Add expires property
        session.expires = add(new Date(), { days: 30 }).toISOString();
        return session;
      },
    },   secret:process.env.SECRET,
    pages: {
      error: "/authUser/login",
    },
  }