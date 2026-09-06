import { baseApi } from "./baseApi";
import { Course } from "@/types/course";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<
      Course[],
      { search?: string; category?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/courses",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Course" as const, id })),
              { type: "Course", id: "LIST" },
            ]
          : [{ type: "Course", id: "LIST" }],
    }),
    getCourseById: builder.query<Course, string>({
      query: (id) => `/courses/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Course", id }],
    }),
    createCourse: builder.mutation<Course, Partial<Course>>({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
    updateCourse: builder.mutation<Course, { id: string; data: Partial<Course> }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Course", id },
        { type: "Course", id: "LIST" },
      ],
    }),
    deleteCourse: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
