// src/pages/RefundPolicyPage.tsx

import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RefundPolicyPage = () => {
  const pageTitle = "Refund Policy | Deepshark AI";
  const pageDescription =
    "Review the refund and cancellation policy for credit purchases and subscriptions on the Deepshark AI platform.";
  const canonicalUrl = "https://sharkyai.xyz/refund-policy";

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
            Refund Policy
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Last Updated: July 12, 2025
          </p>

          <div className="prose prose-invert prose-lg max-w-none space-y-6">
            <h2>Overview</h2>
            <p>
              At Deepshark AI, we are committed to customer satisfaction. This
              policy outlines the terms under which refunds may be issued for
              our digital products, including one-time Credit purchases and
              recurring subscriptions.
            </p>

            <h2>1. One-Time Credit Purchases ("Top-Ups")</h2>
            <p>
              Purchases of digital Credits are final and generally
              non-refundable.
            </p>
            <p>
              Because Credits are a digital consumable good and are made
              available for use in your account immediately after purchase, we
              do not offer refunds once a purchase is completed. Please ensure
              you are certain about your purchase before finalizing the
              transaction.
            </p>
            <p>
              <strong>Used Credits are strictly non-refundable.</strong> Once
              you consume Credits to perform an action (e.g., generate an image,
              video, or voice), those Credits are permanently spent and cannot
              be refunded under any circumstances.
            </p>

            <h2>2. Subscription Plans</h2>
            <p>
              Payments for monthly and yearly subscription plans are billed in
              advance for the upcoming billing cycle and are non-refundable.
            </p>
            <p>
              If you purchase a subscription, you are charged automatically at
              the beginning of each billing period (either monthly or yearly).
              We do not offer prorated refunds or credits for partially used
              subscription periods.
            </p>
            <h3>Subscription Cancellations</h3>
            <p>
              You can cancel your subscription at any time from your Profile
              page. When you cancel, you will retain access to the subscription
              benefits until the end of your current billing period. You will
              not be charged for any subsequent billing cycles.
            </p>

            <h2>3. Exceptions</h2>
            <p>
              We may consider providing a refund in the following exceptional
              circumstances, at our sole discretion:
            </p>
            <ul>
              <li>
                <strong>Accidental Duplicate Purchase:</strong> If you
                accidentally purchase the same plan or credit pack twice, please
                contact our support within 24 hours. We will review the case and
                may refund the duplicate transaction.
              </li>
              <li>
                <strong>Documented Technical Failure:</strong> If you experience
                a verifiable technical failure on our platform that resulted in
                your Credits being consumed without receiving the service,
                please contact support with detailed information (e.g., error
                messages, screenshots). If we can confirm the platform error, we
                will reinstate the lost Credits to your account. Monetary
                refunds are not provided in this case; the remedy is the
                restoration of used Credits.
              </li>
            </ul>

            <h2>4. How to Request a Review</h2>
            <p>
              To request a refund review based on the exceptions listed above,
              please contact our support team at{" "}
              <a href="mailto:support@sharkyai.xyz">support@sharkyai.xyz</a>{" "}
              with your account email address and a detailed explanation of the
              issue.
            </p>
            <p>
              All refund requests are reviewed on a case-by-case basis. We
              reserve the right to decline any refund request that does not meet
              the criteria outlined in this policy.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
