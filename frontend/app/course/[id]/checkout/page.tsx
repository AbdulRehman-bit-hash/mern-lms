"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { RootState } from "@/redux/store";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import {
  useGetStripePublishableKeyQuery,
  useCreatePaymentIntentMutation,
} from "@/redux/features/payment/paymentApi";
import CheckoutForm from "@/components/CheckoutForm";
import { useTheme } from "@/components/ThemeProvider";
import { themeColors } from "@/lib/themeColors";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  const c = themeColors[theme];

  const { data: courseData, isLoading: isCourseLoading } =
    useGetCourseDetailsQuery(id, { skip: !id });
  const { data: keyData } = useGetStripePublishableKeyQuery({});
  const [createPaymentIntent, { data: intentData, isLoading: isCreatingIntent }] =
    useCreatePaymentIntentMutation();

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(
    null
  );

  const course = courseData?.course;

  // Redirect away if not logged in, already enrolled, or the course is free
  // (free courses skip checkout entirely — see the course detail page).
  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!course) return;

    const alreadyOwned = user.courses?.some((c: any) => c.courseId === id);
    if (alreadyOwned) {
      router.replace(`/course/${id}/learn`);
      return;
    }
    if (course.price === 0) {
      router.replace(`/course/${id}`);
    }
  }, [user, course, id, router]);

  // Load Stripe.js once we have the publishable key
  useEffect(() => {
    if (keyData?.publishableKey && !stripePromise) {
      setStripePromise(loadStripe(keyData.publishableKey));
    }
  }, [keyData, stripePromise]);

  // Create the payment intent once we know the course price. courseId
  // travels with it so the backend can attach it as metadata — that's what
  // lets the Stripe webhook fulfill this order even if this browser tab
  // never gets to call create-order itself.
  useEffect(() => {
    if (course?.price && !intentData) {
      createPaymentIntent({ amount: course.price, courseId: id });
    }
  }, [course, intentData, createPaymentIntent, id]);

  const clientSecret = intentData?.client_secret;

  // Stripe Elements' "appearance" takes literal color strings, not CSS
  // variables, so it can't follow the .dark class on its own — we pass in
  // whichever palette matches the current theme instead, and re-create the
  // options object whenever the theme or clientSecret changes.
  const elementsOptions = useMemo(() => {
    if (!clientSecret) return undefined;
    return {
      clientSecret,
      appearance: {
        theme: (theme === "dark" ? "night" : "stripe") as "night" | "stripe",
        variables: {
          colorPrimary: c.ledger,
          colorBackground: c.surface2,
          colorText: c.ink,
          colorDanger: c.oxblood,
          borderRadius: "2px",
        },
      },
    };
  }, [clientSecret, theme, c]);

  if (isCourseLoading || !course) {
    return <p className="max-w-md mx-auto px-6 py-20 text-ink/50">Loading…</p>;
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
        Checkout
      </p>
      <h1 className="font-display text-3xl text-ink mb-2">{course.name}</h1>
      <p className="font-mono text-2xl text-ledger mb-8">${course.price}</p>

      <div className="border border-ink/10 rounded-sm bg-surface p-6">
        {stripePromise && elementsOptions ? (
          <Elements stripe={stripePromise} options={elementsOptions}>
            <CheckoutForm courseId={id} />
          </Elements>
        ) : (
          <p className="text-ink/50 text-sm">
            {isCreatingIntent ? "Preparing checkout…" : "Loading payment form…"}
          </p>
        )}
      </div>
    </div>
  );
}
