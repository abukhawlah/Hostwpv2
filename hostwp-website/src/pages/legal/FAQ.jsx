import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FadeInOnScroll, StaggerChildren } from '../../components/animations/ScrollAnimations';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqs = [
    {
      question: "What is included in my hosting plan?",
      answer: "All hosting plans include free SSL certificates, daily backups, 24/7 support, and a 99.9% uptime guarantee. Specific features vary by plan."
    },
    {
      question: "How long does it take to set up my hosting?",
      answer: "Most hosting accounts are activated instantly after payment. You'll receive login credentials within minutes of completing your order."
    },
    {
      question: "Do you offer a money-back guarantee?",
      answer: "Yes! We offer a 30-day money-back guarantee for all new hosting accounts. If you're not satisfied, we'll refund your payment."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Absolutely! You can upgrade or downgrade your hosting plan at any time through your control panel or by contacting our support team."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide 24/7 expert support via live chat, email, and phone. Our team consists of real hosting experts, not chatbots."
    },
    {
      question: "Do you provide website migration services?",
      answer: "Yes! We offer free website migration for all new customers. Our team will handle the entire process to ensure a smooth transition."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h1>
                <p className="text-xl text-gray-600">
                  Find answers to common questions about our hosting services
                </p>
              </div>
            </FadeInOnScroll>

            <StaggerChildren className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                    onClick={() => toggleItem(index)}
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openItems.has(index) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems.has(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </StaggerChildren>

            <FadeInOnScroll>
              <div className="text-center mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Still have questions?
                </h3>
                <p className="text-gray-600 mb-6">
                  Our support team is here to help you 24/7
                </p>
                <a
                  href="/contact"
                  className="btn-primary"
                >
                  Contact Support
                </a>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;