"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetLayoutQuery } from "@/redux/features/layout/layoutApi";
import CourseCard from "@/components/CourseCard";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import { RootState } from "@/redux/store";

const steps = [
  {
    n: "01",
    title: "Browse",
    body: "Search the catalog by level or topic and find a course that matches what you're trying to build.",
  },
  {
    n: "02",
    title: "Enroll",
    body: "One click adds the course to your account — it shows up in your profile immediately.",
  },
  {
    n: "03",
    title: "Learn",
    body: "Work through the content at your own pace, ask questions, and leave a review when you're done.",
  },
];

const defaultHeadline = "Keep a ledger of everything you learn.";
const defaultSubheadline =
  "Courses, progress, and proof of work — recorded in one place. Built on Next.js, Express, and MongoDB.";

export default function Home() {
  const { data, isLoading } = useGetAllCoursesQuery({});
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: bannerData } = useGetLayoutQuery("Banner");
  const { data: categoriesData } = useGetLayoutQuery("Categories");
  const { data: faqData } = useGetLayoutQuery("FAQ");

  const banner = bannerData?.layout?.banner;
  const categories = categoriesData?.layout?.categories || [];
  const faqItems = faqData?.layout?.faq || [];

  const courses = data?.courses || [];
  const totalCourses = courses.length;
  const totalEnrolled = courses.reduce(
    (sum: number, c: any) => sum + (c.purchased || 0),
    0
  );
  const levels = new Set(courses.map((c: any) => c.level).filter(Boolean));
  const avgRating =
    courses.length > 0
      ? (
          courses.reduce((sum: number, c: any) => sum + (c.ratings || 0), 0) /
          courses.length
        ).toFixed(1)
      : "—";

  const ledgerStats = [
    { label: "Courses listed", value: totalCourses },
    { label: "Enrollments recorded", value: totalEnrolled },
    { label: "Skill levels covered", value: levels.size },
    { label: "Average rating", value: avgRating },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-14">
        <div
          className={
            banner?.image?.url
              ? "grid lg:grid-cols-2 gap-12 items-center"
              : ""
          }
        >
          {/* Text column */}
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-gold mb-4 animate-fade-in-up">
              Vol. 01 — Learning Management System
            </p>
            <h1
              className={`font-display text-5xl sm:text-6xl leading-[1.05] text-ink animate-fade-in-up ${
                banner?.image?.url ? "" : "max-w-3xl"
              }`}
              style={{ animationDelay: "80ms" }}
            >
              {banner?.title || defaultHeadline}
            </h1>
            <p
              className={`mt-6 text-ink/70 text-lg font-body animate-fade-in-up ${
                banner?.image?.url ? "" : "max-w-xl"
              }`}
              style={{ animationDelay: "160ms" }}
            >
              {banner?.subTitle || defaultSubheadline}
            </p>
            <div
              className="mt-8 flex gap-4 animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/courses"
                className="shimmer-on-hover px-6 py-3 rounded-sm bg-ledger text-paper font-medium hover:bg-ledger-dark transition-all hover:-translate-y-0.5"
              >
                Browse courses
              </Link>
              {!user && (
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-sm border border-ink/20 text-ink font-medium hover:border-gold hover:text-gold transition-all hover:-translate-y-0.5"
                >
                  Create an account
                </Link>
              )}
            </div>

            {/* Category chips — only shows once an admin has added categories */}
            {categories.length > 0 && (
              <div
                className="mt-8 flex flex-wrap gap-2 animate-fade-in-up"
                style={{ animationDelay: "300ms" }}
              >
                {categories.map((cat: any) => (
                  <Link
                    key={cat.title}
                    href={`/courses?q=${encodeURIComponent(cat.title)}`}
                    className="px-3 py-1.5 rounded-full border border-ink/15 text-ink/60 text-sm hover:border-gold/50 hover:text-gold transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Image column — only rendered once an admin has uploaded a banner image */}
          {banner?.image?.url && (
            <div
              className="relative w-full aspect-[4/3] rounded-sm overflow-hidden border border-ink/10 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <Image
                src={banner.image.url}
                alt={banner.title || "Homepage banner"}
                fill
                sizes="(max-width: 1024px) 100vw, 576px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Ledger stats strip — real numbers, formatted like an actual ledger entry */}
      <Reveal>
        <section className="border-y border-ink/10 bg-surface">
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {ledgerStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`${i > 0 ? "sm:border-l sm:border-ink/10 sm:pl-6" : ""}`}
              >
                <p className="font-mono text-2xl text-ledger">{stat.value}</p>
                <p className="text-xs text-ink/50 mt-1 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* How it works — a real sequence, so numbered steps earn their place */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
            The process
          </p>
          <h2 className="font-display text-3xl text-ink mb-10">
            Three steps, start to finish.
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.n} delayMs={i * 120}>
              <div className="group">
                <p className="font-display text-4xl text-ink/15 mb-3 transition-colors group-hover:text-gold/40">
                  {step.n}
                </p>
                <h3 className="font-display text-xl text-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-ink/60 leading-relaxed">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl text-ink">Featured courses</h2>
            <Link
              href="/courses"
              className="link-underline text-sm text-ledger"
            >
              View all &rarr;
            </Link>
          </div>
        </Reveal>

        {isLoading ? (
          <p className="text-ink/50">Loading courses…</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice(0, 6).map((course: any, i: number) => (
              <Reveal key={course._id} delayMs={(i % 3) * 100}>
                <CourseCard course={course} />
              </Reveal>
            ))}
            {!courses.length && (
              <p className="text-ink/50 col-span-full">
                No courses yet. Create one from the admin dashboard to see it here.
              </p>
            )}
          </div>
        )}
      </section>

      {/* FAQ — only shows once an admin has added questions */}
      {faqItems.length > 0 && (
        <section className="border-y border-ink/10 bg-surface">
          <div className="max-w-3xl mx-auto px-6 py-20">
            <Reveal>
              <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
                Questions
              </p>
              <h2 className="font-display text-3xl text-ink mb-10">
                Frequently asked.
              </h2>
            </Reveal>
            <Reveal delayMs={100}>
              <FaqAccordion items={faqItems} />
            </Reveal>
          </div>
        </section>
      )}

      {/* Closing CTA — only for logged-out visitors */}
      {!user && (
        <Reveal>
          <section className="bg-ledger animate-glow-pulse">
            <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-3xl text-paper mb-2">
                  Start your own ledger.
                </h2>
                <p className="text-paper/70">
                  Free to create an account — enroll whenever you're ready.
                </p>
              </div>
              <Link
                href="/register"
                className="px-6 py-3 rounded-sm bg-paper text-gold font-medium hover:bg-surface transition-all hover:-translate-y-0.5 flex-shrink-0"
              >
                Create an account
              </Link>
            </div>
          </section>
        </Reveal>
      )}
    </div>
  );
}
