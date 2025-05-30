// src/pages/onboarding/InterestsStepPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Image as ImageIcon,
  Video,
  Edit3,
  Lightbulb,
  AudioLines,
  ShieldCheck,
} from "lucide-react";

const interestOptions = [
  { id: "imageGen", label: "Image Generation", Icon: ImageIcon },
  { id: "videoGen", label: "Video Generation", Icon: Video },
  { id: "textTools", label: "Text to spceeh", Icon: AudioLines },
  { id: "ideaGen", label: "Others", Icon: ShieldCheck },
];

const InterestsStepPage = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Retrieve name from previous step (example)
    const nameFromStorage = localStorage.getItem("onboarding_name");
    if (nameFromStorage) {
      setUserName(nameFromStorage);
    }
  }, []);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    // Save interests (e.g., to localStorage or global state)
    localStorage.setItem(
      "onboarding_interests",
      JSON.stringify(selectedInterests)
    ); // Example
    navigate("/onboarding/completion");
  };

  const handleSkip = () => {
    localStorage.removeItem("onboarding_interests"); // Clear if skipping
    navigate("/onboarding/completion");
  };

  return (
    <OnboardingLayout
      title={`What interests you, ${userName || "friend"}?`}
      step={2}
      totalSteps={3}
    >
      <p className="text-sm text-gray-400 text-center mb-6">
        Select a few areas you're excited to explore. This helps us tailor your
        experience (optional).
      </p>
      <div className="space-y-4">
        {interestOptions.map(({ id, label, Icon }) => (
          <Label
            key={id}
            htmlFor={id}
            className="flex items-center p-3 space-x-3 rounded-md border border-gray-700 bg-gray-800/50 hover:bg-gray-700/70 cursor-pointer transition-colors"
          >
            <Checkbox
              id={id}
              checked={selectedInterests.includes(id)}
              onCheckedChange={() => toggleInterest(id)}
              className="border-gray-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
            />
            <Icon className="h-5 w-5 text-cyan-400" />
            <span className="text-sm text-gray-300">{label}</span>
          </Label>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button
          onClick={handleSkip}
          variant="outline"
          className="w-full border-gray-600 hover:bg-gray-700"
        >
          Skip for Now
        </Button>
        <Button
          onClick={handleNext}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Next
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default InterestsStepPage;
