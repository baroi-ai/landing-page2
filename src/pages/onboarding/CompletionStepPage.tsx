// src/pages/onboarding/CompletionStepPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, PartyPopper } from "lucide-react";

const CompletionStepPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("onboarding_name");
    if (nameFromStorage) {
      setUserName(nameFromStorage);
    }
  }, []);

  const handleFinishOnboarding = async () => {
    // 1. Mark onboarding as complete (e.g., set a flag in localStorage)
    localStorage.setItem("onboarding_complete", "true");

    // 2. Optional: Send data to backend
    // const name = localStorage.getItem("onboarding_name");
    // const interests = JSON.parse(localStorage.getItem("onboarding_interests") || "[]");
    // try {
    //   await fetch('/api/user/complete-onboarding', { // Your backend endpoint
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` },
    //     body: JSON.stringify({ name, interests, onboarding_status: 'completed' })
    //   });
    // } catch (error) {
    //   console.error("Failed to save onboarding data to backend:", error);
    //   // Don't block user progression if backend fails, but log it.
    // }

    // 3. Clean up temporary onboarding data from localStorage
    localStorage.removeItem("onboarding_name");
    localStorage.removeItem("onboarding_interests");

    // 4. Navigate to the main dashboard or home page
    navigate("/dashboard/billing"); // Or your main app route after login/onboarding
  };

  return (
    <OnboardingLayout title="You're All Set!" step={3} totalSteps={3}>
      <div className="text-center">
        <PartyPopper className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-100 mb-2">
          Congratulations, {userName || "Explorer"}!
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          You've successfully completed the setup. You're now ready to dive in
          and start creating amazing things with our AI tools.
        </p>
        <ul className="text-left text-sm text-gray-400 space-y-2 mb-8 bg-gray-800/60 p-4 rounded-md">
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              Explore a wide variety of AI models for image and video
              generation.
            </span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>Manage your account, credits, and generation history.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>Discover new features as we roll them out!</span>
          </li>
        </ul>
      </div>
      <Button
        onClick={handleFinishOnboarding}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-base py-3"
      >
        Start Exploring AI Studio
      </Button>
    </OnboardingLayout>
  );
};

export default CompletionStepPage;
