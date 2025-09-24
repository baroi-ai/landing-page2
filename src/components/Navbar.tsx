import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BellRing, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // The rest of your existing logic is perfect and remains unchanged.
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const navItems = [
    { name: "Features", href: "/#features" },
    { name: "AI Tools", href: "/soon" },
    { name: "AI Models", href: "/soon" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "https://linktr.ee/baroi.ai" },
  ];

  // --- NO UI or JSX CHANGES below this line ---
  // The structure and classNames are identical to your original code.
  // The component will now automatically re-render with the correct buttons

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2 glass-panel shadow-md" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/logo.png"
              alt="DeepShark AI Logo"
              className="glow-text  text-teal-500 h-10 lg:h-20 w-auto"
            />
            <span className="glow-text font-bold text-2xl tracking-tight">
              DeepShark AI
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 flex-grow justify-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-cyan-light transition-colors link-underline font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <Button
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-dark-500 font-medium btn-glow"
              asChild
            >
              <Link to="https://forms.gle/xYmKPZR2ZDpywKuz8">
                Notify Me <BellRing className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <button
            className="md:hidden text-gray-200 hover:text-cyan-light p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-panel mt-2 pb-4 px-4 shadow-md animate-fadeIn">
          <nav className="flex flex-col space-y-4 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-cyan px-4 py-2 rounded-md hover:bg-dark-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Button
                className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium w-full"
                asChild
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="https://forms.gle/xYmKPZR2ZDpywKuz8">
                  Notify Me <BellRing className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
