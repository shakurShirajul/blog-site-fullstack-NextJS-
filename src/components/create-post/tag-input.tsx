"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export default function TagInput({
  tags,
  onChange,
  suggestions = [],
  placeholder,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default tag suggestions
  const defaultSuggestions = [
    "react",
    "javascript",
    "typescript",
    "nextjs",
    "tailwind",
    "css",
    "html",
    "nodejs",
    "python",
    "webdev",
    "frontend",
    "backend",
    "fullstack",
    "api",
    "database",
    "mongodb",
    "postgresql",
    "mysql",
    "aws",
    "docker",
    "kubernetes",
    "devops",
    "git",
    "github",
    "opensource",
    "tutorial",
    "beginners",
    "advanced",
    "tips",
    "tricks",
  ];

  const allSuggestions = [...suggestions, ...defaultSuggestions];

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allSuggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(suggestion.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [inputValue, tags]); // Removed allSuggestions from the dependency array

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      onChange([...tags, trimmedTag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              #{tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              inputValue && setShowSuggestions(filteredSuggestions.length > 0)
            }
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="border-none shadow-none focus-visible:ring-0 flex-1 min-w-[120px] p-0"
            disabled={tags.length >= 10}
          />
        </div>

        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                #{suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Press Enter or comma to add tags</span>
        <span>{tags.length}/10 tags</span>
      </div>
    </div>
  );
}
