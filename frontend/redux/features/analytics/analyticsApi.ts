import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserAnalytics: builder.query({
      query: () => ({
        url: "admin/user-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Analytics"],
    }),

    getCourseAnalytics: builder.query({
      query: () => ({
        url: "admin/course-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Analytics"],
    }),

    getOrderAnalytics: builder.query({
      query: () => ({
        url: "admin/order-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetUserAnalyticsQuery,
  useGetCourseAnalyticsQuery,
  useGetOrderAnalyticsQuery,
} = analyticsApi;
