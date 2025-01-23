import { Globe, Users, MapPin } from "lucide-react";
import { useInView } from "react-intersection-observer";

const Stats = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      number: "500+",
      label: "Global Properties Available",
      icon: Globe,
    },
    {
      number: "300+",
      label: "Investors Using Our Services",
      icon: Users,
    },
    {
      number: "20+",
      label: "Countries We're Active in",
      icon: MapPin,
    },
  ];

  return (
    <div className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-navy mb-4">
            Why Choose{" "}
            <span className="relative">
              Starhomes?
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-secondary"></span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Starhomes empowers investors to explore diverse properties worldwide
            using cryptocurrency. Our platform provides comprehensive investment
            options, making it easier for you to embark on your real estate
            journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${index * 200}ms`,
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;