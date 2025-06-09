"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetPostQuery } from "@/redux/api/baseApi";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  ThumbsDown,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const PostDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { data: blog, isLoading } = useGetPostQuery(params.id as string);
  return (
    <div>
      {isLoading ? (
        <div>Loading....</div>
      ) : (
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 py-8">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feed
            </Button>
            {/* Post Content */}
            <Card>
              <CardHeader className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={blog.authorID.image || "placeholder.svg"}
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{blog?.authorID?.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {/* <span>@{blog.authorID.username}</span> */}
                      <span>•</span>
                      <span>{blog.updatedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold leading-tight">
                  {blog.title}
                </h1>
                <div className="">{blog.content}</div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {blog?.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Post Content */}
                <div className="">{blog?.post}</div>

                {/* Engagement Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      //   onClick={handleLike}
                      //   className={`flex items-center space-x-2 ${
                      //     post.isLiked ? "text-red-500" : ""
                      //   }`}
                    >
                      <Heart
                      // className={`h-5 w-5 ${post.isLiked ? "fill-current" : ""}`}
                      />
                      <span>{blog?.upvotes?.length}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      //   onClick={handleDislike}
                      //   className={`flex items-center space-x-2 ${
                      //     post.isDisliked ? "text-blue-500" : ""
                      //   }`}
                    >
                      <ThumbsDown
                      // className={`h-5 w-5 ${
                      //   post.isDisliked ? "fill-current" : ""
                      // }`}
                      />
                      <span>{blog?.downvotes?.length}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>{blog?.comments?.length}</span>
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button> */}
                    <Button
                      variant="ghost"
                      size="sm"
                      //   onClick={handleBookmark}
                      //   className={post.isBookmarked ? "text-yellow-500" : ""}
                    >
                      <Bookmark
                      // className={`h-4 w-4 ${
                      //   post.isBookmarked ? "fill-current" : ""
                      // }`}
                      />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      )}
    </div>
  );
};
export default PostDetails;
