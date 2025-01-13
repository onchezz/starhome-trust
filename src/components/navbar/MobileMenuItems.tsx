import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  isPage?: boolean;
}

interface MobileMenuItemsProps {
  items: NavigationItem[];
  onClick?: () => void;
}

const MobileMenuItems = ({ items, onClick }: MobileMenuItemsProps) => {
  return (
    <div className="flex flex-col space-y-3 py-2">
      {items.map((item) => {
        const linkContent = (
          <div className="flex items-center justify-between w-full group">
            <span>{item.label}</span>
            {item.isPage && (
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  "text-gray-400 group-hover:text-gray-600"
                )}
              />
            )}
          </div>
        );

        return item.isPage ? (
          <Link
            key={item.label}
            to={item.href}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onClick}
          >
            {linkContent}
          </Link>
        ) : (
          <button
            key={item.label}
            className="w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onClick}
          >
            {linkContent}
          </button>
        );
      })}
    </div>
  );
};

export default MobileMenuItems;