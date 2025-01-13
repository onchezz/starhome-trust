import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import blogsData from "@/data/blogs.json";
import { CalendarDays, Clock, User } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[400px] object-cover"
          />
          <div className="p-8">
            <div className="mb-6">
              <span className="text-sm text-primary font-medium">
                {blog.category}
              </span>
              <h1 className="text-4xl font-bold text-navy mt-2 mb-4">
                {blog.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>By {blog.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>{new Date(blog.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {blog.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={index} className="list-disc pl-4">
                      {paragraph
                        .split("\n")
                        .map((item, i) => (
                          <li key={i}>{item.replace("- ", "")}</li>
                        ))}
                    </ul>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetails;