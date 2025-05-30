// src/pages/ForgotPasswordPage.tsx (or your preferred path)

import React from "react";
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
import { Link } from "react-router-dom"; // Assuming react-router-dom
import { Mail } from "lucide-react"; // Optional icon

const ForgotPasswordPage = () => {
  // Add state for email input and submission status later
  // const [email, setEmail] = React.useState('');
  // const [isSubmitted, setIsSubmitted] = React.useState(false);

  // const handleSubmit = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   console.log('Password reset requested for:', email);
  //   // Add API call logic here
  //   setIsSubmitted(true); // Example: Show confirmation message
  // };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Navbar />

      {/* Gradient Overlay - Behind the content */}
      <div className="absolute inset-0 hero-gradient z-0"></div>

      {/* Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        {/* Forgot Password Card */}
        <Card className="w-full max-w-sm bg-transparent text-white mt-10 mb-10 shadow-lg backdrop-blur-md border border-white/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Forgot Password
            </CardTitle>
            {/* Conditionally render description or success message */}
            {/* {!isSubmitted ? ( */}
            <CardDescription className="text-gray-300 pt-1">
              Enter your email address below and we'll send you a link to reset
              your password.
            </CardDescription>
            {/* ) : (
              <CardDescription className="text-cyan-400 pt-1">
                If an account exists for {email}, you will receive an email with reset instructions shortly.
              </CardDescription>
            )} */}
          </CardHeader>

          {/* Hide form after submission */}
          {/* {!isSubmitted && ( */}
          {/* <form onSubmit={handleSubmit}> */}
          <CardContent className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                {" "}
                {/* Wrapper for potential icon */}
                {/* Optional Icon inside input */}
                {/* <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500" // Add pl-10 if using icon
                  // value={email}
                  // onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {" "}
            {/* Added space-y-4 */}
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-cyan text-white hover:bg-cyan-500"
            >
              Send Reset Link
            </Button>
            {/* Back to Login Link */}
            <p className="text-center text-sm text-gray-400 pt-1">
              Remembered your password?{" "}
              <Link
                to="/login" // Point to your login route
                className="font-medium text-cyan hover:text-cyan-300 hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
          {/* </form> */}
          {/* )} */}
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
