// src/components/layout/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is authenticated (based on token presence)
  const isAuthenticated = !!localStorage.getItem("access");

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

  // Define navigation items and their links
  const navItems = [
    { name: "Features", href: "/#features" },
    { name: "AI Tools", href: "/ai-tools" },
    { name: "AI Models", href: "/ai-models" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/pricing#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2 glass-panel shadow-md" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {" "}
          {/* Parent container */}
          {/* Logo and Brand Name - Reverted to original size */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            {" "}
            {/* Added flex-shrink-0 */}
            <img
              src="/logo.png" // Path relative to the public folder
              alt="Shakaal AI Logo"
              className="glow-text h-10 lg:h-20 w-auto" // Original size
            />
            <span className="glow-text font-bold text-2xl tracking-tight">
              {" "}
              {/* Original size */}
              Shakaal AI
            </span>
          </Link>
          {/* Desktop Nav - ADD flex-grow and justify-center HERE */}
          <nav className="hidden md:flex items-center gap-6 flex-grow justify-center">
            {" "}
            {/* <-- ADDED flex-grow justify-center */}
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
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {" "}
            {/* Added flex-shrink-0 */}
            {isAuthenticated ? (
              <Button
                className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow"
                asChild
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-200 glow-text hover:text-cyan-light hover:bg-dark-400"
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow"
                  asChild
                >
                  <Link to="/signup">Try Now</Link>
                </Button>
              </>
            )}
          </div>
          {/* Mobile Nav Toggle */}
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

      {/* Mobile Menu (remains the same) */}
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
              {isAuthenticated ? (
                <Button
                  className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium w-full"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-200 hover:text-cyan hover:bg-dark-400 w-full"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button
                    className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium w-full"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/signup">Try For Free</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
