"use client";

import StatsCards from "@/components/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const mockPosts = [
    {
      id: "1",
      title: "Getting Started with Next.js 14",
      excerpt:
        "Learn how to build modern web applications with the latest features of Next.js including App Router and Server Components.",
      publishedAt: "2024-01-15",
      status: "published" as const,
      reactions: 89,
      comments: 23,
      views: 1205,
    },
    {
      id: "2",
      title: "Building Responsive UIs with Tailwind CSS",
      excerpt:
        "A comprehensive guide to creating beautiful and responsive user interfaces using Tailwind CSS utility classes.",
      publishedAt: "2024-01-10",
      status: "published" as const,
      reactions: 156,
      comments: 34,
      views: 2340,
    },
    {
      id: "3",
      title: "Advanced React Patterns",
      excerpt:
        "Explore advanced React patterns including compound components, render props, and custom hooks for better code organization.",
      publishedAt: "2024-01-05",
      status: "draft" as const,
      reactions: 0,
      comments: 0,
      views: 0,
    },
    {
      id: "4",
      title: "Database Design Best Practices",
      excerpt:
        "Learn essential database design principles and best practices for building scalable applications.",
      publishedAt: "2023-12-28",
      status: "published" as const,
      reactions: 203,
      comments: 45,
      views: 3456,
    },
  ];
  return (
    <div>
      <main className="">
        {/* Route Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome Back! Here's an overview of your content performence.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </div>
        <StatsCards stats={mockPosts} />
      </main>
    </div>
  );
};
export default Dashboard;
