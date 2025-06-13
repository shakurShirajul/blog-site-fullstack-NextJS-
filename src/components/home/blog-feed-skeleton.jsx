import { Skeleton } from "../ui/skeleton";

const BlogFeedSkeleton = () => (
  <div className="min-h-screen w-full flex flex-col gap-8 py-8">
    {[...Array(4)].map((_, idx) => (
      <div
        key={idx}
        className="w-full max-w-3xl mx-auto cursor-pointer transition-shadow bg-card rounded-xl p-6"
      >
        <div className="pb-3">
          <div className="flex items-start space-x-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2 mt-2">
            <Skeleton className="h-6 rounded" />
            <Skeleton className="h-6 rounded" />
            <Skeleton className="h-6 rounded" />
          </div>
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default BlogFeedSkeleton;
