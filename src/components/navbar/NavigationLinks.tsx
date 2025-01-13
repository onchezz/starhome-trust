import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  href: string;
  isPage?: boolean;
}

interface NavigationLinksProps {
  items: NavigationItem[];
  className?: string;
  onClick?: () => void;
}

const NavigationLinks = ({ items, className, onClick }: NavigationLinksProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = async (href: string) => {
    console.log("Handling anchor click for:", href);
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      console.log("Not on home page, navigating to:", href);
      // Use navigate and then handle the scroll after the navigation
      navigate('/');
      // Wait for a brief moment to ensure the navigation has completed
      setTimeout(() => {
        const sectionId = href.split('#')[1];
        console.log("Scrolling to section:", sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // If we're already on the home page, just scroll
      const sectionId = href.split('#')[1];
      console.log("Already on home page, scrolling to:", sectionId);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }

    // Call the onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex items-center space-x-6">
      {items.map((item) => {
        const isActive = location.pathname === item.href || 
                        (item.href.startsWith("/#") && location.pathname === "/");
        
        const linkContent = (
          <div className="flex items-center gap-1 group">
            <span>{item.label}</span>
            {item.isPage && (
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isActive ? "text-primary rotate-180" : "text-gray-400 group-hover:text-gray-600"
                )}
              />
            )}
          </div>
        );

        // Different styling for pages vs non-pages (Contact Us, About Us)
        const linkStyles = item.isPage
          ? cn(
              className,
              "relative px-4 py-2 rounded-md border-2",
              isActive ? "border-primary text-primary" : "border-transparent",
              "transition-all duration-300"
            )
          : cn(
              className,
              "relative px-4 py-2 rounded-md border-2 border-transparent",
              "transition-all duration-300",
              "hover:border-primary hover:animate-pulse"
            );

        return item.isPage ? (
          <Link
            key={item.label}
            to={item.href}
            className={linkStyles}
            onClick={onClick}
          >
            {linkContent}
          </Link>
        ) : (
          <a
            key={item.label}
            href={item.href}
            className={linkStyles}
            onClick={(e) => {
              e.preventDefault();
              handleAnchorClick(item.href);
            }}
          >
            {linkContent}
          </a>
        );
      })}
    </div>
  );
};

export default NavigationLinks;