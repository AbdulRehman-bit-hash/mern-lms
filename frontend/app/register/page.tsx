"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRegisterMutation, useActivationMutation } from "@/redux/features/auth/authApi";
import { RootState } from "@/redux/store";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "activate">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const { token, user } = useSelector((state: RootState) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();
  const [activation, { isLoading: isActivating }] = useActivationMutation();

  // If a session is already loaded (e.g. visiting /register directly by URL
  // while logged in), send the user away instead of showing the form.
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password }).unwrap();
      toast.success("Check your email for an activation code");
      setStep("activate");
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await activation({
        activation_token: token,
        activation_code: code,
      }).unwrap();
      toast.success("Account activated. You can log in now.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Activation failed");
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2 text-ink">
        {step === "form" ? "Create your account" : "Activate your account"}
      </h1>
      <p className="text-ink/60 mb-8">
        {step === "form"
          ? "Start keeping your own ledger."
          : `Enter the code we sent to ${email}.`}
      </p>

      {step === "form" ? (
        <>
          <SocialLoginButtons />

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-ink/10" />
            <span className="text-xs text-ink/40 uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-ink/10" />
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-ink/20 rounded-sm px-4 py-3 bg-surface text-ink focus:outline-none focus:border-ledger"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-ink/20 rounded-sm px-4 py-3 bg-surface text-ink focus:outline-none focus:border-ledger"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border border-ink/20 rounded-sm px-4 py-3 bg-surface text-ink focus:outline-none focus:border-ledger"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-ledger text-paper py-3 rounded-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
            >
              {isLoading ? "Creating account…" : "Sign up"}
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={handleActivate} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="4-digit activation code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={4}
            className="border border-ink/20 rounded-sm px-4 py-3 bg-surface text-ink font-mono tracking-widest text-center text-xl focus:outline-none focus:border-ledger"
          />
          <button
            type="submit"
            disabled={isActivating}
            className="mt-2 bg-ledger text-paper py-3 rounded-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
          >
            {isActivating ? "Activating…" : "Activate account"}
          </button>
        </form>
      )}
    </div>
  );
}
