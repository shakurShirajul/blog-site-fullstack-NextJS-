"use client";
import { useBlogsQuery } from "../../redux/api/baseAPI";
import BlogCard from "./BlogCard";
import BlogSkeleton from "../shared/blog-skeleton";

const BlogFeed = () => {
  const { data: blogs, isLoading } = useBlogsQuery();
  return (
    <div className="w-full">
      {isLoading ? (
        <BlogSkeleton />
      ) : (
        <div className="space-y-6">
          {blogs?.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};
export default BlogFeed;
