// src/pages/PricingPage.tsx

import React, { useState, useEffect } from "react"; // Added useEffect for custom top-up calculation
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input"; // Import Input
import { Check, Coins, Zap } from "lucide-react"; // Import Zap for Top-Up section
import { useNavigate } from "react-router-dom";

// --- Data Structures ---
interface SubscriptionPlanBase {
  idPrefix: string;
  name: string;
  baseCoins: number;
  monthlyPriceDecimal: number;
  yearlyPriceDecimal: number;
  currency: string;
  description: string;
  features: string[];
  isHighlighted?: boolean;
}

interface DisplayPlan {
  name: string;
  coins: number;
  price: string;
  description: string;
  features: string[];
  isHighlighted?: boolean;
  buttonText: string;
  id: string;
}

const subscriptionPlanBases: SubscriptionPlanBase[] = [
  {
    idPrefix: "starter_sub",
    name: "Starter Subscription",
    baseCoins: 150,
    monthlyPriceDecimal: 7.0,
    yearlyPriceDecimal: 70.0,
    currency: "USD",
    description: "Consistent automatic coin top-up.",
    features: [
      "Automatic coin refills",
      "Cancel anytime",
      "Best image generation",
      "150 images via Minimax Image-01",
    ],
  },
  {
    idPrefix: "value_sub",
    name: "Value Subscription",
    baseCoins: 750,
    monthlyPriceDecimal: 28.0,
    yearlyPriceDecimal: 280.0,
    currency: "USD",
    description: "Best value for regular creators.",
    features: [
      "Automatic coin refills",
      "Access to premium models",
      "Faster queue priority",
      "Cancel anytime",
    ],
    isHighlighted: true,
  },
  {
    idPrefix: "pro_sub",
    name: "Pro Subscription",
    baseCoins: 1500,
    monthlyPriceDecimal: 49.0,
    yearlyPriceDecimal: 490.0,
    currency: "USD",
    description: "Max coins & priority for power users.",
    features: [
      "Automatic coin refills",
      "Cancel anytime",
      "Best for video generation.",
      "40 videos via Hunyuan Video",
    ],
  },
];

const pricingPlans: DisplayPlan[] = subscriptionPlanBases.map((base) => ({
  id: `${base.idPrefix}_monthly_display`,
  name: base.name,
  coins: base.baseCoins,
  price: `$${base.monthlyPriceDecimal.toFixed(2)}/month`,
  description: base.description,
  features: base.features,
  isHighlighted: base.isHighlighted,
  buttonText: `Get ${base.name}`,
}));

const allDisplayPlans: DisplayPlan[] = [...pricingPlans];

// --- Constants for Top-Up ---
const COINS_PER_DOLLAR = 20; // Same as BillingPage
const MIN_CUSTOM_TOP_UP_USD = 5; // Same as BillingPage

const faqs = [
  {
    question: "How do I use coins?",
    answer:
      "Coins are used as credits for generating content. Each generation type (image, video, voice clone, etc.) consumes a specific number of coins, which will be clearly indicated before you start the generation process.",
  },
  {
    question: "Do the coins expire?",
    answer:
      "No, purchased coins or subscribed coins do not expire as long as your subscription is active. One-time purchase coins never expire.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards (Visa, Mastercard, American Express) and PayPal for purchasing coin packs and subscriptions. You will be prompted to log in or create an account to complete your purchase.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Coin pack purchases and subscription payments are generally non-refundable. Please refer to our Terms of Service for detailed information on our refund policy.",
  },
  {
    question: "How is coin usage calculated for different features?",
    answer:
      "Coin costs vary depending on the complexity and computational resources required for each generation. For example, generating a high-resolution image might cost more coins than a standard voice clone. Costs are displayed upfront.",
  },
];

const PricingPage = () => {
  const navigate = useNavigate();
  const [customTopUpAmountUSD, setCustomTopUpAmountUSD] = useState<string>("");
  const [calculatedCustomCoins, setCalculatedCustomCoins] = useState<number>(0);

  useEffect(() => {
    const amount = parseFloat(customTopUpAmountUSD);
    if (!isNaN(amount) && amount >= 0.01) {
      setCalculatedCustomCoins(Math.floor(amount * COINS_PER_DOLLAR));
    } else {
      setCalculatedCustomCoins(0);
    }
  }, [customTopUpAmountUSD]);

  const handleGetPlanOrTopUp = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Navbar />
      <div className="absolute inset-0 hero-gradient z-0"></div>
      <main className="flex-grow flex flex-col items-center px-4 py-16 sm:py-24 relative z-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Flexible Plans for Every Creator
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Choose a recurring subscription for continuous coins or grab a
            one-time coin pack. All purchases require login.
          </p>
        </div>

        {/* Subscription Plans Grid */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {allDisplayPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col bg-transparent text-white shadow-lg backdrop-blur-md border ${
                plan.isHighlighted
                  ? "border-teal-500 ring-2 ring-cyan-500/50 relative"
                  : "border-white/20"
              }`}
            >
              {plan.isHighlighted && (
                <Badge
                  variant="default"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black px-3 py-1 text-sm font-semibold"
                >
                  Best Value
                </Badge>
              )}
              <CardHeader className="pt-8 pb-4 text-center">
                <CardTitle className="text-2xl font-semibold mb-2">
                  {plan.name}
                </CardTitle>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="h-7 w-7 text-cyan-400" />
                  <span className="text-3xl font-bold">
                    {plan.coins.toLocaleString()}
                  </span>
                </div>
                <CardDescription className="text-gray-300 h-10 min-h-[2.5rem]">
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
                  onClick={handleGetPlanOrTopUp}
                  className={`w-full text-lg py-3 font-semibold ${
                    plan.isHighlighted
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black"
                      : "bg-white/10 border border-white/30 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* --- Coin Top-Up Section (Copied and adapted from BillingPage) --- */}
        <section className="w-full max-w-5xl mx-auto mt-0 mb-16">
          {" "}
          {/* Adjusted mt-0 mb-16 */}
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 flex items-center gap-2">
              {" "}
              {/* Matched heading size */}
              <Zap className="h-7 w-7 text-teal-400" />
              One-Time Coin Top-Up
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              Need a specific amount? Get {COINS_PER_DOLLAR} coins per $1
              (minimum ${MIN_CUSTOM_TOP_UP_USD} purchase). Login to complete
              purchase.
            </p>
          </div>
          <Card className="w-full max-w-lg mx-auto bg-transparent text-white shadow-lg backdrop-blur-md border border-white/20 p-6 md:p-8">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl text-center">
                Enter Top-Up Amount (USD)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-4 space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="custom-amount-usd-pricingpage" // Unique ID
                  type="number"
                  placeholder={`${MIN_CUSTOM_TOP_UP_USD}`}
                  value={customTopUpAmountUSD}
                  onChange={(e) => setCustomTopUpAmountUSD(e.target.value)}
                  className="bg-dark-700 bg-transparent border-dark-400 h-12 text-lg pl-7 pr-4 focus:ring-teal-500 focus:border-teal-500"
                  min={MIN_CUSTOM_TOP_UP_USD.toString()}
                  step="1"
                />
              </div>
              {calculatedCustomCoins > 0 &&
                parseFloat(customTopUpAmountUSD) >= MIN_CUSTOM_TOP_UP_USD && (
                  <p className="text-center text-lg text-cyan-400">
                    You'll get approximately: {/* Changed wording slightly */}
                    <strong className="font-bold">
                      {calculatedCustomCoins.toLocaleString()}
                    </strong>{" "}
                    Coins
                  </p>
                )}
              {parseFloat(customTopUpAmountUSD) > 0 &&
                parseFloat(customTopUpAmountUSD) < MIN_CUSTOM_TOP_UP_USD && (
                  <p className="text-center text-sm text-yellow-400">
                    Minimum top-up is ${MIN_CUSTOM_TOP_UP_USD}.
                  </p>
                )}
            </CardContent>
            <CardFooter className="p-0 flex flex-col items-center">
              <Button
                onClick={handleGetPlanOrTopUp} // Re-use the same handler
                disabled={
                  parseFloat(customTopUpAmountUSD) < MIN_CUSTOM_TOP_UP_USD ||
                  isNaN(parseFloat(customTopUpAmountUSD))
                }
                className="w-full text-lg py-3 font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black"
              >
                Top-Up{" "}
                {calculatedCustomCoins > 0 &&
                parseFloat(customTopUpAmountUSD) >= MIN_CUSTOM_TOP_UP_USD
                  ? `${calculatedCustomCoins.toLocaleString()} Coins`
                  : "Now"}
              </Button>
            </CardFooter>
          </Card>
        </section>
        {/* --- End Coin Top-Up Section --- */}

        <div className="mb-16 text-center text-gray-400 max-w-xl mx-auto">
          <p>
            Coins can be used across all Shakaal AI generation tools. Unused
            coins do not expire. Login required for all purchases.
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-transparent border border-white/20 rounded-lg mb-3 backdrop-blur-md overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg hover:no-underline text-white font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
