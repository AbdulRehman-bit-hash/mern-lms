"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex items-center justify-center gap-3 border border-ink/20 rounded-sm py-2.5 text-sm font-medium text-ink hover:border-ink/40 transition-colors"
      >
        <FcGoogle size={18} />
        Continue with Google
      </button>
      <button
        type="button"
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="flex items-center justify-center gap-3 border border-ink/20 rounded-sm py-2.5 text-sm font-medium text-ink hover:border-ink/40 transition-colors"
      >
        <FaGithub size={18} />
        Continue with GitHub
      </button>
    </div>
  );
}
