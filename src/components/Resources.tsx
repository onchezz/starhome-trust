import { Mail, Search, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const Resources = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const resources = [
    {
      title: "How Starhomes Facilitated My International Property Investment Journey",
      description:
        "Discover how Starhomes transformed my approach to investing in properties around the globe through cryptocurrency.",
      image: "/lovable-uploads/4588ce76-db27-4a83-b57b-bc6cab99a4d0.png",
      icon: Mail,
    },
    {
      title: "Your Complete Guide to Investing in Global Properties",
      description:
        "An essential resource for first-time investors looking to explore the global real estate market.",
      image: "/lovable-uploads/4588ce76-db27-4a83-b57b-bc6cab99a4d0.png",
      icon: Search,
    },
    {
      title: "Strategies for Successful Property Investment with Cryptocurrency",
      description:
        "Learn innovative investment techniques that take advantage of the latest crypto trends to maximize your property gains.",
      image: "/lovable-uploads/4588ce76-db27-4a83-b57b-bc6cab99a4d0.png",
      icon: Phone,
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-navy mb-4 animate-fade-in">
            Resources{" "}
            <span className="relative">
              Designed
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-secondary"></span>
            </span>{" "}
            for Real Estate Investors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in delay-100">
            Interested in diversifying your investments? Starhomes is here to guide
            you through global property opportunities using cryptocurrency!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div
              key={resource.title}
              className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${index * 200}ms`,
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-navy mb-3 group-hover:text-primary transition-colors duration-300">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Link to="/blogs">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  >
                    <resource.icon className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;