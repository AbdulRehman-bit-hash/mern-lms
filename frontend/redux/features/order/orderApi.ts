import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: ({ courseId, payment_info }) => ({
        url: "create-order",
        method: "POST",
        body: { courseId, payment_info },
        credentials: "include" as const,
      }),
      // A new order affects the course's purchase count, the order list,
      // and every analytics chart derived from orders — invalidating all
      // three keeps the admin dashboard honest after a purchase.
      invalidatesTags: ["Courses", "Orders", "Analytics"],
    }),

    getUserOrders: builder.query({
      query: () => ({
        url: "my-orders",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Orders"],
    }),

    getAllOrders: builder.query({
      query: () => ({
        url: "admin/get-orders",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
} = orderApi;
