"use client";

import toast from "react-hot-toast";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";

export default function AdminUsersPage() {
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRoleToggle = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole({ id, role: newRole }).unwrap();
      toast.success(`Role updated to ${newRole}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Users</h1>

      {isLoading ? (
        <p className="text-ink/50">Loading…</p>
      ) : (
        <table className="w-full text-sm border border-ink/10 bg-surface rounded-sm overflow-hidden">
          <thead className="bg-parchment text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/70">Name</th>
              <th className="px-4 py-3 font-medium text-ink/70">Email</th>
              <th className="px-4 py-3 font-medium text-ink/70">Role</th>
              <th className="px-4 py-3 font-medium text-ink/70">Courses</th>
              <th className="px-4 py-3 font-medium text-ink/70"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {data?.users?.map((user: any) => (
              <tr key={user._id}>
                <td className="px-4 py-3 text-ink">{user.name}</td>
                <td className="px-4 py-3 text-ink/70">{user.email}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRoleToggle(user._id, user.role)}
                    className={`text-xs px-2 py-1 rounded-sm font-medium ${
                      user.role === "admin"
                        ? "bg-ledger text-paper"
                        : "bg-parchment text-ink/70"
                    }`}
                  >
                    {user.role}
                  </button>
                </td>
                <td className="px-4 py-3 text-ink">
                  {user.courses?.length || 0}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(user._id, user.name)}
                    className="text-ink/40 hover:text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!data?.users?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/50">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
