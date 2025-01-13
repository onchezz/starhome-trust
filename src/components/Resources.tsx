import { Mail, Search, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Resources = () => {
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
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-navy mb-4">
            Resources{" "}
            <span className="relative">
              Designed
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-secondary"></span>
            </span>{" "}
            for Real Estate Investors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Interested in diversifying your investments? Starhomes is here to guide
            you through global property opportunities using cryptocurrency!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Link to="/blogs">
                  <Button variant="outline" className="w-full">
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