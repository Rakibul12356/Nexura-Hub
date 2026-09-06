import { baseApi } from "./baseApi";

export interface DiscussionThread {
  id: string;
  lessonId: string;
  userName: string;
  userAvatar: string;
  userRole: "student" | "instructor" | "admin";
  content: string;
  createdAt: string;
  upvotes: number;
  replies: DiscussionThread[];
}

export const discussionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscussionsByLesson: builder.query<DiscussionThread[], string>({
      query: (lessonId) => `/discussions/lesson/${lessonId}`,
      providesTags: (result, _error, lessonId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Discussion" as const, id })),
              { type: "Discussion", id: `LESSON_${lessonId}` },
            ]
          : [{ type: "Discussion", id: `LESSON_${lessonId}` }],
    }),
    postQuestion: builder.mutation<
      DiscussionThread,
      { lessonId: string; content: string }
    >({
      query: (body) => ({
        url: "/discussions",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: "Discussion", id: `LESSON_${lessonId}` },
      ],
    }),
    postReply: builder.mutation<
      DiscussionThread,
      { threadId: string; lessonId: string; content: string }
    >({
      query: ({ threadId, content }) => ({
        url: `/discussions/${threadId}/reply`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: "Discussion", id: `LESSON_${lessonId}` },
      ],
    }),
    upvoteThread: builder.mutation<
      { success: boolean },
      { threadId: string; lessonId: string }
    >({
      query: ({ threadId }) => ({
        url: `/discussions/${threadId}/upvote`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: "Discussion", id: `LESSON_${lessonId}` },
      ],
    }),
  }),
});

export const {
  useGetDiscussionsByLessonQuery,
  usePostQuestionMutation,
  usePostReplyMutation,
  useUpvoteThreadMutation,
} = discussionApi;
