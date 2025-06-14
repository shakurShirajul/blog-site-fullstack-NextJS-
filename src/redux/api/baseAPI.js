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
        url: "/blog/create",
        method: "POST",
        body: postData,
      }),
    }),
    blogs: builder.query({
      query: () => `/blog`,
    }),
    blog: builder.query({
      query: (id) => `/blog/${id}`,
    }),
    deleteBlog: builder.mutation({
      query: (deleteData) => ({
        url: "/blog/delete",
        method: "DELETE",
        body: deleteData,
      }),
      async onQueryStarted(deleteData, { dispatch, queryFulfilled }) {
        // Optimistically remove the blog from the blogs list
        const patchBlogs = dispatch(
          baseAPI.util.updateQueryData("blogs", undefined, (draft) => {
            return draft.filter((blog) => blog._id !== deleteData.blogID);
          })
        );
        // Optionally, remove the single blog cache
        const patchBlog = dispatch(
          baseAPI.util.updateQueryData("blog", deleteData.blogID, (draft) => {
            return undefined;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchBlogs.undo();
          patchBlog.undo();
        }
      },
    }),
    updateBlog: builder.mutation({
      query: (updateData) => ({
        url: "/blog/update",
        method: "PATCH",
        body: updateData,
      }),
      async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
        // Optimistically update the single blog cache
        const patchBlog = dispatch(
          baseAPI.util.updateQueryData("blog", updateData.blogID, (draft) => {
            if (!draft) return;
            draft.title = updateData.title;
            draft.tags = updateData.tags;
            draft.content = updateData.content;
            draft.updatedAt = new Date().toISOString();
          })
        );
        // Optimistically update the blogs list cache
        const patchBlogs = dispatch(
          baseAPI.util.updateQueryData("blogs", undefined, (draft) => {
            const blog = draft.find((b) => b._id === updateData.blogID);
            if (!blog) return;
            blog.title = updateData.title;
            blog.tags = updateData.tags;
            blog.content = updateData.content;
            blog.updatedAt = new Date().toISOString();
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchBlog.undo();
          patchBlogs.undo();
        }
      },
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
          baseAPI.util.updateQueryData("blog", undefined, (draft) => {
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
        const patchBlog = dispatch(
          baseAPI.util.updateQueryData("blog", blogID, (draft) => {
            if (!draft) return;
            const alreadyUpvoted = draft.upvotes.includes(userID);
            const alreadyDownvoted = draft.downvotes.includes(userID);
            if (voteTypes === "upvotes") {
              if (alreadyUpvoted) {
                draft.upvotes = draft.upvotes.filter((id) => id !== userID);
              } else {
                draft.upvotes.push(userID);
                draft.downvotes = draft.downvotes.filter((id) => id !== userID);
              }
            } else if (voteTypes === "downvotes") {
              if (alreadyDownvoted) {
                draft.downvotes = draft.downvotes.filter((id) => id !== userID);
              } else {
                draft.downvotes.push(userID);
                draft.upvotes = draft.upvotes.filter((id) => id !== userID);
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          patchBlog.undo();
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
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} = baseAPI;
