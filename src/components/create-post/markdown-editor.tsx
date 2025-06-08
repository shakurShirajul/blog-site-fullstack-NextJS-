"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bold, Italic, Link, List, Quote, Code } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState("write");

  const insertMarkdown = (syntax: string, placeholder = "") => {
    const textarea = document.querySelector(
      'textarea[data-markdown="true"]'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = selectedText || placeholder;

    let newText = "";
    switch (syntax) {
      case "bold":
        newText = `**${replacement}**`;
        break;
      case "italic":
        newText = `*${replacement}*`;
        break;
      case "link":
        newText = `[${replacement || "link text"}](url)`;
        break;
      case "list":
        newText = `\n- ${replacement || "list item"}`;
        break;
      case "quote":
        newText = `\n> ${replacement || "quote"}`;
        break;
      case "code":
        newText = `\`${replacement || "code"}\``;
        break;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const renderMarkdownPreview = (text: string) => {
    // Simple markdown rendering for preview
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
      .replace(/^- (.*$)/gm, "<li>$1</li>")
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {activeTab === "write" && (
            <div className="flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("bold", "bold text")}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("italic", "italic text")}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("link")}
                title="Link"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("list")}
                title="List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("quote")}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("code")}
                title="Code"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-4">
          <Textarea
            data-markdown="true"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] resize-none font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="min-h-[400px] rounded-md border p-4 bg-muted/50">
            {value ? (
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownPreview(value),
                }}
              />
            ) : (
              <p className="text-muted-foreground italic">
                Nothing to preview yet. Start writing in the Write tab.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
