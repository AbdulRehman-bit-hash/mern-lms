"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { RootState } from "@/redux/store";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      toast.success("Logged in successfully");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2 text-ink">Welcome back</h1>
      <p className="text-ink/60 mb-8">Log in to pick up where you left off.</p>

      <SocialLoginButtons />

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-ink/10" />
        <span className="text-xs text-ink/40 uppercase tracking-wide">or</span>
        <div className="flex-1 h-px bg-ink/10" />
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-ink/20 rounded-sm px-4 py-3 bg-surface text-ink focus:outline-none focus:border-ledger"
        />
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-surface text-ink focus:outline-none focus:border-ledger"
          />
          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-xs text-ink/50 hover:text-ledger transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 bg-ledger text-paper py-3 rounded-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
        >
          {isLoading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        New here?{" "}
        <Link href="/register" className="text-ledger hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
