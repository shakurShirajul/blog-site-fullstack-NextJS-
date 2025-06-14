"use client";
import { useBlogsQuery } from "@/redux/api/baseAPI";
import { Skeleton } from "../ui/skeleton";
import BlogCard from "./blog-card";
import BlogSkeleton from "../shared/blog-skeleton";

const PostFeed = () => {
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
export default PostFeed;
