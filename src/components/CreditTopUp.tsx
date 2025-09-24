import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Zap } from "lucide-react";
import { authenticatedFetch } from "@/api/authApi";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import {
  COINS_PER_DOLLAR,
  MIN_CUSTOM_TOP_UP_USD,
  MAX_CUSTOM_TOP_UP_USD,
} from "@/config/billing";

interface CreditTopUpProps {
  isAuthenticated: boolean;
  customTopUpAmountUSD: string;
  setCustomTopUpAmountUSD: (amount: string) => void;
  activePayPalView: string | null;
  setActivePayPalView: (view: string | null) => void;
  isProcessingPayment: boolean;
  setIsProcessingPayment: (isProcessing: boolean) => void;
  isPayPalScriptLoading: boolean;
  isPayPalScriptReady: boolean;
  fetchUserCreditsAndProfile: () => void;
  fetchTransactions: (page: number) => void;
  navigate: (path: string, options?: any) => void;
  location: any;
}

const CreditTopUp: React.FC<CreditTopUpProps> = ({
  isAuthenticated,
  customTopUpAmountUSD,
  setCustomTopUpAmountUSD,
  activePayPalView,
  setActivePayPalView,
  isProcessingPayment,
  setIsProcessingPayment,
  isPayPalScriptLoading,
  isPayPalScriptReady,
  fetchUserCreditsAndProfile,
  fetchTransactions,
  navigate,
  location,
}) => {
  const calculatedCustomCoins = useMemo(() => {
    const amount = parseFloat(customTopUpAmountUSD);
    return !isNaN(amount) && amount >= 0.01
      ? Math.floor(amount * COINS_PER_DOLLAR)
      : 0;
  }, [customTopUpAmountUSD]);

  const handleTopUpClick = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to top-up.");
      navigate("/login", { state: { from: location } });
      return;
    }
    const amount = parseFloat(customTopUpAmountUSD);
    if (
      isNaN(amount) ||
      amount < MIN_CUSTOM_TOP_UP_USD ||
      amount > MAX_CUSTOM_TOP_UP_USD
    ) {
      toast.error(
        `Please enter an amount between $${MIN_CUSTOM_TOP_UP_USD} and $${MAX_CUSTOM_TOP_UP_USD}.`
      );
      return;
    }
    setActivePayPalView("top-up");
  };

  const renderPayPalButtonsForTopUp = () => {
    const commonErrorHandling = (err: any) => {
      console.error("PayPal Error:", err);
      toast.error("An error occurred with PayPal. Please try again.");
      setIsProcessingPayment(false);
      setActivePayPalView(null);
    };

    const commonCancelHandling = () => {
      toast.info("Payment cancelled.");
      setActivePayPalView(null);
      setIsProcessingPayment(false);
    };

    if (isPayPalScriptLoading || !isPayPalScriptReady) {
      return (
        <div className="w-full flex flex-col items-center justify-center min-h-[52px]">
          <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[52px] relative">
        {isProcessingPayment && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10 rounded">
            <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
          </div>
        )}
        {activePayPalView === "top-up" && (
          <PayPalButtons
            style={{ layout: "vertical", height: 48, color: "black" }}
            forceReRender={[customTopUpAmountUSD]}
            createOrder={async () => {
              setIsProcessingPayment(true);
              try {
                const response = await authenticatedFetch(
                  "/api/billing/paypal/create-order/",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      amount_usd: customTopUpAmountUSD,
                    }),
                  }
                );
                const data = await response.json();
                if (!response.ok) {
                  throw new Error(data.detail || "Failed to create order.");
                }
                return data.orderID;
              } catch (error: any) {
                toast.error(error.message);
                setIsProcessingPayment(false);
                setActivePayPalView(null);
                throw error;
              }
            }}
            onApprove={async (data) => {
              try {
                const response = await authenticatedFetch(
                  "/api/billing/paypal/capture-order/",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ orderID: data.orderID }),
                  }
                );
                const responseData = await response.json();
                if (!response.ok) {
                  throw new Error(responseData.detail || "Payment failed.");
                }
                toast.success(
                  `Success! ${responseData.credits_granted.toLocaleString()} credits added.`
                );
                fetchUserCreditsAndProfile();
                fetchTransactions(1);
              } catch (error: any) {
                toast.error(error.message);
              } finally {
                setIsProcessingPayment(false);
                setActivePayPalView(null);
              }
            }}
            onError={commonErrorHandling}
            onCancel={commonCancelHandling}
            disabled={isProcessingPayment}
          />
        )}
      </div>
    );
  };

  return (
    <section className="mt-16">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-7 w-7 text-teal-400" /> Credit Top-Up
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Need more credits? Get {COINS_PER_DOLLAR} credits per $1 (minimum $
          {MIN_CUSTOM_TOP_UP_USD} purchase).
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
              id="custom-amount-usd"
              type="number"
              placeholder={`${MIN_CUSTOM_TOP_UP_USD}`}
              value={customTopUpAmountUSD}
              onChange={(e) => setCustomTopUpAmountUSD(e.target.value)}
              className="bg-dark-700 bg-transparent border-dark-400 h-12 text-lg pl-7 pr-4 focus:ring-teal-500 focus:border-teal-500"
              min={MIN_CUSTOM_TOP_UP_USD.toString()}
              max={MAX_CUSTOM_TOP_UP_USD.toString()}
              step="1"
            />
          </div>
          {calculatedCustomCoins > 0 &&
            parseFloat(customTopUpAmountUSD) >= MIN_CUSTOM_TOP_UP_USD && (
              <p className="text-center text-lg text-cyan-400">
                You'll receive:{" "}
                <strong className="font-bold">
                  {calculatedCustomCoins.toLocaleString()}
                </strong>{" "}
                Credits
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
          {renderPayPalButtonsForTopUp()}
          {activePayPalView !== "top-up" && (
            <Button
              onClick={handleTopUpClick}
              disabled={
                !!activePayPalView ||
                isNaN(parseFloat(customTopUpAmountUSD)) ||
                parseFloat(customTopUpAmountUSD) < MIN_CUSTOM_TOP_UP_USD
              }
              className="w-full text-lg py-3 font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black"
            >
              Top-Up with PayPal
            </Button>
          )}
        </CardFooter>
      </Card>
    </section>
  );
};

export default CreditTopUp;
