import { Button } from "@/components/ui/button";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const scrollToStats = () => {
  const statsSection = document.getElementById("stats");
  if (statsSection) {
    const navbarHeight = 64;
    const targetPosition =
      statsSection.getBoundingClientRect().top +
      window.pageYOffset -
      navbarHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 2000;

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
};

export const Hero = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="min-h-screen pt-16 flex items-center bg-gradient-to-br from-background to-background/50 dark:from-background dark:to-background/80">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                    Invest in Real Estate{" "}
                    <span className="text-primary">Globally</span> with Crypto
                  </h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm mb-8 mt-4 text-muted-foreground"
                  >
                    Join the future of real estate investment with blockchain
                    technology
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex justify-center flex-wrap gap-4">
                      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="lg"
                            className="animate-shimmer bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:400%_100%]"
                          >
                            Start Investing Now
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => navigate("/properties")}
                          >
                            Browse Properties
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate("/investment")}
                          >
                            Start Investing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate("/blogs")}
                      >
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-float"></div>
              <img
                src="/lovable-uploads/b254c8f5-c5c5-4d7d-b9b9-ff1a00699d47.png"
                alt="Real Estate Investment"
                className="relative z-10 w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>

          <h1 className="flex text-xl md:text-2xl mb-6 mt-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            <Typewriter
              options={{
                strings: ["Secure. Transparent. Decentralized."],
                autoStart: true,
                loop: true,
                cursor: "",
                delay: 80,
                deleteSpeed: 50,
              }}
            />
          </h1>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center w-1/3 mx-auto text-center items-center h-42 text-x mt-48 text-muted-foreground"
            >
              Empowering individuals to invest in diverse properties worldwide
              using cryptocurrency, ensuring a seamless and innovative process.
            </motion.p>
          </div>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex justify-center mt-8"
          >
            <ChevronDown
              className="h-8 w-8 text-primary cursor-pointer hover:text-primary/80 transition-colors"
              onClick={scrollToStats}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Hero;