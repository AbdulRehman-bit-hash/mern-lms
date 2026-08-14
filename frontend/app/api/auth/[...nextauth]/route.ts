import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

// NextAuth here is used ONLY to handle the OAuth handshake with Google and
// GitHub and get back a verified name/email/avatar. It does not manage the
// app's real session — once we have that profile info, the frontend calls
// our own backend's /social-auth endpoint, which issues our own JWT/Redis
// session exactly like a normal email/password login does. See
// components/SocialAuthBridge.tsx for that handoff.

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
