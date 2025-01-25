// Index.tsx
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Resources from "@/components/Resources";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  const contactRef = useRef(null);
  const aboutRef = useRef(null);

  const { ref: pageRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#contact" || hash === "#about") {
      const targetRef = hash === "#contact" ? contactRef : aboutRef;
      const targetPosition = targetRef.current.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 2000; // Increased duration to 2 seconds

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      let start = null;

      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  }, []);

  return (
    <div className="min-h-screen overflow-hidden" ref={pageRef}>
      <div
        className={`transition-opacity duration-1000 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navbar />
        <Hero />
        <div className="relative">
          <div className="relative" id="stats">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white pointer-events-none" />
            <Stats />
          </div>
          {/* <div classNa me="absolute inset-0 bg-gradient-to-b from-blue-50 to-white pointer-events-none" />
          <Stats /> */}
        </div>
        <Resources />
        <div ref={contactRef} id="contact">
          <ContactForm />
        </div>
        <div ref={aboutRef} id="about">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
