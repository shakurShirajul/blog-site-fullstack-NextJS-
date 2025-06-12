"use client";
import { useBlogsQuery } from "@/redux/api/baseAPI";
import BlogCard from "./blog-card";

const PostFeed = () => {
  const { data: blogs, isLoading } = useBlogsQuery();
  console.log(blogs);
  return (
    <div>
      {isLoading ? (
        <div>Loading....</div>
      ) : (
        <div>
          {blogs?.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};
export default PostFeed;
