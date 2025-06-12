import BlogFeed from "@/components/home/blog-feed";
import Navbar from "@/components/shared/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between">
          <BlogFeed />
        </div>
      </main>
    </div>
  );
};
export default Home;
