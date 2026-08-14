"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import {
  useAddReviewMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import { useLoadUserQuery } from "@/redux/features/auth/authApi";
import StarRating from "@/components/StarRating";
import { getDiscountPercent } from "@/lib/discount";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, refetch: refetchCourse } = useGetCourseDetailsQuery(
    id,
    { skip: !id }
  );
  const { refetch: refetchUser } = useLoadUserQuery({});
  const [createOrder, { isLoading: isEnrolling }] = useCreateOrderMutation();
  const [addReview, { isLoading: isSubmittingReview }] = useAddReviewMutation();
  const [justEnrolled, setJustEnrolled] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const course = data?.course;

  const alreadyOwned =
    justEnrolled || user?.courses?.some((c: any) => c.courseId === id);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please log in to enroll");
      router.push("/login");
      return;
    }

    // Paid courses go through Stripe checkout; free courses enroll instantly.
    if (course.price > 0) {
      router.push(`/course/${id}/checkout`);
      return;
    }

    try {
      await createOrder({ courseId: id, payment_info: {} }).unwrap();
      toast.success("Enrolled successfully!");
      setJustEnrolled(true);
      refetchUser();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to enroll");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewRating) {
      toast.error("Please select a star rating");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a short review");
      return;
    }

    try {
      await addReview({
        courseId: id,
        rating: reviewRating,
        review: reviewComment,
      }).unwrap();
      toast.success("Review submitted");
      setReviewRating(0);
      setReviewComment("");
      refetchCourse();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  if (isLoading) {
    return <p className="max-w-4xl mx-auto px-6 py-20 text-ink/50">Loading…</p>;
  }

  if (!course) {
    return (
      <p className="max-w-4xl mx-auto px-6 py-20 text-ink/50">
        Course not found.
      </p>
    );
  }

  const reviews = course.reviews || [];
  const discount = getDiscountPercent(course.price, course.estimatedPrice);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono uppercase tracking-widest bg-ledger text-paper px-2 py-1 rounded-sm">
          {course.level}
        </span>
        <span className="text-xs text-ink/50">{course.purchased || 0} enrolled</span>
        {discount > 0 && (
          <span className="text-xs font-bold bg-oxblood text-paper px-2 py-1 rounded-sm">
            {discount}% OFF
          </span>
        )}
      </div>

      <h1 className="font-display text-4xl text-ink mb-4">{course.name}</h1>

      <div className="flex items-center gap-2 mb-6">
        <StarRating rating={course.ratings || 0} />
        <span className="text-sm text-ink/50">
          {course.ratings ? course.ratings.toFixed(1) : "No ratings yet"}
          {reviews.length > 0 &&
            ` · ${reviews.length} review${reviews.length === 1 ? "" : "s"}`}
        </span>
      </div>

      <p className="text-ink/70 text-lg mb-8">{course.description}</p>

      {course.thumbnail?.url && (
        <div className="relative w-full aspect-video rounded-sm overflow-hidden mb-8 bg-parchment">
          <Image
            src={course.thumbnail.url}
            alt={course.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-8 mb-10">
        {course.benefits?.length > 0 && (
          <div>
            <h2 className="font-display text-xl mb-3 text-ink">What you'll learn</h2>
            <ul className="space-y-2 text-ink/70">
              {course.benefits.map((b: any, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold">—</span> {b.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {course.prerequisites?.length > 0 && (
          <div>
            <h2 className="font-display text-xl mb-3 text-ink">Prerequisites</h2>
            <ul className="space-y-2 text-ink/70">
              {course.prerequisites.map((p: any, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold">—</span> {p.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border border-ink/10 rounded-sm p-6 bg-surface flex items-center justify-between mb-16">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-3xl text-ledger">${course.price}</span>
          {course.estimatedPrice > course.price && (
            <span className="font-mono text-lg text-ink/40 line-through">
              ${course.estimatedPrice}
            </span>
          )}
          {discount > 0 && (
            <span className="text-sm font-medium text-oxblood">
              Save {discount}%
            </span>
          )}
        </div>

        {alreadyOwned ? (
          <button
            onClick={() => router.push(`/course/${id}/learn`)}
            className="px-6 py-3 rounded-sm bg-moss text-paper font-medium hover:opacity-90 transition-opacity"
          >
            Go to course
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="px-6 py-3 rounded-sm bg-ledger text-paper font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
          >
            {isEnrolling
              ? "Enrolling…"
              : course.price > 0
              ? "Buy and enroll"
              : "Enroll for free"}
          </button>
        )}
      </div>

      {/* Reviews */}
      <div className="mb-10">
        <h2 className="font-display text-2xl text-ink mb-6">Reviews</h2>

        {reviews.length > 0 ? (
          <div className="flex flex-col gap-5 mb-10">
            {reviews.map((review: any, i: number) => (
              <div
                key={i}
                className="border-b border-ink/10 pb-5 last:border-b-0"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-xs font-display text-gold flex-shrink-0">
                    {review.user?.name?.[0]?.toUpperCase() || "?"}
                  </span>
                  <div>
                    <p className="text-sm text-ink font-medium">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <StarRating rating={review.rating || 0} size={12} />
                  </div>
                </div>
                <p className="text-ink/70 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink/50 mb-10">No reviews yet.</p>
        )}

        {/* Leave a review — only for enrolled users */}
        {user && alreadyOwned && (
          <div className="border border-ink/10 rounded-sm p-6 bg-surface">
            <h3 className="font-display text-lg text-ink mb-4">Leave a review</h3>
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
              <StarRating rating={reviewRating} onChange={setReviewRating} size={22} />
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="What did you think of this course?"
                rows={3}
                className="border border-ink/20 rounded-sm px-4 py-3 bg-surface-2 text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="self-start px-5 py-2.5 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
              >
                {isSubmittingReview ? "Submitting…" : "Submit review"}
              </button>
            </form>
          </div>
        )}

        {user && !alreadyOwned && (
          <p className="text-ink/50 text-sm">
            Enroll in this course to leave a review.
          </p>
        )}
      </div>
    </div>
  );
}
