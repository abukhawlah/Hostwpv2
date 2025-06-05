import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Headphones, Clock, Star, ArrowRight, CheckCircle, Users, Brain, Wrench } from 'lucide-react';
import Hero from '../components/ui/Hero';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FadeInOnScroll, StaggerChildren, AnimatedCounter, FloatingElement } from '../components/animations/ScrollAnimations';
import { trackButtonClick } from '../utils/analytics';

const Home = () => {
  const handleExplorePlansClick = () => {
    trackButtonClick('Explore Plans', 'home_hero', '/products');
    window.location.href = '/products';
  };

  const handleGetStartedClick = () => {
    trackButtonClick('Get Started', 'home_cta', '/products');
    window.location.href = '/products';
  };

  const handleViewAllPlansClick = () => {
    trackButtonClick('View All Plans', 'home_packages', '/products');
    window.location.href = '/products';
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        headline="Built for Speed. Backed by Humans."
        subheadline="Done-for-you hosting — fast, secure, and fully maintained by real humans."
        description="Your business shouldn't have to worry about updates, security, or page tweaks. With HostWP, you get more than just blazing-fast WordPress hosting — you get a dedicated team that takes care of plugin updates, theme maintenance, content changes, and everything in between."
        primaryCta="Explore Plans"
        onPrimaryClick={handleExplorePlansClick}
        className="bg-gradient-to-br from-primary-50 via-white to-blue-50"
      >
        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600 mt-8">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            No ticket numbers. No stress.
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 text-primary-600 mr-2" />
            Just a website that works
          </div>
        </div>
      </Hero>

      {/* Why Choose HostWP Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-600 mr-2" />
                <span className="text-lg font-semibold text-primary-600">Why Choose HostWP?</span>
              </div>
              <h2 className="section-title">Hosting with a Human Touch</h2>
              <p className="section-subtitle max-w-3xl mx-auto">
                Most hosting companies give you a server and send you on your way. We give you a team.
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group">
              <CardBody>
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Blazing-fast load times
                    </h3>
                    <p className="text-gray-600">
                      Optimized WordPress stack built for speed.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="group">
              <CardBody>
                <div className="flex items-start mb-4">
                  <Shield className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Rock-solid security
                    </h3>
                    <p className="text-gray-600">
                      Proactive malware scans, daily backups, firewall, and uptime monitoring.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="group">
              <CardBody>
                <div className="flex items-start mb-4">
                  <Wrench className="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Ongoing maintenance
                    </h3>
                    <p className="text-gray-600">
                      Plugin/theme updates, page edits, and performance tuning done for you.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="group">
              <CardBody>
                <div className="flex items-start mb-4">
                  <Headphones className="w-6 h-6 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Support that speaks human
                    </h3>
                    <p className="text-gray-600">
                      Talk to people who care, not ticket robots.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="group">
              <CardBody>
                <div className="flex items-start mb-4">
                  <Brain className="w-6 h-6 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Business-first thinking
                    </h3>
                    <p className="text-gray-600">
                      We don't just host websites, we help businesses thrive online.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </StaggerChildren>
        </div>
      </section>

      {/* Hosting Packages Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-600 mr-2" />
                <span className="text-lg font-semibold text-primary-600">Hosting Packages</span>
              </div>
              <h2 className="section-title">That Work Hard So You Don't Have To</h2>
              <p className="section-subtitle">
                Whether you're just starting out, scaling fast, or running a high-traffic business — we've got you covered.
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* SwiftStarter */}
            <Card className="group hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardBody className="flex-grow flex flex-col">
                <div className="text-center flex-grow flex flex-col">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🐟</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">SwiftStarter</h3>
                  <p className="text-gray-600 mb-6 flex-grow">
                    For entrepreneurs and small sites looking to leap ahead without drowning in tech.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-auto"
                    onClick={handleViewAllPlansClick}
                  >
                    Learn More
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* SpeedMaster */}
            <Card className="group hover:shadow-xl transition-shadow duration-300 border-primary-200 h-full flex flex-col">
              <CardBody className="flex-grow flex flex-col">
                <div className="text-center flex-grow flex flex-col">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🏁</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">SpeedMaster</h3>
                  <p className="text-gray-600 mb-6 flex-grow">
                    For brands building momentum — includes monthly maintenance so your site stays polished.
                  </p>
                  <Button
                    variant="primary"
                    className="w-full mt-auto"
                    onClick={handleViewAllPlansClick}
                  >
                    Learn More
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* TurboPress */}
            <Card className="group hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardBody className="flex-grow flex flex-col">
                <div className="text-center flex-grow flex flex-col">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">TurboPress</h3>
                  <p className="text-gray-600 mb-6 flex-grow">
                    For serious businesses that need serious speed, priority support, and full-service care.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-auto"
                    onClick={handleViewAllPlansClick}
                  >
                    Learn More
                  </Button>
                </div>
              </CardBody>
            </Card>
          </StaggerChildren>

          <FadeInOnScroll>
            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleViewAllPlansClick}
                icon={ArrowRight}
                iconPosition="right"
              >
                View All Plans
              </Button>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl mr-2">🌐</span>
                <span className="text-lg font-semibold text-primary-600">Our Story</span>
              </div>
              <h2 className="section-title">Hosting, Reimagined</h2>
            </div>
          </FadeInOnScroll>

          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="prose prose-lg mx-auto text-gray-700">
                <p className="text-xl leading-relaxed mb-8">
                  We started as a digital agency. Over the years, we noticed the same issue with almost every client: hosting was always a headache.
                </p>
                
                <p className="text-lg leading-relaxed mb-6">
                  Slow sites, confusing cPanels, shady support, and constant worry about things breaking.
                </p>

                <p className="text-lg leading-relaxed mb-6 font-semibold text-gray-900">
                  It was a massive opportunity cost.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  Business owners were spending more time chasing WordPress issues than growing their business.
                </p>

                <p className="text-lg leading-relaxed mb-8">
                  And the so-called "support" from other hosting companies? Cold. Robotic. Ticket-driven.
                </p>

                <p className="text-lg leading-relaxed mb-6 font-semibold text-gray-900">
                  So we decided to flip the script.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  We created HostWP to offer done-for-you WordPress hosting — backed by real people who maintain your site like it's our own. We're not just selling space on a server. We're your partner in performance.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <FadeInOnScroll>
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-2">🧩</span>
              <span className="text-lg font-semibold text-primary-100">Ready to Ditch the Stress?</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Say goodbye to DIY hosting, update anxiety, and broken sites.
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Say hello to human-powered speed, service, and support.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleGetStartedClick}
              trackingLabel="Get Started"
              trackingLocation="home_bottom_cta"
              icon={ArrowRight}
              iconPosition="right"
            >
              Get Started
            </Button>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Home;