"use client";
import Navbar from "@/components/shared/Navbar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  useBlogQuery,
  useCreateCommentMutation,
  useVotesMutation,
} from "@/redux/api/baseAPI";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { marked } from "marked";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const BlogDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { data: blog, isLoading } = useBlogQuery(params.id);
  const { data: session, status } = useSession();
  const [createComment, { error }] = useCreateCommentMutation();
  const [manageReaction, {}] = useVotesMutation();

  const handleReaction = (voteTypes) => {
    console.log(session?.user?.id, blog._id, voteTypes);
    manageReaction({ userID: session?.user?.id, blogID: blog._id, voteTypes });
  };

  console.log(blog?.upvotes, blog?.downvotes);

  const isUpvoted = blog?.upvotes.includes(session?.user?.id || "");
  const isDownvoted = blog?.downvotes.includes(session?.user?.id || "");

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const commentData = {
        content: data.comment,
        authorID: session.user.id,
        blogID: params.id,
      };
      const response = await createComment(commentData).unwrap();
      if (response) {
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screenn bg-bcakground">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Button>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-8">
              {/* Post Content */}
              <Card>
                <CardHeader className="space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={blog?.authorID?.image} />
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
                  <p
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(blog.content),
                    }}
                  />
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
                        onClick={() => handleReaction("upvotes")}
                        //   onClick={handleLike}
                        //   className={`flex items-center space-x-2 ${
                        //     post.isLiked ? "text-red-500" : ""
                        //   }`}
                      >
                        <ThumbsUp
                          className={`h-4 w-4 ${
                            isUpvoted ? "stroke-green-600" : ""
                          }`}
                        />
                        <span>{blog?.upvotes?.length}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction("downvotes")}
                        //   onClick={handleDislike}
                        //   className={`flex items-center space-x-2 ${
                        //     post.isDisliked ? "text-blue-500" : ""
                        //   }`}
                      >
                        <ThumbsDown
                          className={`h-4 w-4 ${
                            isDownvoted ? "stroke-red-600" : ""
                          }`}
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
              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">
                    Comments ({blog.comments.length})
                  </h3>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Textarea
                        {...register("comment", {
                          required:
                            "Comment is required. Please enter your message.",
                        })}
                        placeholder="Write a comment..."
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end">
                        <Button type="submit">
                          <Send className="mr-2 h-4 w-4" /> Post Comment
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    {/* Comment List */}
                    <div className="space-y-6">
                      {blog.comments.map((comment) => (
                        <div key={comment._id} className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={
                                  comment.authorID.image || "/placeholder.svg"
                                }
                              ></AvatarImage>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {comment.authorID.name}
                                </span>
                              </div>
                              <p className="text-mutated-foreground leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div></div>
                  </CardContent>
                </form>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default BlogDetails;
