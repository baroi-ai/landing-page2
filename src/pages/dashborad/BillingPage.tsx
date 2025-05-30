// src/pages/dashboard/BillingPage.tsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
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
// Accordion removed as it's not used in this version
import { authenticatedFetch } from "@/lib/authApi";
import { Check, Coins, CreditCard, History, Loader2 } from "lucide-react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
  FUNDING,
} from "@paypal/react-paypal-js";
import { toast } from "sonner"; // Assuming you use sonner for toasts

interface PricingPlan {
  id: string; // Add an ID like "starter", "value", "pro"
  name: string;
  coins: number;
  price: string; // Display price like "$5"
  priceDecimal: number; // Actual price for API e.g. 5.00
  currency: string; // e.g. "USD"
  description: string;
  features: string[];
  isHighlighted?: boolean;
  buttonText?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Pack",
    coins: 100,
    price: "$5",
    priceDecimal: 5.0,
    currency: "USD",
    description: "Quick top-up for basic needs.",
    features: ["~10-20 generations", "Standard queue priority"],
    buttonText: "Add 100 Coins",
  },
  {
    id: "value",
    name: "Value Pack",
    coins: 500,
    price: "$20",
    priceDecimal: 20.0,
    currency: "USD",
    description: "Best value for regular usage.",
    features: [
      "~60-120 generations",
      "Access to premium models",
      "Faster queue priority",
    ],
    isHighlighted: true,
    buttonText: "Add 500 Coins",
  },
  {
    id: "pro",
    name: "Pro Pack",
    coins: 1000,
    price: "$35",
    priceDecimal: 35.0,
    currency: "USD",
    description: "Ideal for heavy users.",
    features: [
      "~150-300 generations",
      "Access all premium models",
      "Highest queue priority",
    ],
    buttonText: "Add 1000 Coins",
  },
];

// Replace with your actual PayPal Client ID from environment variables
const PAYPAL_CLIENT_ID =
  "AXPIQN4lbzupZFGSDrj1OR8O-PcCax7_-OYeJETv9itFChVIRp4EP9YSgdGA6lTv5uZy5QUu656XMLNz";

const paypalScriptOptions: ReactPayPalScriptOptions = {
  clientId: PAYPAL_CLIENT_ID,
  currency: "USD", // Default currency, can be overridden per transaction
  intent: "capture",
};

const BillingPage = () => {
  const [currentCoins, setCurrentCoins] = useState(0); // Fetch this
  const [isLoadingPurchase, setIsLoadingPurchase] = useState<string | null>(
    null
  ); // Store plan.id being processed
  const [showPayPalButtonsForPlan, setShowPayPalButtonsForPlan] = useState<
    string | null
  >(null);

  // --- Mock fetching user data ---
  useEffect(() => {
    // TODO: Replace with actual API call to fetch user's coin balance
    const fetchUserBalance = async () => {
      // const token = localStorage.getItem("access");
      // if (!token) return;
      // try {
      //   const response = await fetch("/api/user/profile", { headers: { 'Authorization': `Bearer ${token}` }});
      //   if (response.ok) {
      //     const data = await response.json();
      //     setCurrentCoins(data.coin_balance || 0);
      //   }
      // } catch (error) {
      //   console.error("Failed to fetch user balance", error);
      // }
      setCurrentCoins(1234); // Placeholder
    };
    fetchUserBalance();
  }, []);

  const handleInitiatePurchase = (plan: PricingPlan) => {
    if (isLoadingPurchase) return; // Prevent multiple clicks
    setShowPayPalButtonsForPlan(plan.id); // Show PayPal buttons for this plan
  };

  const createOrder = async (
    data: Record<string, unknown>,
    actions: any,
    plan: PricingPlan
  ) => {
    setIsLoadingPurchase(plan.id);
    console.log(
      "Creating order for plan:",
      plan.id,
      "Amount:",
      plan.priceDecimal,
      plan.currency
    );
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("Authentication required. Please log in.");
      setIsLoadingPurchase(null);
      setShowPayPalButtonsForPlan(null);
      return "";
    }

    try {
      const response = await authenticatedFetch(
        "http://127.0.0.1:8000/api/billing/paypal/create-order/",
        {
          // Your DRF endpoint
          method: "POST",
          body: JSON.stringify({
            planId: plan.id, // Send the plan identifier
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: "Failed to create order." }));
        throw new Error(
          errorData.error || errorData.detail || "Server error creating order."
        );
      }
      const orderData = await response.json();
      if (orderData.orderID) {
        toast.info("PayPal order created. Please complete your payment.");
        return orderData.orderID;
      } else {
        throw new Error("PayPal Order ID not received.");
      }
    } catch (error: any) {
      console.error("Create PayPal order error:", error);
      toast.error(`Error creating order: ${error.message}`);
      setIsLoadingPurchase(null);
      setShowPayPalButtonsForPlan(null);
      return ""; // Must return a string for PayPal SDK
    } finally {
      // setIsLoadingPurchase(null); // Keep loading until onApprove or onCancel
    }
  };

  const onApprove = async (data: any, actions: any, plan: PricingPlan) => {
    console.log("PayPal payment approved:", data);
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error(
        "Authentication error after payment. Please contact support."
      );
      setIsLoadingPurchase(null);
      setShowPayPalButtonsForPlan(null);
      return; // Or actions.restart() if applicable
    }

    try {
      const response = await fetch("/api/billing/paypal/capture-order/", {
        // Your DRF endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Payment successful! Coins added.");
        setCurrentCoins(result.new_balance || ((prev) => prev + plan.coins)); // Update balance
      } else {
        throw new Error(result.error || "Failed to capture payment on server.");
      }
    } catch (error: any) {
      console.error("Capture PayPal order error:", error);
      toast.error(
        `Payment capture failed: ${error.message}. Please contact support if debited.`
      );
    } finally {
      setIsLoadingPurchase(null);
      setShowPayPalButtonsForPlan(null);
    }
  };

  const onError = (err: any, planId: string) => {
    console.error("PayPal Checkout Error for plan", planId, ":", err);
    toast.error("PayPal checkout error. Please try again or contact support.");
    setIsLoadingPurchase(null);
    setShowPayPalButtonsForPlan(null);
  };

  const onCancel = (data: any, planId: string) => {
    console.log("PayPal Checkout Canceled for plan", planId, ":", data);
    toast.info("Purchase canceled.");
    setIsLoadingPurchase(null);
    setShowPayPalButtonsForPlan(null);
  };

  return (
    <DashboardLayout>
      <PayPalScriptProvider options={paypalScriptOptions}>
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-cyan-500" />
                Billing & Coins
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your coin balance, purchase more coins, and view usage
                details.
              </p>
            </div>
            <div className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2 text-center sm:text-right min-w-[180px]">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-semibold text-cyan-400 flex items-center justify-center sm:justify-end gap-2">
                <Coins className="h-5 w-5" />
                <span>{currentCoins.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <main className="flex-grow flex flex-col items-center px-4 py-16 sm:py-24 relative z-10">
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`flex flex-col bg-transparent text-white shadow-lg backdrop-blur-md border ${
                    plan.isHighlighted
                      ? "border-cyan-500 ring-2 ring-cyan-500/50 relative"
                      : "border-white/20"
                  }`}
                >
                  {plan.isHighlighted && (
                    <Badge
                      variant="default"
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-dark-700 px-3 py-1 text-sm font-semibold"
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
                      <span className="text-4xl font-extrabold">
                        {plan.price}
                      </span>
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
                  <CardFooter className="p-6 pt-0 flex flex-col items-center">
                    {" "}
                    {/* Updated for PayPal buttons */}
                    {showPayPalButtonsForPlan !== plan.id && (
                      <Button
                        onClick={() => handleInitiatePurchase(plan)}
                        disabled={!!isLoadingPurchase} // Disable if any purchase is in progress
                        className={`w-full text-lg py-3 ${
                          plan.isHighlighted
                            ? "bg-cyan-500 text-dark-700 hover:bg-cyan-600"
                            : "bg-white/10 border border-white/30 text-white hover:bg-white/20"
                        }`}
                      >
                        {isLoadingPurchase === plan.id ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : null}
                        {plan.buttonText || `Get ${plan.coins} Coins`}
                      </Button>
                    )}
                    {showPayPalButtonsForPlan === plan.id && (
                      <div className="w-full mt-4">
                        {isLoadingPurchase === plan.id && (
                          <div className="flex justify-center items-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                            <p className="ml-2 text-muted-foreground">
                              Preparing PayPal...
                            </p>
                          </div>
                        )}
                        <PayPalButtons
                          style={{
                            layout: "vertical",
                            color: "blue",
                            shape: "rect",
                            label: "pay",
                            tagline: false,
                          }}
                          createOrder={(data, actions) =>
                            createOrder(data, actions, plan)
                          }
                          onApprove={(data, actions) =>
                            onApprove(data, actions, plan)
                          }
                          onError={(err) => onError(err, plan.id)}
                          onCancel={(data) => onCancel(data, plan.id)}
                          fundingSource={FUNDING.PAYPAL} // Can add other funding sources like FUNDING.CARD
                          disabled={
                            isLoadingPurchase !== null &&
                            isLoadingPurchase !== plan.id
                          } // Disable if another plan is loading
                        />
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mb-16 text-center text-gray-400 max-w-xl mx-auto">
              <p>
                Coins can be used across all Glimmer AI generation tools. Unused
                coins do not expire.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <History className="h-6 w-6 text-muted-foreground" />
                Transaction History
              </h2>
              <Card className="bg-dark-600 border border-dark-400">
                <CardContent className="p-6 text-center text-muted-foreground">
                  Transaction history feature coming soon!
                  {/* TODO: Implement table/list of transactions */}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </PayPalScriptProvider>
    </DashboardLayout>
  );
};

export default BillingPage;
