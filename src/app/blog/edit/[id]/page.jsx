"use client";
import BlogAssistantGemini from "../../../../components/ai/blog-assistant-gemini";
import MarkdownEditor from "../../../../components/create-blog/markdown-editor";
import TagInput from "../../../../components/create-blog/tag-input";
import Navbar from "../../../../components/shared/Navbar";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  useBlogQuery,
  useUpdateBlogMutation,
} from "../../../../redux/api/baseAPI";
import { ArrowLeft, Edit3, FileText, Send, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const EditBlog = () => {
  const params = useParams();
  const router = useRouter();

  const { data: blog, isLoading } = useBlogQuery(params.id);
  const { data: session, status } = useSession();
  const [updateBlog, { isLoading: isUpdateBlogLoading }] =
    useUpdateBlogMutation();
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
      title: blog?.title,
      tags: blog?.tags,
      content: "",
    },
  });

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title || "",
        tags: blog.tags || [],
        content: blog.content || "",
      });
    }
  }, [blog, reset]);

  const onSubmit = async (data) => {
    try {
      const updateData = {
        title: data.title,
        tags: data.tags,
        content: data.content,
        authorID: session?.user?.id,
        blogID: params.id,
      };
      const response = await updateBlog(updateData).unwrap();
      if (response) {
        reset(); // Reset form on success
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
                <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
                  <Edit3 className="h-8 w-8" />
                  <span>Edit Post</span>
                </h1>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-8 lg:grid-cols-4"
          >
            <div className="lg:col-span-3 space-y-6">
              {/* Title */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Post Title</span>
                  </CardTitle>
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
                      // defaultValue={blog?.title}
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

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isUpdateBlogLoading}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isUpdateBlogLoading ? "Updating..." : "Update Post"}
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
export default EditBlog;
