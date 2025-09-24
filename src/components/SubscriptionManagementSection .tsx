import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authenticatedFetch } from "@/api/authApi";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useAuth } from "./AuthContext";

// Interface for data received from the backend
interface Subscription {
  id: string;
  plan_name_from_app: string;
  status: string;
  status_display?: string;
  renews_at: string | null;
  ends_at: string | null;
  coins_granted_per_cycle: number;
  billing_cycle_type: string;
}

const SubscriptionManagementSection: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authenticatedFetch("/api/billing/subscription/");

      if (response.status === 204) {
        setSubscription(null);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to load subscription`);
      }

      const data: Subscription = await response.json();
      setSubscription(data);
    } catch (error: any) {
      console.error("Error fetching subscription:", error);
      if (!error.message.includes("User not authenticated")) {
        toast.error(
          error.message || "Could not load your subscription information."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    setIsUpdating(true);
    toast.info("Attempting to cancel your subscription...");
    try {
      const response = await authenticatedFetch(
        `/api/billing/subscription/cancel/`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to cancel subscription.");
      }

      const updatedSubscriptionData = await response.json();
      setSubscription(updatedSubscriptionData);
      toast.success(
        "Your subscription is now set to cancel at the end of the billing period."
      );
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      toast.error(error.message || "Could not cancel your subscription.");
    } finally {
      setIsUpdating(false);
      setIsCancelDialogOpen(false);
    }
  };

  const cardClasses = `border border-teal-500/30 bg-muted/20 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300 ease-in-out hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] max-w-2xl mx-auto`;

  return (
    <div className="space-y-8 pb-16">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center md:text-left">
        My Subscription
      </h1>
      <Card className={cardClasses}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Manage Subscription</CardTitle>
          <CardDescription>
            View your active plan details or make changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : subscription ? (
            <div className="space-y-3 text-foreground text-center sm:text-left p-4 rounded-lg bg-dark-600/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div className="font-semibold text-muted-foreground">Plan</div>
                <div>
                  {subscription.plan_name_from_app
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
                <div className="font-semibold text-muted-foreground">
                  Status
                </div>
                <div className="capitalize">
                  {subscription.status.replace(/_/g, " ")}
                </div>
                <div className="font-semibold text-muted-foreground">
                  Credits per cycle
                </div>
                <div>
                  {subscription.coins_granted_per_cycle.toLocaleString()} /{" "}
                  {subscription.billing_cycle_type}
                </div>
                {subscription.renews_at && subscription.status === "active" && (
                  <>
                    <div className="font-semibold text-muted-foreground">
                      Next payment
                    </div>
                    <div>
                      {new Date(subscription.renews_at).toLocaleDateString()}
                    </div>
                  </>
                )}
                {subscription.ends_at &&
                  subscription.status === "cancelled" && (
                    <>
                      <div className="font-semibold text-muted-foreground">
                        Access ends on
                      </div>
                      <div className="text-yellow-400">
                        {new Date(subscription.ends_at).toLocaleDateString()}
                      </div>
                    </>
                  )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              You do not have an active subscription.
            </div>
          )}
        </CardContent>
        {subscription && (
          // *** THE FIX IS HERE ***
          <CardFooter className="flex justify-center">
            {subscription.status === "active" && (
              <Button
                variant="destructive"
                onClick={() => setIsCancelDialogOpen(true)}
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Subscription
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-destructive">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              <XCircle className="inline-block mr-2 h-5 w-5" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to cancel? Your subscription will remain
              active until the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isUpdating}>
                Keep Subscription
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Yes, Cancel Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManagementSection;
