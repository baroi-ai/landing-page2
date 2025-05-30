// src/pages/PricingPage.tsx (or your preferred path)

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// --- Import Accordion Components ---
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// --- End Import ---
import { Check, Coins } from "lucide-react";

// Define the structure for a pricing plan (Keep as before)
interface PricingPlan {
  name: string;
  coins: number;
  price: string;
  description: string;
  features: string[];
  isHighlighted?: boolean;
  buttonText?: string;
}

const pricingPlans: PricingPlan[] = [
  // ... (Keep pricingPlans array as defined previously)
  {
    name: "Starter Pack",
    coins: 100,
    price: "$5",
    description: "Perfect for trying out basic features.",
    features: [
      "Generate up to 20 images",
      "Basic voice cloning attempts",
      "Standard queue priority",
    ],
    buttonText: "Get 100 Coins",
  },
  {
    name: "Value Pack",
    coins: 500,
    price: "$20", // Example price (adjust as needed)
    description: "Best value for regular users.",
    features: [
      "Generate up to 120 images",
      "Multiple voice cloning slots",
      "Access to premium models",
      "Faster queue priority",
      "Early access to new features",
    ],
    isHighlighted: true, // Mark this as the popular choice
    buttonText: "Get 500 Coins",
  },
  {
    name: "Pro Pack",
    coins: 1000,
    price: "$35", // Example price (adjust as needed)
    description: "For heavy users and professionals.",
    features: [
      "Generate up to 300 images",
      "Unlimited voice cloning",
      "Access all premium models",
      "Highest queue priority",
      "Dedicated support channel",
    ],
    buttonText: "Get 1000 Coins",
  },
];

// --- FAQ Data ---
const faqs = [
  {
    question: "How do I use coins?",
    answer:
      "Coins are used as credits for generating content. Each generation type (image, video, voice clone, etc.) consumes a specific number of coins, which will be clearly indicated before you start the generation process.",
  },
  {
    question: "Do the coins expire?",
    answer:
      "No, purchased coins do not expire. You can use them whenever you need them.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards (Visa, Mastercard, American Express) and PayPal for purchasing coin packs.",
  },
  {
    question: "Can I get a refund for unused coins?",
    answer:
      "Coin pack purchases are generally non-refundable. Please refer to our Terms of Service for detailed information on our refund policy.",
  },
  {
    question: "How is coin usage calculated for different features?",
    answer:
      "Coin costs vary depending on the complexity and computational resources required for each generation. For example, generating a high-resolution image might cost more coins than a standard voice clone. Costs are displayed upfront.",
  },
];
// --- End FAQ Data ---

const PricingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Navbar />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient z-0"></div>

      {/* Content Area */}
      <main className="flex-grow flex flex-col items-center px-4 py-16 sm:py-24 relative z-10">
        {" "}
        {/* Removed justify-center */}
        {/* Header Section */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Coin Pack
          </h1>
          <p className="text-lg text-gray-300">
            Select the right amount of coins for your creative needs. Use coins
            for generating images, videos, voices, and more.
          </p>
        </div>
        {/* Pricing Grid */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {" "}
          {/* Added mb-16 */}
          {pricingPlans.map((plan) => (
            // --- Pricing Card (Keep as before) ---
            <Card
              key={plan.name}
              className={`flex flex-col bg-transparent text-white shadow-lg backdrop-blur-md border ${
                plan.isHighlighted
                  ? "border-cyan-500 ring-2 ring-cyan-500/50 relative"
                  : "border-white/20"
              }`}
            >
              {plan.isHighlighted && (
                <Badge
                  variant="default"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan text-dark-500 px-3 py-1 text-sm font-semibold"
                >
                  Most Popular
                </Badge>
              )}
              <CardHeader className="pt-8 pb-4 text-center">
                <CardTitle className="text-2xl font-semibold mb-2">
                  {plan.name}
                </CardTitle>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="h-7 w-7 text-cyan-400" />
                  <span className="text-3xl font-bold">{plan.coins}</span>
                </div>
                <CardDescription className="text-gray-300 h-10">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow px-6 pb-6">
                <div className="text-center mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-200">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  className={`w-full text-lg py-3 ${
                    plan.isHighlighted
                      ? "bg-cyan text-dark-500 hover:bg-cyan-500"
                      : "bg-white/10 border border-white/30 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.buttonText || `Get ${plan.coins} Coins`}
                </Button>
              </CardFooter>
            </Card>
            // --- End Pricing Card ---
          ))}
        </div>
        {/* Coin Info Text */}
        <div className="mb-16 text-center text-gray-400 max-w-xl mx-auto">
          {" "}
          {/* Added mb-16 */}
          <p>
            Coins can be used across all Shakaal AI generation tools. Unused
            coins do not expire.
          </p>
        </div>
        {/* --- FAQ Section --- */}
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              // Use border/bg consistent with the card style
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-transparent border border-white/20 rounded-lg mb-3 backdrop-blur-md overflow-hidden" // Added backdrop-blur, overflow-hidden, margin
              >
                {/* Ensure trigger text is white/readable */}
                <AccordionTrigger className="px-6 py-4 text-left text-lg hover:no-underline text-white font-medium">
                  {faq.question}
                </AccordionTrigger>
                {/* Ensure content text is light gray/readable */}
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {/* --- End FAQ Section --- */}
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
