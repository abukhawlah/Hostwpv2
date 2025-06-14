import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Headphones, Clock, Star, ArrowRight, CheckCircle, Users, Brain, Wrench } from 'lucide-react';
import Hero from '../components/ui/Hero';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FadeInOnScroll, StaggerChildren, AnimatedCounter, FloatingElement } from '../components/animations/ScrollAnimations';
import { trackButtonClick } from '../utils/analytics';
import { useContent, useHostingPlans, useWebsiteFeatures } from '../hooks/useContent';

const iconMap = {
  CheckCircle,
  Shield,
  Wrench,
  Headphones,
  Brain,
  Zap,
  Clock,
  Users
};

const Home = () => {
  const navigate = useNavigate();
  
  // Fetch dynamic content
  const { content: heroContent, loading: heroLoading } = useContent('home_hero');
  const { content: whyChooseContent, loading: whyChooseLoading } = useContent('home_why_choose');
  const { content: packagesContent, loading: packagesLoading } = useContent('home_packages');
  const { plans, loading: plansLoading } = useHostingPlans();
  const { features, loading: featuresLoading } = useWebsiteFeatures();
  
  const handleExplorePlansClick = () => {
    trackButtonClick('Explore Plans', 'home_hero', '/products');
    navigate('/products');
  };

  const handleGetStartedClick = () => {
    trackButtonClick('Get Started', 'home_cta', '/products');
    navigate('/products');
  };

  const handleViewAllPlansClick = () => {
    trackButtonClick('View All Plans', 'home_packages', '/products');
    navigate('/products');
  };
  
  const handleLearnMoreClick = (planName) => {
    trackButtonClick(`Learn More - ${planName}`, 'home_packages', `/products#wordpress`);
    navigate('/products#wordpress');
  };

  // Show loading state while content is being fetched
  if (heroLoading || whyChooseLoading || packagesLoading || plansLoading || featuresLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      {heroContent && (
        <Hero
          headline={heroContent.headline}
          subheadline={heroContent.subheadline}
          description={heroContent.description}
          primaryCta={heroContent.primaryCta}
          onPrimaryClick={handleExplorePlansClick}
          className="bg-gradient-to-br from-primary-50 via-white to-blue-50"
        >
          {/* Trust indicators */}
          {heroContent.trustIndicators && (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600 mt-8">
              {heroContent.trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  {indicator}
                </div>
              ))}
            </div>
          )}
        </Hero>
      )}

      {/* Why Choose HostWP Section */}
      {whyChooseContent && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary-600 mr-2" />
                  <span className="text-lg font-semibold text-primary-600">{whyChooseContent.badge}</span>
                </div>
                <h2 className="section-title">{whyChooseContent.headline}</h2>
                <p className="section-subtitle max-w-3xl mx-auto">
                  {whyChooseContent.subheadline}
                </p>
              </div>
            </FadeInOnScroll>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => {
                const IconComponent = iconMap[feature.icon] || CheckCircle;
                const iconColors = {
                  CheckCircle: 'text-green-500',
                  Shield: 'text-blue-500',
                  Wrench: 'text-orange-500',
                  Headphones: 'text-purple-500',
                  Brain: 'text-indigo-500'
                };
                
                return (
                  <Card key={feature.id} className="group">
                    <CardBody>
                      <div className="flex items-start mb-4">
                        <IconComponent className={`w-6 h-6 ${iconColors[feature.icon] || 'text-gray-500'} mr-3 mt-1 flex-shrink-0`} />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* Hosting Packages Section */}
      {packagesContent && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary-600 mr-2" />
                  <span className="text-lg font-semibold text-primary-600">{packagesContent.badge}</span>
                </div>
                <h2 className="section-title">{packagesContent.headline}</h2>
                <p className="section-subtitle">
                  {packagesContent.subheadline}
                </p>
              </div>
            </FadeInOnScroll>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`group hover:shadow-xl transition-shadow duration-300 h-full flex flex-col ${plan.is_popular ? 'border-primary-200' : ''}`}
                >
                  <CardBody className="flex-grow flex flex-col">
                    <div className="text-center flex-grow flex flex-col">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl">{plan.icon_emoji}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                      <p className="text-gray-600 mb-6 flex-grow">
                        {plan.description}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full mt-auto"
                        onClick={() => handleLearnMoreClick(plan.name)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </StaggerChildren>

            <FadeInOnScroll>
              <div className="text-center">
                <Button onClick={handleViewAllPlansClick} size="lg">
                  View All Plans
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      )}

      {/* Bottom CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom text-center">
          <FadeInOnScroll>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Experience the Difference?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Join thousands of businesses that trust HostWP for their hosting needs.
              </p>
              <Button 
                onClick={handleGetStartedClick}
                variant="secondary" 
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-50"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Home;