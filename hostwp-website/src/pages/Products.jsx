import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Cloud, Server } from 'lucide-react';
import Hero from '../components/ui/Hero';
import ProductCard from '../components/ui/ProductCard';
import { FadeInOnScroll, StaggerChildren } from '../components/animations/ScrollAnimations';
import { useContent } from '../hooks/useContent';
import { trackButtonClick } from '../utils/analytics';

const Products = () => {
  const { content, loading, error } = useContent('products');

  const categoryIcons = {
    wordpress: Zap,
    cloud: Cloud,
    dedicated: Server
  };

  const handleViewAllPlans = (categoryId) => {
    trackButtonClick('View All Plans', `products_${categoryId}`, `#${categoryId}`);
    document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Skeleton */}
        <div className="section-padding bg-gradient-to-br from-primary-50 to-white">
          <div className="container-custom text-center">
            <div className="w-2/3 h-12 bg-gray-200 rounded mx-auto mb-6 animate-pulse" />
            <div className="w-1/2 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
        </div>
        
        {/* Products Skeleton */}
        <div className="section-padding">
          <div className="container-custom">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-16">
                <div className="w-64 h-8 bg-gray-200 rounded mb-8 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="bg-gray-100 rounded-xl h-96 animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h1>
          <p className="text-gray-600">{error}</p>
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
      />

      {/* Products Categories */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {content?.categories?.map((category, categoryIndex) => {
            const IconComponent = categoryIcons[category.id];
            
            return (
              <div key={category.id} id={category.id} className="mb-20 last:mb-0">
                {/* Category Header */}
                <FadeInOnScroll>
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                      {IconComponent && (
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                          <IconComponent className="w-8 h-8 text-primary-600" />
                        </div>
                      )}
                      <div className="text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                          {category.name}
                        </h2>
                        {category.popular && (
                          <div className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                            <span className="text-sm font-semibold text-yellow-600">
                              Most Popular Choice
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      {category.description}
                    </p>
                  </div>
                </FadeInOnScroll>

                {/* Category Features/Benefits */}
                <FadeInOnScroll>
                  <div className="bg-gray-50 rounded-2xl p-8 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {category.id === 'wordpress' && (
                        <>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">WordPress Optimized</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">1-Click Installation</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Auto Updates</span>
                          </div>
                        </>
                      )}
                      
                      {category.id === 'cloud' && (
                        <>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Auto-Scaling</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Load Balancing</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Global CDN</span>
                          </div>
                        </>
                      )}
                      
                      {category.id === 'dedicated' && (
                        <>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Dedicated Resources</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">Root Access</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <Link
                              to="/white-glove-support"
                              className="text-gray-700 hover:text-primary-600 transition-colors duration-200 underline decoration-dotted underline-offset-2"
                              onClick={() => trackButtonClick('White Glove Support Link', 'products_dedicated', '/white-glove-support')}
                            >
                              White-glove Support
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </FadeInOnScroll>

                {/* Product Cards */}
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.plans?.map((plan, planIndex) => (
                    <ProductCard
                      key={planIndex}
                      plan={plan}
                      category={category.id}
                      popular={category.popular && planIndex === 0}
                      index={planIndex}
                    />
                  ))}
                </StaggerChildren>

                {/* Category CTA */}
                <FadeInOnScroll>
                  <div className="text-center mt-12">
                    <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Need Help Choosing?
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Our hosting experts are here to help you find the perfect plan for your needs.
                        Get personalized recommendations based on your requirements.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                          className="btn-primary"
                          onClick={() => {
                            trackButtonClick('Chat with Expert', `products_${category.id}`, '/contact');
                            window.location.href = '/contact';
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Chat with Expert
                        </motion.button>
                        <motion.button
                          className="btn-secondary"
                          onClick={() => {
                            trackButtonClick('Compare Plans', `products_${category.id}`, '#comparison');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Compare Plans
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </FadeInOnScroll>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="section-title">Why 50,000+ Customers Trust HostWP</h2>
            </div>
          </FadeInOnScroll>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                30-Day Money-Back Guarantee
              </h3>
              <p className="text-gray-600">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                99.9% Uptime SLA
              </h3>
              <p className="text-gray-600">
                We guarantee your website stays online with our industry-leading uptime.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                24/7 Expert Support
              </h3>
              <p className="text-gray-600">
                Real hosting experts available around the clock to help you succeed.
              </p>
            </div>
          </StaggerChildren>
        </div>
      </section>
    </div>
  );
};

export default Products;