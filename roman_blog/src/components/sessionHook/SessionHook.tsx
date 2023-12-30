"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
interface User {
    _id: string;
    vorname: string;
    nachname: string;
    username: string;
    profilePicture?: string;
    email: string;
    password: string;
    isAdmin: boolean;
  }
export function useUserSession() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null >(null);

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session]);

  return { user, loading: status === "loading" };
}