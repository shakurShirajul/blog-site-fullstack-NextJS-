"use client";

import { useState } from "react";

import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Bold, Italic, Link, List, Quote, Code } from "lucide-react";

export default function MarkdownEditor({ value, onChange, placeholder }) {
  const [activeTab, setActiveTab] = useState("write");

  const insertMarkdown = (syntax, placeholder = "") => {
    const textarea = document.querySelector('textarea[data-markdown="true"]');
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
      case "strikethrough":
        newText = `~~${replacement}~~`;
        break;
      case "h1":
        newText = `# ${replacement}`;
        break;
      case "h2":
        newText = `## ${replacement}`;
        break;
      case "h3":
        newText = `### ${replacement}`;
        break;
      case "link":
        newText = `[${replacement || "link text"}](url)`;
        break;
      case "image":
        newText = `![${replacement || "alt text"}](url)`;
        break;
      case "list":
        newText = `\n- ${replacement || "list item"}`;
        break;
      case "ordered-list":
        newText = `\n1. ${replacement || "list item"}`;
        break;
      case "hr":
        newText = `\n---\n`;
        break;
      case "quote":
        newText = `\n> ${replacement || "quote"}`;
        break;
      case "code":
        newText = `\`${replacement || "code"}\``;
        break;
      case "codeblock":
        newText = `\n\`\`\`\n${replacement || "code block"}\n\`\`\`\n`;
        break;
      default:
        newText = replacement;
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

  const renderMarkdownPreview = (text) => {
    // Handle code blocks first to avoid interfering with other replacements
    text = text.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

    // Headings
    text = text
      .replace(/^### (.*)$/gim, "<h3>$1</h3>")
      .replace(/^## (.*)$/gim, "<h2>$1</h2>")
      .replace(/^# (.*)$/gim, "<h1>$1</h1>");

    // Bold, Italic, Strikethrough
    text = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>");

    // Inline code
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Blockquote
    text = text.replace(/^> (.*)$/gim, "<blockquote>$1</blockquote>");

    // Images
    text = text.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img alt="$1" src="$2" />'
    );

    // Links
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Ordered lists (group consecutive items)
    text = text.replace(
      /((?:^\d+\.\s+.*$\n?)+)/gim,
      (match) =>
        "<ol>" +
        match
          .trim()
          .split(/\n/)
          .map((item) => item.replace(/^\d+\.\s+/, "<li>") + "</li>")
          .join("") +
        "</ol>"
    );

    // Unordered lists (group consecutive items)
    text = text.replace(
      /((?:^- .*$\n?)+)/gim,
      (match) =>
        "<ul>" +
        match
          .trim()
          .split(/\n/)
          .map((item) => item.replace(/^- /, "<li>") + "</li>")
          .join("") +
        "</ul>"
    );

    // Horizontal rule
    text = text.replace(/^\s*---\s*$/gim, "<hr />");

    // Line breaks
    text = text.replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>");

    return text;
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("h1", "Heading 1")}
                title="Heading 1"
              >
                H1
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("h2", "Heading 2")}
                title="Heading 2"
              >
                H2
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("h3", "Heading 3")}
                title="Heading 3"
              >
                H3
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("strikethrough", "strikethrough")}
                title="Strikethrough"
              >
                <s>S</s>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("ordered-list", "list item")}
                title="Ordered List"
              >
                OL
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("image", "alt text")}
                title="Image"
              >
                🖼️
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("hr")}
                title="Horizontal Rule"
              >
                ―
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("codeblock", "code block")}
                title="Code Block"
              >{`</>`}</Button>
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
