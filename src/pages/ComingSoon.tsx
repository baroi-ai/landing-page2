// src/pages/ComingSoon.tsx
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import {
  Home,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-500 text-gray-100 px-4">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-teal-500 mb-4 glow-text">
          Coming Soon
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-8">
          We are working hard to bring you something amazing. Stay tuned!
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-dark-500"
        >
          <Home className="mr-2 h-5 w-5" />
          Go to Home
        </a>

        <div className="mt-12 flex justify-center gap-6">
          <a
            href="https://linktr.ee/baroi.ai"
            className="text-gray-400 hover:text-cyan-500 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://linktr.ee/baroi.ai"
            className="text-gray-400 hover:text-cyan-500 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube size={24} />
          </a>
          <a
            href="https://linktr.ee/baroi.ai"
            className="text-gray-400 hover:text-cyan-500 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://linktr.ee/baroi.ai"
            className="text-gray-400 hover:text-cyan-500 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
