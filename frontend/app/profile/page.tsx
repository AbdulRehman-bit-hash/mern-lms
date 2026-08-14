"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { signOut as socialSignOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { RootState } from "@/redux/store";
import {
  useLogOutQuery,
  useUpdateProfilePictureMutation,
  useUpdateUserInfoMutation,
  useUpdatePasswordMutation,
} from "@/redux/features/auth/authApi";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logoutTriggered, setLogoutTriggered] = useState(false);
  const { } = useLogOutQuery(undefined, { skip: !logoutTriggered });

  const [updateProfilePicture, { isLoading: isUploading }] =
    useUpdateProfilePictureMutation();
  const [updateUserInfo, { isLoading: isSavingInfo }] =
    useUpdateUserInfoMutation();
  const [updatePassword, { isLoading: isSavingPassword }] =
    useUpdatePasswordMutation();

  const [editingInfo, setEditingInfo] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [changingPassword, setChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    setLogoutTriggered(true);
    // Also clear the NextAuth/OAuth session — otherwise someone who signed
    // in with Google or GitHub would get silently signed back in the next
    // time SocialAuthBridge sees their still-active OAuth session.
    socialSignOut({ redirect: false });
    toast.success("Logged out");
    router.push("/");
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await updateProfilePicture(reader.result as string).unwrap();
        toast.success("Profile picture updated");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to update profile picture");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserInfo({ name, email }).unwrap();
      toast.success("Account details updated");
      setEditingInfo(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update account details");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      await updatePassword({ oldPassword, newPassword }).unwrap();
      toast.success("Password updated");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangingPassword(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <p className="text-ink/60 mb-4">You're not logged in.</p>
        <a href="/login" className="text-ledger hover:underline">
          Go to login &rarr;
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
        Account
      </p>

      <div className="flex items-center gap-5 mb-10">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-surface-2 border border-ink/10 flex items-center justify-center flex-shrink-0">
          {user.avatar?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar.url}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-2xl text-ledger">
              {user.name?.[0]?.toUpperCase() || "?"}
            </span>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl text-ink">{user.name}</h1>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mt-2 text-sm text-ledger hover:underline disabled:opacity-60"
          >
            {isUploading ? "Uploading…" : "Change profile picture"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Account details */}
      <div className="border border-ink/10 rounded-sm bg-surface mb-6">
        <div className="px-6 py-4 flex items-center justify-between border-b border-ink/10">
          <h2 className="font-display text-lg text-ink">Account details</h2>
          {!editingInfo && (
            <button
              onClick={() => setEditingInfo(true)}
              className="text-sm text-ledger hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {editingInfo ? (
          <form onSubmit={handleSaveInfo} className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs text-ink/50 mb-1.5 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-ink/20 rounded-sm px-4 py-2.5 bg-surface-2 text-ink focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-ink/50 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-ink/20 rounded-sm px-4 py-2.5 bg-surface-2 text-ink focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div className="flex gap-3 mt-1">
              <button
                type="submit"
                disabled={isSavingInfo}
                className="px-5 py-2 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
              >
                {isSavingInfo ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingInfo(false);
                  setName(user.name || "");
                  setEmail(user.email || "");
                }}
                className="px-5 py-2 rounded-sm border border-ink/20 text-ink/70 text-sm hover:border-ink/40 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="divide-y divide-ink/10">
            <div className="px-6 py-4 flex justify-between">
              <span className="text-ink/50">Name</span>
              <span className="text-ink">{user.name}</span>
            </div>
            <div className="px-6 py-4 flex justify-between">
              <span className="text-ink/50">Email</span>
              <span className="text-ink">{user.email}</span>
            </div>
            <div className="px-6 py-4 flex justify-between">
              <span className="text-ink/50">Role</span>
              <span className="text-ink capitalize">{user.role}</span>
            </div>
            <div className="px-6 py-4 flex justify-between">
              <span className="text-ink/50">Courses enrolled</span>
              <span className="text-ink">{user.courses?.length || 0}</span>
            </div>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="border border-ink/10 rounded-sm bg-surface mb-8">
        <div className="px-6 py-4 flex items-center justify-between border-b border-ink/10">
          <h2 className="font-display text-lg text-ink">Password</h2>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="text-sm text-ledger hover:underline"
            >
              Change password
            </button>
          )}
        </div>

        {changingPassword && (
          <form
            onSubmit={handleChangePassword}
            className="p-6 flex flex-col gap-4"
          >
            <div>
              <label className="block text-xs text-ink/50 mb-1.5 uppercase tracking-wide">
                Current password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border border-ink/20 rounded-sm px-4 py-2.5 bg-surface-2 text-ink focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-ink/50 mb-1.5 uppercase tracking-wide">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="w-full border border-ink/20 rounded-sm px-4 py-2.5 bg-surface-2 text-ink focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-ink/50 mb-1.5 uppercase tracking-wide">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                className="w-full border border-ink/20 rounded-sm px-4 py-2.5 bg-surface-2 text-ink focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div className="flex gap-3 mt-1">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="px-5 py-2 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
              >
                {isSavingPassword ? "Updating…" : "Update password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangingPassword(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="px-5 py-2 rounded-sm border border-ink/20 text-ink/70 text-sm hover:border-ink/40 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="px-5 py-2.5 rounded-sm border border-ink/20 text-ink hover:border-ink/40 transition-colors"
      >
        Log out
      </button>
    </div>
  );
}
