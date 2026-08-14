"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      toast.success("Password reset — you're logged in.");
      router.push("/");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "This reset link is invalid or has expired."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2 text-ink">Choose a new password</h1>
      <p className="text-ink/60 mb-8">
        Enter a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
          className="border border-ink/20 rounded-sm px-4 py-3 bg-surface text-ink focus:outline-none focus:border-ledger"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="border border-ink/20 rounded-sm px-4 py-3 bg-surface text-ink focus:outline-none focus:border-ledger"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 bg-ledger text-paper py-3 rounded-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
        >
          {isLoading ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </div>
  );
}
