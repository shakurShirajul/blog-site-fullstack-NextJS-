import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const baseAPI = createApi({
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
    createBlog: builder.mutation({
      query: (postData) => ({
        url: "/create-blog",
        method: "POST",
        body: postData,
      }),
    }),
    blogs: builder.query({
      query: () => `/blogs`,
    }),
    blog: builder.query({
      query: (id) => `/blogs/${id}`,
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
          baseAPI.util.updateQueryData("blogs", undefined, (draft) => {
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
    createComment: builder.mutation({
      query: (commentData) => ({
        url: "/comments/create",
        method: "POST",
        body: commentData,
      }),
    }),
    generateContent: builder.mutation({
      query: (prompt) => ({
        url: "/ai/generate-gemini",
        method: "POST",
        body: prompt,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});
export const {
  useSignupMutation,
  useCreateBlogMutation,
  useBlogsQuery,
  useBlogQuery,
  useVotesMutation,
  useCreateCommentMutation,
  useGenerateContentMutation,
} = baseAPI;
