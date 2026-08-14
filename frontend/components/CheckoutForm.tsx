"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import { useLoadUserQuery } from "@/redux/features/auth/authApi";

interface CheckoutFormProps {
  courseId: string;
}

export default function CheckoutForm({ courseId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { refetch: refetchUser } = useLoadUserQuery({});
  const [createOrder] = useCreateOrderMutation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't finished loading yet
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await createOrder({
          courseId,
          payment_info: {
            id: paymentIntent.id,
            status: paymentIntent.status,
          },
        }).unwrap();

        toast.success("Payment successful — you're enrolled!");
        refetchUser();
        router.push(`/course/${courseId}/learn`);
      } catch (err: any) {
        // Payment succeeded on Stripe's side but order creation failed —
        // this is worth surfacing clearly since the charge already happened.
        setErrorMessage(
          err?.data?.message ||
            "Payment succeeded but enrollment failed. Contact support with your payment confirmation."
        );
      }
    } else {
      setErrorMessage("Payment did not complete. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />

      {errorMessage && (
        <p className="text-sm text-oxblood bg-oxblood/10 border border-oxblood/30 rounded-sm px-4 py-3">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="px-6 py-3 rounded-sm bg-ledger text-paper font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
      >
        {isProcessing ? "Processing…" : "Pay and enroll"}
      </button>
    </form>
  );
}
