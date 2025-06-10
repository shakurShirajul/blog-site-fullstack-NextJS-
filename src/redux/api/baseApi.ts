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
