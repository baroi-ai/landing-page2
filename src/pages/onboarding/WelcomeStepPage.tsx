// src/pages/onboarding/WelcomeStepPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Changed from Input to Textarea for a longer answer
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react"; // Using Target icon for goals

const WelcomeStepPage = () => {
  const navigate = useNavigate();
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!primaryGoal.trim()) {
      setError("Please tell us a bit about your goals.");
      return;
    }
    if (primaryGoal.trim().length < 10) {
      // Optional: minimum length
      setError(
        "Please provide a little more detail about your goals (at least 10 characters)."
      );
      return;
    }
    setError("");
    // Save the primary goal
    localStorage.setItem("onboarding_primary_goal", primaryGoal); // Example
    navigate("/onboarding/interests"); // Navigate to the next step
  };

  return (
    <OnboardingLayout title="Welcome to AI Studio!" step={1} totalSteps={3}>
      <p className="text-sm text-gray-400 text-center mb-6">
        We're excited to have you. Let's get you set up!
      </p>
      <div>
        <Label
          htmlFor="primaryGoal"
          className="text-sm font-medium text-gray-300 flex items-center mb-1"
        >
          <Target className="h-4 w-4 mr-2 text-cyan-400" />
          What's your primary goal for using AI Studio?
        </Label>
        <p className="text-xs text-gray-500 mb-2">
          (e.g., "Create stunning visuals for my blog," "Experiment with video
          ideas," "Automate content creation")
        </p>
        <Textarea
          id="primaryGoal"
          placeholder="Tell us what you hope to achieve..."
          value={primaryGoal}
          onChange={(e) => setPrimaryGoal(e.target.value)}
          className="bg-gray-700 border-gray-600 focus:border-cyan-500 text-gray-200 min-h-[80px] resize-none"
          rows={3} // Suggests a slightly longer answer
        />
        {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      </div>

      <Button
        onClick={handleNext}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white mt-4" // Added margin-top
      >
        Next Step
      </Button>
    </OnboardingLayout>
  );
};

export default WelcomeStepPage;
