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
    <>
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          className={className}
          onClick={onClick}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default NavigationLinks;