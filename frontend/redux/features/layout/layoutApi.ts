import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLayout: builder.query({
      query: (type: string) => ({
        url: `get-layout/${type}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Layout"],
    }),

    createLayout: builder.mutation({
      query: (data) => ({
        url: "create-layout",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Layout"],
    }),

    editLayout: builder.mutation({
      query: (data) => ({
        url: "edit-layout",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Layout"],
    }),
  }),
});

export const {
  useGetLayoutQuery,
  useCreateLayoutMutation,
  useEditLayoutMutation,
} = layoutApi;
