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
    <div className="py-20 bg-transparent dark:bg-background/50 relative z-10" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 transform transition-all duration-700 animate-fade-in">
            Why Choose{" "}
            <span className="relative">
              Starhomes?
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-secondary dark:bg-secondary/50"></span>
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-200">
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
              className={`bg-white/80 dark:bg-gray-900/50 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${index * 200}ms`,
              }}
            >
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/5 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <stat.icon className="w-8 h-8 text-primary dark:text-primary-foreground" />
                </div>
                <h3 className="text-4xl font-bold text-primary dark:text-primary-foreground mb-2 transition-colors duration-300">
                  {stat.number}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;