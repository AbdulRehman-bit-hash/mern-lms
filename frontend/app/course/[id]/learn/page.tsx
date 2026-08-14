"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";
import { RootState } from "@/redux/store";
import {
  useGetCourseContentQuery,
  useMarkLessonCompleteMutation,
} from "@/redux/features/courses/coursesApi";
import VideoPlayer from "@/components/VideoPlayer";
import QASection from "@/components/QASection";

export default function CourseLearnPage() {
  const params = useParams();
  const id = params?.id as string;

  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, error, refetch } = useGetCourseContentQuery(id, {
    skip: !id,
  });
  const [markLessonComplete, { isLoading: isTogglingComplete }] =
    useMarkLessonCompleteMutation();
  const [activeIndex, setActiveIndex] = useState(0);
  // Tracks which sections have been explicitly collapsed. Absent from this
  // set means "open" — so everything is expanded by default on first visit,
  // and collapsing is opt-in rather than hiding content unexpectedly.
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (name: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <p className="max-w-6xl mx-auto px-6 py-20 text-ink/50">Loading…</p>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-ink/70 mb-2">
          You don't have access to this course yet.
        </p>
        <p className="text-ink/50 text-sm">
          Enroll from the course page first, then come back here.
        </p>
      </div>
    );
  }

  const content = data?.content || [];
  const active = content[activeIndex];

  const progressEntry = user?.courseProgress?.find(
    (p: any) => p.courseId === id
  );
  const completedLessons: string[] = progressEntry?.completedLessons || [];
  const completedCount = content.filter((item: any) =>
    completedLessons.includes(item._id)
  ).length;
  const isActiveComplete = active && completedLessons.includes(active._id);

  const handleToggleComplete = async () => {
    if (!active) return;
    try {
      await markLessonComplete({ courseId: id, contentId: active._id }).unwrap();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update progress");
    }
  };

  // Group the flat content array into sections by videoSection, preserving
  // each item's original index so activeIndex/content[activeIndex] still
  // works unchanged everywhere else in this component.
  const sections: { name: string; items: { item: any; index: number }[] }[] = [];
  content.forEach((item: any, i: number) => {
    const sectionName = item.videoSection || "Course Content";
    let section = sections.find((s) => s.name === sectionName);
    if (!section) {
      section = { name: sectionName, items: [] };
      sections.push(section);
    }
    section.items.push({ item, index: i });
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex gap-8">
      {/* Sidebar: curriculum grouped by section + progress */}
      <aside className="w-72 flex-shrink-0">
        <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">
          Course content
        </p>

        {content.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-ink/50 mb-1.5">
              <span>
                {completedCount} of {content.length} completed
              </span>
              <span>
                {Math.round((completedCount / content.length) * 100)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                className="h-full bg-moss transition-all duration-300"
                style={{
                  width: `${(completedCount / content.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {sections.map((section) => {
            const isCollapsed = collapsedSections.has(section.name);
            const sectionCompleted = section.items.filter(({ item }) =>
              completedLessons.includes(item._id)
            ).length;

            return (
              <div key={section.name}>
                <button
                  onClick={() => toggleSection(section.name)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-left"
                >
                  <span className="text-xs font-medium text-ink/60 uppercase tracking-wide truncate">
                    {section.name}
                  </span>
                  <span className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-ink/40">
                      {sectionCompleted}/{section.items.length}
                    </span>
                    <FiChevronDown
                      size={14}
                      className={`text-ink/40 transition-transform ${
                        isCollapsed ? "" : "rotate-180"
                      }`}
                    />
                  </span>
                </button>

                {!isCollapsed && (
                  <nav className="flex flex-col gap-1 mt-1">
                    {section.items.map(({ item, index: i }) => {
                      const done = completedLessons.includes(item._id);
                      return (
                        <button
                          key={item._id || i}
                          onClick={() => setActiveIndex(i)}
                          className={`flex items-center gap-2 text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                            i === activeIndex
                              ? "bg-ledger text-paper"
                              : "text-ink/70 hover:bg-parchment"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                              done
                                ? "bg-moss border-moss"
                                : i === activeIndex
                                ? "border-paper/50"
                                : "border-ink/30"
                            }`}
                          >
                            {done && (
                              <span className="w-1.5 h-1.5 rounded-full bg-paper" />
                            )}
                          </span>
                          <span className="truncate">
                            {item.title || `Video ${i + 1}`}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                )}
              </div>
            );
          })}
          {!content.length && (
            <p className="text-ink/50 text-sm">No content added yet.</p>
          )}
        </div>
      </aside>

      {/* Active video panel */}
      <div className="flex-1 min-w-0">
        {active ? (
          <>
            <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">
              {active.videoSection}
            </p>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-display text-3xl text-ink">{active.title}</h1>
              <button
                onClick={handleToggleComplete}
                disabled={isTogglingComplete}
                className={`flex-shrink-0 px-4 py-2 rounded-sm text-sm font-medium transition-colors disabled:opacity-60 ${
                  isActiveComplete
                    ? "bg-moss text-paper hover:opacity-90"
                    : "border border-ink/20 text-ink/70 hover:border-ink/40"
                }`}
              >
                {isActiveComplete ? "✓ Completed" : "Mark as complete"}
              </button>
            </div>

            <div className="mb-6">
              <VideoPlayer url={active.videoUrl} title={active.title} />
            </div>

            <p className="text-ink/70 leading-relaxed mb-10">
              {active.description}
            </p>

            <QASection
              courseId={id}
              contentId={active._id}
              questions={active.questions || []}
              onUpdated={refetch}
            />
          </>
        ) : (
          <p className="text-ink/50">Select a video to get started.</p>
        )}
      </div>
    </div>
  );
}
