import { Button } from "@/components/ui/button";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="absolute inset-0 w-full h-full bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            <Typewriter
              options={{
                strings: ["Invest in Real Estate Globally"],
                autoStart: true,
                loop: false,
                cursor: "",
                delay: 80,
                deleteSpeed: 50,
                pauseFor: 2500,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString("Invest in Real Estate Globally")
                  .pauseFor(2500)
                  .deleteAll()
                  .typeString("with Crypto")
                  .pauseFor(2000)
                  .deleteAll()
                  .typeString("Secure. Transparent. Decentralized.")
                  .start();
              }}
            />
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl mb-8 text-muted-foreground"
          >
            Join the future of real estate investment with blockchain technology
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button size="lg" className="animate-shimmer bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:400%_100%]">
              Start Investing Now
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;