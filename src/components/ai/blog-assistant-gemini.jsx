"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2, Send, Lightbulb, Wand2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useGenerateContentMutation } from "@/redux/api/baseAPI";
import { useDispatch, useSelector } from "react-redux";
import {
  setGeminiError,
  setGeneratedContent,
} from "@/redux/features/geminiSlice";
// import { useToast } from "@/hooks/use-toast";

const BlogAssistantGemini = ({ onInsertContent, currentContent = "" }) => {
  //   const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generate");
  const [isOpen, setIsOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  //   Redux Code
  const { response, loading, error } = useSelector((state) => state.gemini);
  const [setPrompt, {}] = useGenerateContentMutation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    // watch,
    // control,
    // setValue,
    // getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsGenerating(true);
    try {
      const { prompt } = data;
      const response = await setPrompt({ prompt }).unwrap();
      if (response) {
        console.log("This is AI", response);
        dispatch(setGeneratedContent(response.text));
        onInsertContent(response.text);
      }
    } catch (error) {
      dispatch(setGeminiError(error));
    } finally {
      setIsGenerating(false);
    }
  };

  //   const handleInsertContent = () => {
  //     // if (completion) {
  //     onInsertContent(completion);
  //     //   toast({
  //     //     title: "Content inserted",
  //     //     description: "AI-generated content has been added to your post",
  //     //   });
  //     setIsOpen(false);
  //     // }
  //   };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="fixed bottom-6 right-6 flex items-center gap-2 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="h-4 w-4" />
        Gemini AI Assistant
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[400px] shadow-xl z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Gemini AI Assistant</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Get AI help with writing and improving your blog content
        </CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="generate" className="text-xs">
              <Wand2 className="h-3.5 w-3.5 mr-1" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="improve" className="text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Improve
            </TabsTrigger>
            <TabsTrigger value="ideas" className="text-xs">
              <Lightbulb className="h-3.5 w-3.5 mr-1" />
              Ideas
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="space-y-4 pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* <div className="space-y-2">
              <div className="text-sm font-medium">Prompt Templates</div>
              <div className="flex flex-wrap gap-2">
                {generatePromptTemplates[activeTab]
                  .slice(0, 3)
                  .map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => handleUseTemplate(template)}
                      type="button"
                    >
                      {template.length > 25
                        ? template.substring(0, 25) + "..."
                        : template}
                    </Button>
                  ))}
              </div>
            </div> */}

            {/* Prompt Input  */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="prompt" className="text-sm font-medium">
                  Your Prompt
                </Label>
                {activeTab === "improve" && currentContent && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleImproveContent}
                  >
                    Use Current Content
                  </Button>
                )}
              </div>
              <Textarea
                id="prompt"
                placeholder={`What would you like to ${
                  activeTab === "generate"
                    ? "write"
                    : activeTab === "improve"
                    ? "improve"
                    : "get ideas for"
                }?`}
                {...register("prompt", {
                  required: "Prompt Field Can Be Empty...",
                })}
                // value={input}
                // onChange={handleInputChange}
                className="min-h-[100px] resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              //   disabled={!input.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </form>

          {response && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Generated Content</div>
              <div className="border rounded-md p-3 bg-muted/50 text-sm max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                {response}
              </div>
              {/* <Button onClick={handleInsertContent} className="w-full">
                Insert into Editor
              </Button> */}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500 p-2 border border-red-200 rounded bg-red-50">
              Error:{" "}
              {error.message || "Something went wrong. Please try again."}
            </div>
          )}
        </CardContent>
      </Tabs>

      <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
        <div>Powered by Google Gemini AI</div>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
          <a
            href="https://ai.google.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default BlogAssistantGemini;
function Label({ htmlFor, className, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
        className || ""
      }`}
    >
      {children}
    </label>
  );
}
