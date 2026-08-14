"use client";

import { useLoadUserQuery } from "@/redux/features/auth/authApi";

// Calling this hook on every page load asks the backend "am I still logged
// in?" using whatever cookies the browser already has, and if so, restores
// the user into Redux state. Without this, refreshing the page always looks
// logged-out even if the session cookie is still valid.
export default function AuthLoader({ children }: { children: React.ReactNode }) {
  useLoadUserQuery({});
  return <>{children}</>;
}
