import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, Clock, Send } from 'lucide-react';
import Hero from '../components/ui/Hero';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FadeInOnScroll, StaggerChildren } from '../components/animations/ScrollAnimations';
import { useContent } from '../hooks/useContent';
import { trackFormInteraction, trackButtonClick } from '../utils/analytics';

const Contact = () => {
  const { content, loading, error } = useContent('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    trackFormInteraction('contact_form', 'field_focus', name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    trackFormInteraction('contact_form', 'submit');
    trackButtonClick('Submit Contact Form', 'contact_page', 'form_submission');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you within 2 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      trackFormInteraction('contact_form', 'complete');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="section-padding bg-gradient-to-br from-primary-50 to-white">
          <div className="container-custom text-center">
            <div className="w-1/2 h-12 bg-gray-200 rounded mx-auto mb-6 animate-pulse" />
            <div className="w-2/3 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const iconMap = {
    chat: MessageCircle,
    email: Mail,
    phone: Phone
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        headline={content?.hero?.headline}
        subheadline={content?.hero?.subheadline}
        size="medium"
        className="bg-gradient-to-br from-primary-50 via-white to-blue-50"
      />

      {/* Contact Methods */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="section-title">Get in Touch</h2>
              <p className="section-subtitle">
                Choose the best way to reach our expert team
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {content?.contactMethods?.map((method, index) => {
              const IconComponent = iconMap[method.type];
              
              return (
                <Card key={index} className="text-center group hover:border-primary-300">
                  <CardBody>
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                      {IconComponent && (
                        <IconComponent className="w-8 h-8 text-primary-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {method.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {method.availability}
                      </div>
                      <div className="text-sm font-semibold text-primary-600">
                        Response: {method.responseTime}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <FadeInOnScroll>
                <Card>
                  <CardBody>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {content?.form?.title}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      {content?.form?.subtitle}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
                          placeholder="Tell us more about your needs..."
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={isSubmitting}
                        className="w-full"
                        icon={Send}
                        trackingLabel="Submit Contact Form"
                        trackingLocation="contact_form"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardBody>
                </Card>
              </FadeInOnScroll>

              {/* Contact Info */}
              <FadeInOnScroll direction="right">
                <div className="space-y-8">
                  <Card>
                    <CardBody>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Quick Response Guarantee
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          <span>Live chat: Under 2 minutes</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                          <span>Email: Within 2 hours</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                          <span>Phone: Immediate</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Office Hours
                      </h4>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span>Monday - Friday</span>
                          <span>24/7</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday - Sunday</span>
                          <span>24/7</span>
                        </div>
                        <div className="text-sm text-primary-600 mt-4">
                          We're always here to help!
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Emergency Support
                      </h4>
                      <p className="text-gray-600 mb-4">
                        For urgent technical issues affecting your website's availability.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          trackButtonClick('Emergency Support', 'contact_page', 'tel:+1-555-URGENT');
                          window.location.href = 'tel:+1-555-URGENT';
                        }}
                        trackingLabel="Emergency Support"
                        trackingLocation="contact_emergency"
                      >
                        Call Emergency Line
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;