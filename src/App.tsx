import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import AIModelsPage from "./pages/AIModelsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardOverviewPage from "./pages/dashborad/DashboardOverviewPage";
import ProfilePage from "./pages/dashborad/ProfilePage";
import ImageGenerationPage from "./pages/dashborad/ImageGenerationPage";
import VideoGenerationPage from "./pages/dashborad/VideoGenerationPage";
import VoiceGenerationPage from "./pages/dashborad/VoiceGenerationPage";
import ModelGenerationPage from "./pages/dashborad/ModelGenerationPage";
import AIModelExplorerPage from "./pages/dashborad/AIModelExplorerPage";
import BillingPage from "./pages/dashborad/BillingPage";
import MyGenerationsPage from "./pages/dashborad/MyGenerationsPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import ChatPage from "./pages/dashborad/ChatPage";
import AllToolsPage from "./pages/dashborad/AllToolsPage";
import ExploreToolsPage from "./pages/exploreToolsPage";
import BgRemoverPage from "./pages/dashborad/BgRemoverPage";
import WelcomeStepPage from "./pages/onboarding/WelcomeStepPage";
import InterestsStepPage from "./pages/onboarding/InterestsStepPage";
import CompletionStepPage from "./pages/onboarding/CompletionStepPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ai-models" element={<AIModelsPage />} />
          <Route path="/ai-tools" element={<ExploreToolsPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />

          <Route element={<PrivateRoute />}>
            {/* <Route path="/dashboard" element={<DashboardOverviewPage />} /> */}
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/chats" element={<ChatPage />} />
            <Route
              path="/dashboard/generate/image"
              element={<ImageGenerationPage />}
            />
            <Route
              path="/dashboard/generate/video"
              element={<VideoGenerationPage />}
            />
            <Route
              path="/dashboard/generate/voice"
              element={<VoiceGenerationPage />}
            />

            <Route path="/onboarding/welcome" element={<WelcomeStepPage />} />
            <Route
              path="/onboarding/interests"
              element={<InterestsStepPage />}
            />
            <Route
              path="/onboarding/Completion"
              element={<CompletionStepPage />}
            />

            <Route path="/dashboard/bg-remover" element={<BgRemoverPage />} />

            <Route path="/dashboard" element={<AllToolsPage />} />

            <Route
              path="/dashboard/generate/3d"
              element={<ModelGenerationPage />}
            />
            <Route
              path="/dashboard/explore"
              element={<AIModelExplorerPage />}
            />
            <Route path="/dashboard/billing" element={<BillingPage />} />
            <Route
              path="/dashboard/generations"
              element={<MyGenerationsPage />}
            />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
