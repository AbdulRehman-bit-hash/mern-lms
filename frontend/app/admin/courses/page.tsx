"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import {
  useGetAdminAllCoursesQuery,
  useDeleteCourseMutation,
} from "@/redux/features/courses/coursesApi";

export default function AdminCoursesPage() {
  const { data, isLoading, refetch } = useGetAdminAllCoursesQuery({});
  const [deleteCourse] = useDeleteCourseMutation();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete course "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(id).unwrap();
      toast.success("Course deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete course");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">Courses</h1>
        <Link
          href="/admin/courses/create"
          className="px-4 py-2 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors"
        >
          + New course
        </Link>
      </div>

      {isLoading ? (
        <p className="text-ink/50">Loading…</p>
      ) : (
        <table className="w-full text-sm border border-ink/10 bg-surface rounded-sm overflow-hidden">
          <thead className="bg-parchment text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/70">Name</th>
              <th className="px-4 py-3 font-medium text-ink/70">Price</th>
              <th className="px-4 py-3 font-medium text-ink/70">Enrolled</th>
              <th className="px-4 py-3 font-medium text-ink/70"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {data?.courses?.map((course: any) => (
              <tr key={course._id}>
                <td className="px-4 py-3 text-ink">{course.name}</td>
                <td className="px-4 py-3 font-mono text-ink">${course.price}</td>
                <td className="px-4 py-3 text-ink">{course.purchased || 0}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/courses/edit/${course._id}`}
                    className="text-ledger hover:underline text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id, course.name)}
                    className="text-ink/40 hover:text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!data?.courses?.length && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                  No courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
