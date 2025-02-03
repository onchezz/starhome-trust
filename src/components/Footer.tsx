import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary dark:bg-primary/10 text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">starhomes</h3>
            <p className="text-primary-foreground/80 dark:text-primary-foreground/60">
              Empowering global real estate investment through cryptocurrency.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-foreground/80 dark:hover:text-primary-foreground/60">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary-foreground/80 dark:hover:text-primary-foreground/60">
                  About Us
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-primary-foreground/80 dark:hover:text-primary-foreground/60">
                  Properties
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-foreground/80 dark:hover:text-primary-foreground/60">
                  Investment Opportunities
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground/80 dark:hover:text-primary-foreground/60">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-primary-foreground/80 dark:hover:text-primary-foreground/60"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a
                href="#"
                className="hover:text-primary-foreground/80 dark:hover:text-primary-foreground/60"
                aria-label="Facebook"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="hover:text-primary-foreground/80 dark:hover:text-primary-foreground/60"
                aria-label="Twitter"
              >
                <Twitter />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p>&copy; {currentYear} Starhomes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;