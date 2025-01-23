import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Typewriter from 'typewriter-effect';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Hero = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen pt-16 flex items-center bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-float delay-200"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full filter blur-3xl opacity-20 animate-float delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-navy leading-tight">
              <div className="mb-4">
                <Typewriter
                  options={{
                    strings: ['Invest in Real Estate Globally with Crypto'],
                    autoStart: true,
                    loop: false,
                    delay: 50,
                    deleteSpeed: 50,
                  }}
                />
              </div>
            </h1>
            <p className="text-lg text-gray-600 animate-fade-in delay-200 transform translate-y-0">
              Empowering individuals to invest in diverse properties worldwide using
              cryptocurrency, ensuring a seamless and innovative process.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button size="lg" className="animate-pulse hover:animate-none hover:scale-105 transition-all">
                    Get Started Today
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate("/properties")}>
                    Browse Properties
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/investment")}>
                    Start Investing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/blogs")}
                className="hover:scale-105 transition-all"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <img
                src="/lovable-uploads/b254c8f5-c5c5-4d7d-b9b9-ff1a00699d47.png"
                alt="Real Estate Investment"
                className="relative z-10 w-full rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;