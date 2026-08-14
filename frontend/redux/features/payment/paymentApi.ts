import { apiSlice } from "../api/apiSlice";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStripePublishableKey: builder.query({
      query: () => ({
        url: "payment/stripe-publishable-key",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // courseId travels alongside the amount so the backend can attach it
    // (plus the logged-in user's id) as metadata on the Stripe payment
    // intent — that's what lets the webhook know which course to grant
    // access to once the payment succeeds.
    createPaymentIntent: builder.mutation({
      query: ({ amount, courseId }: { amount: number; courseId: string }) => ({
        url: "payment",
        method: "POST",
        body: { amount, courseId },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetStripePublishableKeyQuery,
  useCreatePaymentIntentMutation,
} = paymentApi;
