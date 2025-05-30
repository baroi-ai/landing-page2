// src/pages/SignUpPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Response was not JSON:", responseText);
        throw new Error(
          response.statusText || "Server returned an invalid response."
        );
      }

      if (!response.ok) {
        let errorMessage = "Registration failed. Please try again.";
        if (data && typeof data === "object") {
          if (
            data.email &&
            Array.isArray(data.email) &&
            data.email.length > 0
          ) {
            errorMessage = data.email[0];
          } else if (
            data.password &&
            Array.isArray(data.password) &&
            data.password.length > 0
          ) {
            errorMessage = data.password[0];
          } else if (
            data.non_field_errors &&
            Array.isArray(data.non_field_errors) &&
            data.non_field_errors.length > 0
          ) {
            errorMessage = data.non_field_errors[0];
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (data.message) {
            errorMessage = data.message;
          } else {
            const errorKeys = Object.keys(data);
            if (errorKeys.length > 0) {
              const firstErrorField = data[errorKeys[0]];
              if (
                Array.isArray(firstErrorField) &&
                firstErrorField.length > 0
              ) {
                errorMessage = `${errorKeys[0]}: ${firstErrorField[0]}`;
              } else if (typeof firstErrorField === "string") {
                errorMessage = `${errorKeys[0]}: ${firstErrorField}`;
              }
            }
          }
        }
        if (
          errorMessage === "Registration failed. Please try again." &&
          data &&
          typeof data === "object"
        ) {
          console.warn("Unhandled error structure from backend:", data);
        }
        throw new Error(errorMessage);
      }

      // Registration successful - tokens should be in 'data'
      if (data.access && data.refresh) {
        setSuccessMessage(
          data.message || "User created successfully! Logging you in..."
        );

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        // Optionally store user info if needed globally, e.g., in context or Zustand
        // if (data.user) {
        //   localStorage.setItem("currentUser", JSON.stringify(data.user));
        // }

        // Remove onboarding_complete flag if it exists, so they definitely go through onboarding
        localStorage.removeItem("onboarding_complete");

        // Navigate to onboarding
        // Add a slight delay so user can see the success message
        setTimeout(() => {
          navigate("/onboarding/welcome");
        }, 1500);
      } else {
        // This case should ideally not happen if backend is correct
        console.error(
          "Registration successful, but tokens not received.",
          data
        );
        setError(
          "Registration completed, but auto-login failed. Please try logging in manually."
        );
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // ... (handleGoogleSignUp and return JSX remains the same)
  const handleGoogleSignUp = () => {
    setError("Google Sign-Up is not implemented yet.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Navbar />
      <div className="absolute inset-0 hero-gradient z-0"></div>
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <Card className="w-full max-w-sm bg-transparent text-white mt-10 mb-10 shadow-lg backdrop-blur-md border border-white/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your details below to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {successMessage && (
              <Alert
                variant="default"
                className="bg-green-500/20 border-green-500/50 text-green-200"
              >
                <AlertCircle className="h-4 w-4 text-green-400" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            {error && !successMessage && (
              <Alert
                variant="destructive"
                className="bg-red-500/20 border-red-500/50 text-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || !!successMessage} // Disable if successful too
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••••• (min 8 chars)"
                  required
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || !!successMessage}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading || !!successMessage}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-cyan-600 text-white hover:bg-cyan-700"
                disabled={isLoading || !!successMessage}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign Up
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white"
              onClick={handleGoogleSignUp}
              disabled={isLoading || !!successMessage}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Sign Up with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-4">
            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-cyan-500 hover:text-cyan-400 hover:underline"
              >
                Login
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;
