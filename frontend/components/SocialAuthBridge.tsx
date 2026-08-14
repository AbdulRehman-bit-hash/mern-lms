"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocialAuthLoginMutation } from "@/redux/features/auth/authApi";

// Mounted once at the root of the app (see layout.tsx). Whenever NextAuth
// reports a signed-in Google/GitHub session and our own app doesn't have a
// session yet, this hands that profile off to our backend's /social-auth
// endpoint to create our own JWT/Redis session — the same one email/password
// login produces. It only attempts this once per OAuth session so a failure
// doesn't retry in a loop.
export default function SocialAuthBridge() {
  const { data: session, status } = useSession();
  const { user } = useSelector((state: RootState) => state.auth);
  const [socialAuthLogin] = useSocialAuthLoginMutation();
  const attempted = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) {
      attempted.current = false;
      return;
    }

    if (user || attempted.current) return;

    attempted.current = true;
    socialAuthLogin({
      email: session.user.email,
      name: session.user.name || session.user.email.split("@")[0],
      avatar: session.user.image || "",
    });
  }, [status, session, user, socialAuthLogin]);

  return null;
}
