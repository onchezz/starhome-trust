import { Link, useLocation } from "react-router-dom";
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

        return item.isPage ? (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              className,
              "relative group",
              "after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
              isActive && "text-primary after:scale-x-100",
              "hover:animate-pulse"
            )}
            onClick={onClick}
          >
            {linkContent}
          </Link>
        ) : (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              className,
              "relative group",
              "after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
              isActive && "text-primary after:scale-x-100",
              "hover:animate-pulse"
            )}
            onClick={onClick}
          >
            {linkContent}
          </a>
        );
      })}
    </div>
  );
};

export default NavigationLinks;