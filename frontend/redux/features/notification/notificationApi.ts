import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: () => ({
        url: "get-all-notifications",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Notifications"],
    }),

    updateNotification: builder.mutation({
      query: (id: string) => ({
        url: `update-notification/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetAllNotificationsQuery, useUpdateNotificationMutation } =
  notificationApi;
