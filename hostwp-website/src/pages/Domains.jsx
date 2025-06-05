import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Shield, Settings, Gift } from 'lucide-react';
import Hero from '../components/ui/Hero';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FadeInOnScroll, StaggerChildren } from '../components/animations/ScrollAnimations';
import { useContent } from '../hooks/useContent';
import { redirectToDomainSearch } from '../utils/upmind';
import { trackButtonClick } from '../utils/analytics';

const Domains = () => {
  const { content, loading, error } = useContent('domains');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDomainSearch = () => {
    if (searchTerm.trim()) {
      redirectToDomainSearch(searchTerm, 'domains_page');
    } else {
      redirectToDomainSearch('', 'domains_page');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleDomainSearch();
    }
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

  return (
    <div>
      {/* Hero Section */}
      <Hero
        headline={content?.hero?.headline}
        subheadline={content?.hero?.subheadline}
        size="medium"
        className="bg-gradient-to-br from-primary-50 via-white to-blue-50"
      >
        {/* Domain Search */}
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter your domain name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleDomainSearch}
              trackingLabel="Search Domain"
              trackingLocation="domains_hero"
              icon={Search}
            >
              Search
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Popular extensions: .com, .net, .org, .io, .co
          </p>
        </div>
      </Hero>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="section-title">Domain Features</h2>
              <p className="section-subtitle">
                Everything you need to manage your domains
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content?.features?.map((feature, index) => {
              const icons = [Globe, Shield, Settings, Gift];
              const IconComponent = icons[index % icons.length];
              
              return (
                <Card key={index} className="text-center">
                  <CardBody>
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Popular Extensions */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="section-title">Popular Domain Extensions</h2>
              <p className="section-subtitle">
                Choose from over 500 domain extensions
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { ext: '.com', price: '$12.99' },
              { ext: '.net', price: '$14.99' },
              { ext: '.org', price: '$13.99' },
              { ext: '.io', price: '$49.99' },
              { ext: '.co', price: '$29.99' },
              { ext: '.tech', price: '$39.99' }
            ].map((domain, index) => (
              <Card key={index} className="text-center hover:border-primary-300">
                <CardBody padding="sm">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {domain.ext}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {domain.price}
                  </div>
                  <div className="text-sm text-gray-600">
                    /year
                  </div>
                </CardBody>
              </Card>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <FadeInOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Claim Your Domain?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Secure your perfect domain name today and get your website online in minutes.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                trackButtonClick('Start Domain Search', 'domains_bottom_cta', '/domains');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              trackingLabel="Start Domain Search"
              trackingLocation="domains_bottom_cta"
            >
              Start Your Search
            </Button>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Domains;