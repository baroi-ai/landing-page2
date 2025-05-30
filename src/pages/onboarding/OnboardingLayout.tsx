// src/pages/onboarding/OnboardingLayout.tsx
import React from "react";
import { Clapperboard } from "lucide-react"; // Or your app logo icon

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title: string;
  step?: number; // Optional: current step number
  totalSteps?: number; // Optional: total number of steps for a progress bar
  videoSrc?: string; // Optional: path to your background video in /public
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  title,
  step,
  totalSteps,
  videoSrc = "/mb.mp4", // Default video path
}) => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Video */}
      {videoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline // Important for iOS and some mobile browsers
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          // Optional: Add a poster image for while the video loads
          // poster="/videos/onboarding-poster.jpg"
        >
          <source src={videoSrc} type="video/mp4" />
          {/* You can add more source types for broader compatibility if needed */}
          {/* e.g., <source src="/videos/onboarding-bg.webm" type="video/webm" /> */}
          Your browser does not support the video tag.
        </video>
      )}

      {/* Overlay to darken the video a bit and improve text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

      {/* Content Container - ensure it's above the video and overlay */}
      <div className="relative z-20 w-full max-w-md bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-xl p-6 sm:p-8">
        {" "}
        {/* Added transparency and backdrop-blur */}
        <div className="text-center mb-6">
          <Clapperboard className="w-12 h-12 text-cyan-500 mx-auto mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
            {title}
          </h1>
        </div>
        {step && totalSteps && totalSteps > 1 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700/70 rounded-full h-2">
              {" "}
              {/* Slightly transparent progress bar background */}
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        <div className="space-y-6">{children}</div>
      </div>
      <p className="relative z-20 text-xs text-gray-400 mt-6 text-center">
        {" "}
        {/* Ensure copyright is above overlay */}© {new Date().getFullYear()}{" "}
        Your App Name. All rights reserved.
      </p>
    </div>
  );
};

export default OnboardingLayout;
