export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
}
  
export interface PlanFeatures {
    text: string;
    isAvailable: boolean;
}

export interface SubscriptionPlanBase {
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

export interface PurchaseablePlan {
    planId: string;
    planType: "subscription";
    displayName: string;
    coins: number;
    priceDecimal: number;
    currency: string;
    billingCycleText?: string;
    isHighlighted?: boolean;
    originalName?: string;
    description?: string;
    features?: PlanFeatures[];
}

export interface UserProfile {
    credits: number;
}

export interface ApiTransaction {
    id: string;
    user_id: number;
    amount: number;
    transaction_type: string;
    description: string | null;
    timestamp: string;
    plan_name?: string | null;
    amount_paid_decimal?: number | null;
    currency_paid?: string | null;
    payment_provider_order_id?: string | null;
    payment_status?: PaymentStatus | null;
}

export interface PaginatedTransactionsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ApiTransaction[];
    total_pages?: number;
    current_page?: number;
}