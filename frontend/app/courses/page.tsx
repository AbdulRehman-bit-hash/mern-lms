"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import CourseCard from "@/components/CourseCard";
import Reveal from "@/components/Reveal";

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const { data, isLoading } = useGetAllCoursesQuery({});
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");

  // Pre-fill from ?q= when arriving via the header search (or a shared link)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const courses = data?.courses || [];

  const filtered = useMemo(() => {
    return courses.filter((course: any) => {
      const matchesLevel = level === "All" || course.level === level;
      const matchesQuery =
        !query ||
        course.name?.toLowerCase().includes(query.toLowerCase()) ||
        course.tags?.toLowerCase().includes(query.toLowerCase());
      return matchesLevel && matchesQuery;
    });
  }, [courses, query, level]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Reveal>
        <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
          Catalog
        </p>
        <h1 className="font-display text-4xl text-ink mb-2">All courses</h1>
        <p className="text-ink/60 mb-10">
          {courses.length} course{courses.length === 1 ? "" : "s"} on the ledger.
        </p>
      </Reveal>

      {/* Search + level filter */}
      <Reveal delayMs={100}>
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search by name or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-ink/20 rounded-sm px-4 py-2.5 bg-surface text-ink focus:outline-none focus:border-gold transition-colors"
          />
          <div className="flex gap-2 flex-wrap">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-3 py-2 rounded-sm text-sm font-medium transition-all ${
                  level === l
                    ? "bg-ledger text-paper"
                    : "bg-surface border border-ink/15 text-ink/60 hover:border-gold/50 hover:text-gold"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {isLoading ? (
        <p className="text-ink/50">Loading courses…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course: any, i: number) => (
            <Reveal key={course._id} delayMs={(i % 3) * 100}>
              <CourseCard course={course} />
            </Reveal>
          ))}
          {!filtered.length && (
            <div className="col-span-full text-center py-16">
              <p className="text-ink/60 mb-1">No courses match that search.</p>
              <p className="text-ink/40 text-sm">
                Try a different keyword or clear the level filter.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
