import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Bookmark, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useVotesMutation } from "@/redux/api/baseAPI";
import { useSession } from "next-auth/react";
import { marked } from "marked";

const BlogCard = ({ blog }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const handleCardClick = (event) => {
    const target = event.target;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    if (blog?._id) {
      router.push(`/blog/${blog._id}`);
    } else {
      console.warn("blog._id is undefined");
    }
  };
  const [manageReaction, { isLoading, error }] = useVotesMutation();

  const handleReaction = (voteTypes) => {
    manageReaction({ userID: session?.user?.id, blogID: blog._id, voteTypes });
  };

  const isUpvoted = blog.upvotes.includes(session?.user?.id || "");
  const isDownvoted = blog.downvotes.includes(session?.user?.id || "");

  return (
    <Card
      className="w-full cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10 rounded-full">
            <AvatarImage src={blog.authorID.image} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold">{blog.authorID.name}</h4>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {blog.updatedAt}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold leading-tight hover:text-primary transition-colors">
          {blog.title}
        </h3>
        <p
          className="text-muted-foreground leading-relaxed line-clamp-3"
          dangerouslySetInnerHTML={{ __html: marked.parse(blog.content) }}
        />
        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        {/* Engagement Stats and Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2`}
              onClick={() => handleReaction("upvotes")}
            >
              <ThumbsUp
                className={`h-4 w-4 ${isUpvoted ? "stroke-green-600" : ""}`}
              />
              <span>{blog?.upvotes?.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 `}
              onClick={() => handleReaction("downvotes")}
            >
              <ThumbsDown
                className={`h-4 w-4 ${isDownvoted ? "stroke-red-600" : ""}`}
              />
              <span>{blog?.downvotes?.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{blog.comments.length}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            // onClick={(e) => handleActionClick(e, () => onBookmark(post.id))}
            // className={post.isBookmarked ? "text-yellow-500" : ""}
          >
            <Bookmark
            //   className={`h-4 w-4 ${post.isBookmarked ? "fill-current" : ""}`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default BlogCard;
