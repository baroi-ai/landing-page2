
import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 pt-16 pb-10 overflow-hidden">
      {/* Subtle glow at the top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-cyan-glow"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 glow-text">Glimmer AI</h3>
            <p className="text-gray-400 mb-6">
              Open-source AI content generation platform with no API limits or usage restrictions.
            </p>
            <div className="flex space-x-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-dark-400/50 flex items-center justify-center text-gray-400 hover:text-cyan-light hover:bg-dark-400 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Platform</h4>
            <ul className="space-y-3 text-gray-400">
              {['Features', 'AI Models', 'Documentation', 'Pricing', 'Examples'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-cyan-light link-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Resources</h4>
            <ul className="space-y-3 text-gray-400">
              {['Blog', 'Community', 'GitHub', 'Roadmap', 'Changelog'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-cyan-light link-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Company</h4>
            <ul className="space-y-3 text-gray-400">
              {['About Us', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-cyan-light link-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Glimmer AI. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-300">Terms</a>
            <a href="#" className="hover:text-gray-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
