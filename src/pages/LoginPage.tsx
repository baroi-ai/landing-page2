// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // or use Next.js router if applicable
import axios from "axios";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
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
import { Chrome } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // mapped to username for the API
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Sending credentials to the Django API endpoint
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: email, // using email as username; adjust if needed
        password,
      });

      // Store tokens and email in localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("email", email);

      // Redirect to the desired page after successful login
      navigate("/dashboard");
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Helmet>
        <title>Shakaal AI | Login</title>
      </Helmet>

      <Navbar />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient z-0"></div>

      {/* Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <Card className="w-full max-w-sm bg-transparent text-white mt-10 shadow-lg backdrop-blur-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin}>
              {/* Email Input */}
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
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="text-sm text-gray-400 hover:text-cyan-400 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-cyan text-white hover:bg-cyan-500 mt-4"
              >
                Login
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <Button
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-400 pt-2">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-cyan hover:text-cyan-300 hover:underline"
              >
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
