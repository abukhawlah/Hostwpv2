import React from 'react';
import { FadeInOnScroll } from '../../components/animations/ScrollAnimations';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Terms & Conditions
                </h1>
                <p className="text-xl text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll>
              <div className="prose prose-lg max-w-none">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using HostWP services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>

                <h2>2. Service Description</h2>
                <p>
                  HostWP provides web hosting services including but not limited to shared hosting, cloud hosting, and dedicated server solutions.
                </p>

                <h2>3. Account Registration</h2>
                <p>
                  To use our services, you must register for an account and provide accurate, complete, and current information.
                </p>

                <h2>4. Payment Terms</h2>
                <p>
                  Payment for services is due in advance. We accept various payment methods as displayed during the checkout process.
                </p>

                <h2>5. Refund Policy</h2>
                <p>
                  We offer a 30-day money-back guarantee for new hosting accounts. Refund requests must be submitted within 30 days of initial purchase.
                </p>

                <h2>6. Service Level Agreement</h2>
                <p>
                  We guarantee 99.9% uptime for our hosting services. Service credits may be available for downtime exceeding this threshold.
                </p>

                <h2>7. Prohibited Uses</h2>
                <p>
                  You may not use our services for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction.
                </p>

                <h2>8. Limitation of Liability</h2>
                <p>
                  HostWP shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                </p>

                <h2>9. Contact Information</h2>
                <p>
                  If you have any questions about these Terms & Conditions, please contact us at legal@hostwp.co
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;