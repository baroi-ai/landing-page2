// src/pages/TermsAndConditionsPage.tsx

import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditionsPage = () => {
  const pageTitle = "Terms and Conditions | Deepshark AI";
  const pageDescription =
    "Read the terms and conditions for using the Deepshark AI platform and services.";
  const canonicalUrl = "https://deepsharkai.art/terms";

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-gray-300">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">
            Terms and Conditions
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Last Updated: July 12, 2025
          </p>

          <div className="prose prose-invert prose-lg max-w-none space-y-6">
            <p>
              Please read these Terms and Conditions ("Terms") carefully before
              using the https://deepsharkai.art/ website (the "Service")
              operated by Subhodeep Baroi, doing business as Shakaal AI ("us",
              "we", or "our").
            </p>

            <p>
              Your access to and use of the Service is conditioned upon your
              acceptance of and compliance with these Terms. These Terms apply
              to all visitors, users, and others who wish to access or use the
              Service.
            </p>

            <h2>1. Accounts</h2>
            <p>
              When you create an account with us, you guarantee that you are
              above the age of 13 and that the information you provide us is
              accurate, complete, and current at all times. You are responsible
              for safeguarding the password that you use to access the Service
              and for any activities or actions under your password.
            </p>

            <h2>2. Intellectual Property and User Content</h2>
            <p>
              The Service and its original content (excluding content generated
              by users), features, and functionality are and will remain the
              exclusive property of Deepshark AI.
            </p>
            <p>
              You retain all rights to and are solely responsible for the
              content you create and generate using our Services ("User
              Content"). You grant us a limited, worldwide, non-exclusive
              license to store, process, and deliver your User Content back to
              you. We do not claim any ownership rights over your User Content.
            </p>

            <h2>3. Acceptable Use</h2>
            <p>
              You agree not to use the Service to create any content that is
              unlawful, defamatory, harassing, abusive, fraudulent, obscene, or
              is otherwise objectionable. While we provide a less restrictive AI
              experience, you may not use the Service for any illegal
              activities, including but not limited to creating content that
              violates copyright, trademark, or privacy rights, or content that
              promotes hate speech or violence.
            </p>

            <h2>4. Payments, Credits, and Subscriptions</h2>
            <p>
              Our Service is offered on a pay-per-use basis through a system of
              "Credits". Credits can be purchased as one-time top-ups or through
              recurring subscriptions. All payments are processed through our
              third-party payment processor, Paddle.
            </p>
            <p>
              By purchasing Credits or a subscription, you agree to the pricing
              and payment terms presented to you for that Service. Subscription
              fees are billed in advance on a monthly or yearly basis and are
              non-refundable for the billing period they are purchased for. You
              may cancel your subscription at any time through your profile
              page, which will prevent future charges.
            </p>

            <h2>5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>

            <h2>6. Limitation Of Liability</h2>
            <p>
              In no event shall Deepshark AI, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              resulting from your access to or use of, or inability to access or
              use, the Service.
            </p>

            <h2>7. Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is
              provided on an "AS IS" and "AS AVAILABLE" basis. The service is
              provided without warranties of any kind, whether express or
              implied.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of [Your Country/State], without regard to its conflict of
              law provisions.
            </p>

            <h2>9. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. We will provide at least 30 days' notice
              prior to any new terms taking effect.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:{" "}
              <a href="mailto:support@sharkyai.xyz">support@sharkyai.xyz</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;
