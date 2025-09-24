import { SubscriptionPlanBase } from "@/types/billing";

export const subscriptionPlanBases: SubscriptionPlanBase[] = [
  {
    idPrefix: "starter",
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
      "Approx. 150 images",
    ],
  },
  {
    idPrefix: "value",
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
    idPrefix: "pro",
    name: "Pro Subscription",
    baseCoins: 1500,
    monthlyPriceDecimal: 49.0,
    yearlyPriceDecimal: 490.0,
    currency: "USD",
    description: "Max coins & priority for power users.",
    features: [
      "Automatic coin refills",
      "Cancel anytime",
      "Best for video generation",
      "Approx. 40 videos",
    ],
  },
];

export type BillingCycle = "monthly" | "yearly";

export const COINS_PER_DOLLAR = 20;
export const MIN_CUSTOM_TOP_UP_USD = 5;
export const MAX_CUSTOM_TOP_UP_USD = 500;