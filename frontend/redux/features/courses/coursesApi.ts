import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "../auth/authSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    getAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Courses"],
    }),

    getAdminAllCourses: builder.query({
      query: () => ({
        url: "admin/get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Courses"],
    }),

    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    deleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `admin/delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    getCourseDetails: builder.query({
      query: (id: string) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getCourseContent: builder.query({
      query: (id: string) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    addQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: "add-question",
        method: "PUT",
        body: { question, courseId, contentId },
        credentials: "include" as const,
      }),
    }),

    addAnswer: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: "add-answer",
        method: "PUT",
        body: { answer, courseId, contentId, questionId },
        credentials: "include" as const,
      }),
    }),

    addReview: builder.mutation({
      query: ({ review, rating, courseId }) => ({
        url: `add-review/${courseId}`,
        method: "PUT",
        body: { review, rating },
        credentials: "include" as const,
      }),
    }),

    markLessonComplete: builder.mutation({
      query: ({ courseId, contentId }) => ({
        url: "course-progress",
        method: "PUT",
        body: { courseId, contentId },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          const state: any = getState();
          dispatch(
            userLoggedIn({
              accessToken: state.auth.token,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetAdminAllCoursesQuery,
  useEditCourseMutation,
  useDeleteCourseMutation,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddQuestionMutation,
  useAddAnswerMutation,
  useAddReviewMutation,
  useMarkLessonCompleteMutation,
} = coursesApi;
