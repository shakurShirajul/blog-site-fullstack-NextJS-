"use client";
import BlogAssistantGemini from "../../../components/ai/blog-assistant-gemini";
import MarkdownEditor from "../../../components/create-blog/markdown-editor";
import TagInput from "../../../components/create-blog/tag-input";
import Navbar from "../../../components/shared/Navbar";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  useBlogQuery,
  useCreateBlogMutation,
} from "../../../redux/api/baseAPI";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const CreateBlog = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      tags: [],
      content: "",
    },
  });

  // Redux Code
  const { response } = useSelector((state) => state.gemini);
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const { refetch } = useBlogQuery();

  const onSubmit = async (data) => {
    try {
      const postData = {
        title: data.title,
        tags: data.tags,
        content: data.content,
        authorID: session?.user.id,
      };
      const response = await createBlog(postData).unwrap();
      if (response) {
        reset(); // Reset form on success
        refetch();
        router.push("/"); // or redirect to blog page
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInsertAiContent = (content) => {
    const currentContent = getValues("content") || "";
    const newContent =
      currentContent + (currentContent ? "\n\n" : "") + content;
    setValue("content", newContent);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Create a New Blog
                </h1>
                <p className="text-muted-foreground">
                  Share your thoughts with the community
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-8 lg:grid-cols-4"
          >
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Title */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Title</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="sr-only">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter your post title..."
                      type="text"
                      {...register("title", {
                        required: "Title is Required",
                      })}
                      className={errors.title ? "border-red-500" : ""}
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>A compelling title helps attract readers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="sr-only">
                      Tags
                    </Label>
                    <Controller
                      name="tags"
                      control={control}
                      rules={{
                        validate: (value) => {
                          if (!value || value.length === 0) {
                            return "At least one tag is required";
                          } else if (value.length > 5) {
                            return "You can use a maximum of 5 tags";
                          }
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add tags to help people discover your post..."
                        />
                      )}
                    />
                    {errors.tags && (
                      <p className="text-sm text-red-500">
                        {errors.tags.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Body */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Post Content</CardTitle>
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setShowAiAssistant(!showAiAssistant)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Gemini AI Assistant
                  </Button>
                </CardHeader>
                {/* <CardDescription className="px-6">
                  Write your post using Markdown. You can use the toolbar or
                  keyboard shortcuts for formatting.
                </CardDescription> */}
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="sr-only">
                      Post Content
                    </Label>
                    <Controller
                      name="content"
                      control={control}
                      rules={{
                        required: "Post content is required",
                        minLength: {
                          value: 50,
                          message:
                            "Post content must be at least 50 characters long",
                        },
                      }}
                      render={({ field }) => (
                        <MarkdownEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Write your post using Markdown. You can use the toolbar or keyboard shortcuts for formatting."
                        />
                      )}
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500">
                        {errors.content.message}
                      </p>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Supports Markdown syntax for rich formatting</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    <Send className="mr-2 h-4 w-4" />
                    {isLoading ? "Posting..." : "Post"}
                  </Button>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Tips:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Use descriptive titles</li>
                      <li>Add relevant tags</li>
                      <li>Format with Markdown</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </main>

      {/* AI Assistant */}
      {showAiAssistant && (
        <BlogAssistantGemini
          onInsertContent={handleInsertAiContent}
          currentContent={watch("content")}
        />
      )}
    </div>
  );
};

export default CreateBlog;
