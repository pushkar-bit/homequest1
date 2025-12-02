import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyTerms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            HomeQuest – Privacy Policy
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: 2/12/25
          </p>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Welcome to HomeQuest. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, including our website, mobile app, and any related services (collectively, the "Service").
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              By accessing or using HomeQuest, you agree to this Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect information to provide and improve our services. This includes:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              A. Personal Information You Provide
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Address or location details</li>
              <li>User account login details</li>
              <li>Property preferences and saved listings</li>
              <li>Messages or interactions you send through the platform (e.g., inquiries to agents)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              B. Automatically Collected Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              When you use HomeQuest, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>IP address</li>
              <li>Browser type / device type</li>
              <li>Cookies and tracking data</li>
              <li>Pages viewed and usage statistics</li>
              <li>Location (if you permit it)</li>
              <li>App performance and crash logs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              C. Property & Listing Data
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>Information submitted by property owners, brokers, or agents</li>
              <li>Photos, documents, property descriptions</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">We use your data to:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>Create and manage your HomeQuest account</li>
              <li>Show relevant property listings</li>
              <li>Improve user experience and site/app performance</li>
              <li>Enable communication between buyers, owners, and agents</li>
              <li>Provide support and respond to inquiries</li>
              <li>Personalize recommendations and search results</li>
              <li>Perform analytics and improve business operations</li>
              <li>Ensure security, prevent fraud, and enforce policies</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. Sharing of Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 font-semibold">
              We do not sell your personal data.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">We may share information with:</p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              A. Verified Real-Estate Agents, Builders, or Property Owners
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To enable communication or schedule property visits.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              B. Service Providers
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">For:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>Hosting</li>
              <li>Analytics</li>
              <li>Payment processing</li>
              <li>Customer support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              C. Legal and Compliance
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">We may disclose information if required:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>By law or government authority</li>
              <li>To protect our rights, users, or prevent fraud</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              D. Business Transfers
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              In case of merger, acquisition, or restructuring, your data may be transferred to the new entity.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              HomeQuest uses cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>Improve website performance</li>
              <li>Remember your preferences</li>
              <li>Show customized results</li>
              <li>Analyse site usage</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You can disable cookies in your browser settings, but some features may not function properly.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Data Retention
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">We retain your information:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>As long as your account is active</li>
              <li>As needed for business or legal purposes</li>
              <li>Archived for analytics or compliance when required</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You may request deletion of your data at any time (see Section 8).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>SSL encryption</li>
              <li>Secure storage</li>
              <li>Limited access to personal data internally</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              HomeQuest does not knowingly collect data from users under the age of 18. If such information is collected accidentally, we will delete it immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              8. Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Depending on your location, you may have rights to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account/data</li>
              <li>Opt out of marketing communications</li>
              <li>Request export of your data</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You can exercise these rights by contacting:{' '}
              <a href="mailto:support@homequest.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                support@homequest.com
              </a>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              9. Third-Party Links
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              HomeQuest may include links to external websites. We are not responsible for the privacy practices of those websites.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated "Last Updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              For questions or concerns regarding this Privacy Policy, contact us at:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-4">
              <p className="text-gray-900 dark:text-white font-semibold">HomeQuest – Privacy Team</p>
              <p className="text-gray-700 dark:text-gray-300">
                Email:{' '}
                <a href="mailto:pushkarj32@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  pushkarj32@gmail.com
                </a>
              </p>
              <p className="text-gray-700 dark:text-gray-300">Phone: 3009403804</p>
              <p className="text-gray-700 dark:text-gray-300">Address: Delhi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
