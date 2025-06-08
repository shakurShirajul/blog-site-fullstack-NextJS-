"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/create-post/markdown-editor";
import TagInput from "@/components/create-post/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Eye, Send, ArrowLeft } from "lucide-react";

interface PostData {
  title: string;
  tags: string[] | string;
  body: string;
}

export default function CreatePost() {
  const router = useRouter();
  const [postData, setPostData] = useState<PostData>({
    title: "",
    tags: [],
    body: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<PostData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<PostData> = {};

    if (!postData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (postData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    } else if (postData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (postData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    if (!postData.body.trim()) {
      newErrors.body = "Post content is required";
    } else if (postData.body.length < 50) {
      newErrors.body = "Post content must be at least 50 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSaveDraft = async () => {
  //   setIsSubmitting(true);
  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     toast({
  //       title: "Draft saved",
  //       description: "Your post has been saved as a draft.",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to save draft. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handlePreview = () => {
  //   if (!validateForm()) {
  //     toast({
  //       title: "Validation Error",
  //       description: "Please fix the errors before previewing.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
  //   // Here you could open a preview modal or navigate to a preview page
  //   toast({
  //     title: "Preview",
  //     description: "Preview functionality would open here.",
  //   });
  // };

  const handlePublish = async () => {
    // if (!validateForm()) {
    //   toast({
    //     title: "Validation Error",
    //     description: "Please fix all errors before publishing.",
    //     variant: "destructive",
    //   });
    //   return;
    // }
    // setIsSubmitting(true);
    // try {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    //   toast({
    //     title: "Post published!",
    //     description: "Your post has been published successfully.",
    //   });
    //   router.push("/");
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to publish post. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }
    console.log("Post data submitted:", postData);
  };

  return (
    <div className="min-h-screen bg-background">
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
                  Create a New Post
                </h1>
                <p className="text-muted-foreground">
                  Share your thoughts with the community
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
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
                      value={postData.title}
                      onChange={(e) =>
                        setPostData({ ...postData, title: e.target.value })
                      }
                      className={errors.title ? "border-red-500" : ""}
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>A compelling title helps attract readers</span>
                      <span>{postData.title.length}/100</span>
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
                    <TagInput
                      tags={postData.tags}
                      onChange={(tags) => setPostData({ ...postData, tags })}
                      placeholder="Add tags to help people discover your post..."
                    />
                    {errors.tags && (
                      <p className="text-sm text-red-500">{errors.tags}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Body */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="body" className="sr-only">
                      Post Content
                    </Label>
                    <MarkdownEditor
                      value={postData.body}
                      onChange={(body) => setPostData({ ...postData, body })}
                      placeholder="Write your post content here... You can use Markdown syntax for formatting."
                    />
                    {errors.body && (
                      <p className="text-sm text-red-500">{errors.body}</p>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Supports Markdown syntax for rich formatting</span>
                      <span>{postData.body.length} characters</span>
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
                  {/* <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handlePreview}
                    disabled={isSubmitting}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button> */}

                  <Separator />

                  <Button
                    className="w-full"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Publishing..." : "Publish Post"}
                  </Button>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Tips:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Use descriptive titles</li>
                      <li>Add relevant tags</li>
                      <li>Format with Markdown</li>
                      <li>Save drafts frequently</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
