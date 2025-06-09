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
        // console.log("Post data:", postData),
      }),
    }),
    getPost: builder.query({
      query: () => `/posts`,
    }),
    getPosts: builder.query({
      query: (id: string) => `/postst/${id}`,
    }),
  }),
});
export const {
  useSignupMutation,
  useCreatePostMutation,
  useGetPostQuery,
  useGetPostsQuery,
} = baseApi;
