import PostFeed from "@/components/Home/post-feed";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between">
          <PostFeed />
        </div>
      </main>
    </div>
  );
}
