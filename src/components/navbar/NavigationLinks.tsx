import { Link } from "react-router-dom";

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
  return (
    <div className="flex items-center space-x-6">
      {items.map((item) => (
        item.isPage ? (
          <Link
            key={item.label}
            to={item.href}
            className={className}
            onClick={onClick}
          >
            {item.label}
          </Link>
        ) : (
          <a
            key={item.label}
            href={item.href}
            className={className}
            onClick={onClick}
          >
            {item.label}
          </a>
        )
      ))}
    </div>
  );
};

export default NavigationLinks;