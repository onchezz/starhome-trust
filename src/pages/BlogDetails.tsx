import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import blogsData from "@/data/blogs.json";
import { CalendarDays, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";

const BlogDetails = () => {
  const { id } = useParams();
  const blog = blogsData.blogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-24">
          <h1 className="text-2xl font-bold text-center">Blog not found</h1>
        </div>
      </div>
    );
  }

  // Helper function to determine if a paragraph is a heading
  const isHeading = (text: string) => text.startsWith("#");
  const getHeadingLevel = (text: string) => {
    const matches = text.match(/^#+/);
    return matches ? matches[0].length : 0;
  };

  // Function to render content with proper formatting
  const renderContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => {
      // Handle headings
      if (isHeading(paragraph)) {
        const level = getHeadingLevel(paragraph);
        const text = paragraph.replace(/^#+\s/, "");
        const headingClasses = {
          1: "text-3xl font-bold mb-6 mt-8 text-navy",
          2: "text-2xl font-bold mb-4 mt-6 text-navy",
          3: "text-xl font-bold mb-3 mt-5 text-navy",
        }[level] || "text-lg font-bold mb-2 mt-4";
        return <h2 key={index} className={headingClasses}>{text}</h2>;
      }

      // Handle lists
      if (paragraph.startsWith("- ")) {
        return (
          <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
            {paragraph.split("\n").map((item, i) => (
              <li key={i} className="text-gray-700">
                {item.replace("- ", "")}
              </li>
            ))}
          </ul>
        );
      }

      // Regular paragraphs
      return (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <article className="max-w-4xl mx-auto">
          <Card className="overflow-hidden bg-white shadow-lg">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="p-8">
              <div className="mb-8">
                <span className="text-sm text-primary font-medium px-3 py-1 bg-primary/10 rounded-full">
                  {blog.category}
                </span>
                <h1 className="text-4xl font-bold text-navy mt-4 mb-4">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>By {blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                {renderContent(blog.content)}
              </div>
            </div>
          </Card>
        </article>
      </div>
    </div>
  );
};

export default BlogDetails;