// src/pages/ContactPage.tsx (or your preferred path)

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
import { Textarea } from "@/components/ui/textarea"; // Import Textarea

const ContactPage = () => {
  // Add state management for form fields later
  // const [name, setName] = React.useState('');
  // const [email, setEmail] = React.useState('');
  // const [subject, setSubject] = React.useState('');
  // const [message, setMessage] = React.useState('');

  // const handleSubmit = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   console.log('Form submitted:', { name, email, subject, message });
  //   // Add actual form submission logic here (e.g., API call)
  // };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Navbar />

      {/* Gradient Overlay - Behind the content */}
      <div className="absolute inset-0 hero-gradient z-0"></div>

      {/* Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        {/* Contact Card: Transparent background, backdrop blur */}
        <Card className="w-full max-w-lg bg-transparent text-white mt-10 mb-10 shadow-lg backdrop-blur-md border border-white/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
            <CardDescription className="text-gray-300">
              Have a question or want to get in touch? Fill out the form below.
            </CardDescription>
          </CardHeader>
          {/* Wrap content in a form for semantics and potential onSubmit */}
          {/* <form onSubmit={handleSubmit}> */}
          <CardContent className="space-y-4">
            {/* Name Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500"
                  // value={name} onChange={e => setName(e.target.value)}
                />
              </div>
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500"
                  // value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Regarding..."
                className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500"
                // value={subject} onChange={e => setSubject(e.target.value)}
              />
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                required
                rows={5} // Adjust rows as needed
                className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500 min-h-[100px]" // Added min-height
                // value={message} onChange={e => setMessage(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            {/* Submit Button */}
            <Button
              type="submit" // Set type to submit if inside a <form>
              className="w-full bg-cyan text-white hover:bg-cyan-500"
            >
              Send Message
            </Button>
          </CardFooter>
          {/* </form> */}
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
