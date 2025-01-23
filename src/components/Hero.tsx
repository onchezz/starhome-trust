import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen pt-16 flex items-center bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-navy leading-tight">
              Invest in Real Estate{" "}
              <span className="text-primary animate-pulse">Globally</span> with
              Crypto
            </h1>
            <p className="text-lg text-gray-600 animate-fade-in delay-200">
              Empowering individuals to invest in diverse properties worldwide using
              cryptocurrency, ensuring a seamless and innovative process.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button size="lg" className="animate-scale-in">
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
                className="animate-scale-in delay-100"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-float"></div>
            <img
              src="/lovable-uploads/b254c8f5-c5c5-4d7d-b9b9-ff1a00699d47.png"
              alt="Real Estate Investment"
              className="relative z-10 w-full rounded-lg shadow-2xl animate-scale-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;