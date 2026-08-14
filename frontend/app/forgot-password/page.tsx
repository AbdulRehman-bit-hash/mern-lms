"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email).unwrap();
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <h1 className="font-display text-3xl mb-4 text-ink">Check your email</h1>
        <p className="text-ink/60 mb-8">
          If an account exists for <span className="text-ink">{email}</span>,
          we've sent a password reset link. It expires in 15 minutes.
        </p>
        <Link href="/login" className="text-ledger hover:underline text-sm">
          Back to login &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2 text-ink">Reset your password</h1>
      <p className="text-ink/60 mb-8">
        Enter your email and we'll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-ink/20 rounded-sm px-4 py-3 bg-surface text-ink focus:outline-none focus:border-ledger"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 bg-ledger text-paper py-3 rounded-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
        >
          {isLoading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        <Link href="/login" className="text-ledger hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
