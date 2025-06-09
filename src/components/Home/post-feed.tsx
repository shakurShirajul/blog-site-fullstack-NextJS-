"use client";

import { useGetPostsQuery } from "@/redux/api/baseApi";
import PostCard from "./post-card";
import { IBlog } from "@/models/Blog";

const PostFeed = () => {
  const { data: blogs, isLoading } = useGetPostsQuery();
  if (!isLoading && blogs) {
    console.log(blogs);
  }
  return (
    <div>
      {isLoading ? (
        <div>Loading....</div>
      ) : (
        <div>
          {blogs?.map((blog) => (
            <PostCard key={String(blog._id)} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};
export default PostFeed;
