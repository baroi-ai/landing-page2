// src/pages/PrivacyPolicyPage.tsx

import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  const pageTitle = "Privacy Policy | Deepshark AI";
  const pageDescription =
    "Understand how Deepshark AI collects, uses, and protects your personal data when you use our services.";
  const canonicalUrl = "https://sharkyai.xyz/privacy-policy";

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
            Privacy Policy
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Last Updated: July 12, 2025
          </p>

          <div className="prose prose-invert prose-lg max-w-none space-y-6">
            <p>
              Welcome to Deepshark AI ("we," "our," or "us"). We are committed
              to protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our website and services (collectively, the "Services").
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li>
                <strong>Personal Data:</strong> When you register for an
                account, we collect your email address. When you make a
                purchase, our payment processor, Paddle, will collect payment
                information such as your credit card details and billing
                address. We do not store your full payment card details on our
                servers.
              </li>
              <li>
                <strong>Usage Data:</strong> We automatically collect
                information about your interactions with our Services. This
                includes IP addresses, browser type, operating system, pages
                viewed, and the dates/times of your visits. This helps us
                maintain and improve our service.
              </li>
              <li>
                <strong>Generated Content:</strong> We temporarily store the
                content you generate (images, videos, audio) to deliver it to
                you. We do not claim ownership of your creations, and we have a
                policy for the retention and deletion of this data as described
                below.
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, operate, and maintain our Services.</li>
              <li>Process your transactions and manage your account.</li>
              <li>
                Communicate with you, including sending service-related emails
                and responding to support requests.
              </li>
              <li>Improve and personalize our Services.</li>
              <li>
                Prevent fraudulent activity and ensure the security of our
                platform.
              </li>
            </ul>

            <h2>3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal data. We may share your information
              with third parties under the following circumstances:
            </p>
            <ul>
              <li>
                <strong>Payment Processing:</strong> We share transaction
                information with Paddle to process payments, prevent fraud, and
                manage subscriptions.
              </li>
              <li>
                <strong>Service Providers:</strong> We may share information
                with third-party vendors and service providers that perform
                services on our behalf, such as cloud hosting (e.g., AWS, Google
                Cloud).
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may disclose your
                information if required to do so by law or in response to valid
                requests by public authorities.
              </li>
            </ul>

            <h2>4. Data Retention and Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety
              of your personal information. Your account information is stored
              behind secured networks. We retain your personal data only for as
              long as is necessary to provide you with our Services and for
              legitimate and essential business purposes, such as maintaining
              the performance of the Services and making data-driven business
              decisions. Generated content is retained on our servers for a
              limited period to ensure you can access and download it, after
              which it is automatically deleted.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal data, including the right to access, correct, or
              delete your data. You can manage your account information through
              your profile page or by contacting us directly.
            </p>

            <h2>6. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to operate and
              personalize our Service. Cookies are small files stored on your
              device. We use essential cookies for authentication and security.
              You can instruct your browser to refuse all cookies or to indicate
              when a cookie is being sent.
            </p>

            <h2>7. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last Updated" date.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:{" "}
              <a href="mailto:support@sharkyai.xyz">support@sharkyai.xyz</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
