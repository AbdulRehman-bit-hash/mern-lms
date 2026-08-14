"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Reveal from "@/components/Reveal";

export default function MyCoursesPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useGetAllCoursesQuery({}, { skip: !user });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <p className="text-ink/60 mb-4">Log in to see the courses you've enrolled in.</p>
        <Link href="/login" className="text-ledger hover:underline">
          Go to login &rarr;
        </Link>
      </div>
    );
  }

  const allCourses = data?.courses || [];
  const enrolledIds = new Set(
    (user.courses || []).map((c: any) => c.courseId)
  );
  const myCourses = allCourses.filter((c: any) => enrolledIds.has(c._id));

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Reveal>
        <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
          Your ledger
        </p>
        <h1 className="font-display text-4xl text-ink mb-2">My courses</h1>
        <p className="text-ink/60 mb-10">
          {myCourses.length} course{myCourses.length === 1 ? "" : "s"} enrolled.
        </p>
      </Reveal>

      {isLoading ? (
        <p className="text-ink/50">Loading…</p>
      ) : myCourses.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myCourses.map((course: any, i: number) => {
            const totalLessons = course.courseData?.length || 0;
            const progressEntry = user.courseProgress?.find(
              (p: any) => p.courseId === course._id
            );
            const completedCount = progressEntry?.completedLessons?.length || 0;
            const percent =
              totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : 0;

            return (
              <Reveal key={course._id} delayMs={(i % 3) * 100}>
                <Link
                  href={`/course/${course._id}/learn`}
                  className="group relative flex bg-surface border border-ink/10 rounded-sm overflow-hidden transition-all duration-300 hover:border-ledger/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(201,162,39,0.15)]"
                >
                  <div className="w-8 flex-shrink-0 bg-moss text-paper flex items-center justify-center">
                    <span className="spine-tab text-[11px] tracking-widest uppercase font-medium">
                      Enrolled
                    </span>
                  </div>

                  <div className="flex-1 p-4 flex flex-col gap-2">
                    <div className="relative w-full aspect-video bg-surface-2 rounded-sm overflow-hidden mb-1">
                      {course.thumbnail?.url && (
                        <Image
                          src={course.thumbnail.url}
                          alt={course.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>

                    <h3 className="font-display text-lg leading-snug text-ink">
                      {course.name}
                    </h3>

                    {totalLessons > 0 ? (
                      <div className="mt-auto pt-2">
                        <div className="flex items-center justify-between text-xs text-ink/50 mb-1.5">
                          <span>
                            {completedCount} of {totalLessons} lessons
                          </span>
                          <span>{percent}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div
                            className="h-full bg-moss transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-ink/50 mt-auto pt-2">
                        Continue where you left off &rarr;
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-ink/60 mb-3">You haven't enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="text-ledger hover:underline"
          >
            Browse the catalog &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
