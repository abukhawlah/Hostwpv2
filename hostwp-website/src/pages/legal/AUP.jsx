import React from 'react';
import { FadeInOnScroll } from '../../components/animations/ScrollAnimations';

const AUP = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Acceptable Use Policy
                </h1>
                <p className="text-xl text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll>
              <div className="prose prose-lg max-w-none">
                <h2>Overview</h2>
                <p>
                  This Acceptable Use Policy governs your use of HostWP services and is designed to protect our customers, network, and reputation.
                </p>

                <h2>Prohibited Activities</h2>
                <p>You may not use our services for:</p>
                <ul>
                  <li>Illegal activities or content that violates any applicable laws</li>
                  <li>Spam, unsolicited email, or bulk messaging</li>
                  <li>Malware, viruses, or malicious code distribution</li>
                  <li>Phishing, fraud, or identity theft</li>
                  <li>Copyright infringement or intellectual property violations</li>
                  <li>Adult content or pornography</li>
                  <li>Hate speech, harassment, or discriminatory content</li>
                </ul>

                <h2>Resource Usage</h2>
                <p>
                  Customers must use server resources responsibly. Excessive resource usage that affects other customers may result in account suspension.
                </p>

                <h2>Content Responsibility</h2>
                <p>
                  You are solely responsible for all content hosted on your account. We reserve the right to remove content that violates this policy.
                </p>

                <h2>Network Security</h2>
                <p>
                  Any attempt to compromise network security, including but not limited to unauthorized access attempts, will result in immediate account termination.
                </p>

                <h2>Enforcement</h2>
                <p>
                  Violations of this policy may result in warnings, account suspension, or termination without refund, depending on the severity of the violation.
                </p>

                <h2>Reporting Violations</h2>
                <p>
                  To report violations of this policy, please contact us at abuse@hostwp.co with detailed information about the violation.
                </p>

                <h2>Contact Information</h2>
                <p>
                  If you have questions about this Acceptable Use Policy, please contact us at legal@hostwp.co
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AUP;