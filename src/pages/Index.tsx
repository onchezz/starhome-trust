import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Resources from "@/components/Resources";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Index = () => {
  const { ref: pageRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden" ref={pageRef}>
      <div className={`transition-opacity duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <Hero />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white pointer-events-none" />
          <Stats />
        </div>
        <Resources />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
};

export default Index;