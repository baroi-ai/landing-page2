import React from "react";
// Import Link for internal navigation
import { Link } from "react-router-dom";
// Import specific social icons
import { Youtube, Linkedin, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  // Define social links (Update hrefs later)
  const socialLinks = [
    {
      Icon: Instagram,
      href: "https://linktr.ee/baroi.ai",
      label: "Instagram",
    },
    {
      Icon: Youtube,
      href: "https://linktr.ee/baroi.ai",
      label: "YouTube",
    },
    {
      Icon: Linkedin,
      href: "https://linktr.ee/baroi.ai",
      label: "LinkedIn",
    },
    { Icon: Twitter, href: "https://linktr.ee/baroi.ai", label: "Twitter/X" },
  ];

  // Define navigation links (Update 'to' paths as needed)
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Terms of Service", to: "/terms" },
    { name: "Refund policy", to: "/refund" },
    { name: "Privacy Policy", to: "/privacy" }, // Example path
  ];

  return (
    // Removed top glow div for simplicity, kept border
    <footer className="relative border-t border-white/10 pt-12 pb-8 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-8">
          {/* Left Side: Brand and Social */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 glow-text">DeepShark AI</h3>
            {/* Optional short description */}
            {/* <p className="text-gray-400 mb-4 max-w-xs">
              Cloud-based AI content generation.
            </p> */}
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank" // Open social links in new tab
                  rel="noopener noreferrer"
                  aria-label={label} // Accessibility
                  className="w-9 h-9 rounded-full bg-dark-400/50 flex items-center justify-center text-gray-400 hover:text-cyan-light hover:bg-dark-400 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Navigation Links (Only on larger screens might look better) */}
          {/* This part is removed based on the simplification, links moved to bottom */}
        </div>

        {/* Bottom Row: Copyright and Condensed Links */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} DeepShark AI. All rights reserved.
          </p>
          {/* Condensed Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-6 text-sm text-gray-500">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="hover:text-gray-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
