import { IBlog } from "@/models/Blog";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/createpost",
        method: "POST",
        body: postData,
      }),
    }),
    getPosts: builder.query<IBlog[], void>({
      query: () => `/posts`,
    }),
    getPost: builder.query<IBlog, string>({
      query: (id: string) => `/posts/${id}`,
    }),
    votes: builder.mutation({
      query: (reactionData) => ({
        url: "/votes",
        method: "POST",
        body: reactionData,
      }),
      async onQueryStarted(
        { blogID, userID, voteTypes },
        { dispatch, queryFulfilled }
      ) {
        // Optimistically update the blog cache
        const patchResult = dispatch(
          baseApi.util.updateQueryData("getPosts", undefined, (draft) => {
            const blog = draft.find((b) => b._id === blogID);
            if (!blog) return;

            const alreadyUpvoted = blog.upvotes.includes(userID);
            const alreadyDownvoted = blog.downvotes.includes(userID);

            if (voteTypes === "upvotes") {
              if (alreadyUpvoted) {
                blog.upvotes = blog.upvotes.filter((id) => id !== userID);
              } else {
                blog.upvotes.push(userID);
                blog.downvotes = blog.downvotes.filter((id) => id !== userID);
              }
            } else if (voteTypes === "downvotes") {
              if (alreadyDownvoted) {
                blog.downvotes = blog.downvotes.filter((id) => id !== userID);
              } else {
                blog.downvotes.push(userID);
                blog.upvotes = blog.upvotes.filter((id) => id !== userID);
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});
export const {
  useSignupMutation,
  useCreatePostMutation,
  useGetPostsQuery,
  useGetPostQuery,
  useVotesMutation,
} = baseApi;
