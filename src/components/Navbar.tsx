import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "About Us", href: "/#about" },
    { label: "Properties", href: "/properties", isPage: true },
    { label: "Investment", href: "/investment", isPage: true },
    { label: "Contact Us", href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            starhomes
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              item.isPage ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-navy hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-navy hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              )
            ))}
            <Button>Invest Now</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                item.isPage ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-navy hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-navy hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <Button className="w-full">Invest Now</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;