import React, { Suspense, lazy } from "react"; // ✅ 1. Import Suspense and lazy
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react"; // For the loading spinner
import PricingPage from "./pages/PricingPage";
import ComingSoon from "./pages/ComingSoon";

// ✅ 2. Create a simple loading component to show while pages are loading
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-dark-500">
    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
  </div>
);

// ✅ 3. Convert all static page imports to lazy-loaded imports
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PublicRoute = lazy(() => import("./components/PublicRoute"));
const PrivateRoute = lazy(() => import("./components/PrivateRoute"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const TermsAndConditionsPage = lazy(
  () => import("./pages/TermsAndConditionsPage")
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            {/* ✅ 4. Wrap your entire Routes component in Suspense */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/refund" element={<RefundPolicyPage />} />
                <Route path="/terms" element={<TermsAndConditionsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/soon" element={<ComingSoon />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
