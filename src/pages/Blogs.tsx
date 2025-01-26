import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shimmer } from "@/components/ui/shimmer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import blogsData from "@/data/blogs.json";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const categories = ["All", "Success Stories", "Investment Guide", "Crypto Investment"];

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* <Navbar /> */}
        <div className="container mx-auto py-24">
          <div className="text-center mb-16">
            <Shimmer className="h-12 w-3/4 mx-auto mb-4" />
            <Shimmer className="h-6 w-1/2 mx-auto" />
          </div>

          <div className="mb-12 space-y-6">
            <div className="relative max-w-md mx-auto">
              <Shimmer className="h-10 w-full" />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Shimmer key={index} className="h-10 w-24" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Shimmer className="w-full h-48" />
                <CardHeader>
                  <Shimmer className="h-6 w-3/4 mb-2" />
                  <Shimmer className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Shimmer className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Shimmer className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredBlogs = blogsData.blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="container mx-auto py-24">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold text-navy mb-4">
            Explore Insights and Strategies for Real Estate Investment
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest trends in global property and
            cryptocurrency investments
          </p>
        </div>

        <div className="mb-12 space-y-6 animate-fade-in">
          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-300 hover:scale-105"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog, index) => (
            <Card
              key={blog.id}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translateY(0)"
                  : `translateY(${20 + index * 10}px)`,
                transition: `all 0.5s ease-out ${index * 0.1}s`,
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-primary">{blog.category}</span>
                  <span className="text-sm text-gray-500">{blog.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">{blog.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  By {blog.author} • {new Date(blog.date).toLocaleDateString()}
                </div>
                <Link to={`/blogs/${blog.id}`}>
                  <Button variant="outline">Read More</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;