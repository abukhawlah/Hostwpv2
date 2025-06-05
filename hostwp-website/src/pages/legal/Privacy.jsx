import React from 'react';
import { FadeInOnScroll } from '../../components/animations/ScrollAnimations';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Privacy Policy
                </h1>
                <p className="text-xl text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll>
              <div className="prose prose-lg max-w-none">
                <h2>Information We Collect</h2>
                <p>
                  We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                </p>

                <h2>How We Use Your Information</h2>
                <p>
                  We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                </p>

                <h2>Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                </p>

                <h2>Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h2>Cookies</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts.
                </p>

                <h2>Your Rights</h2>
                <p>
                  You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at privacy@hostwp.co
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;