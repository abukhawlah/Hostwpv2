import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bot, Wrench, Clock, Lightbulb, Zap, Shield, Users, Heart, ArrowRight } from 'lucide-react';
import Hero from '../components/ui/Hero';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FadeInOnScroll, StaggerChildren, RevealText } from '../components/animations/ScrollAnimations';

const OurStory = () => {
  const handleGetStartedClick = () => {
    window.location.href = '/products';
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        headline="Built from Frustration. Powered by Purpose."
        subheadline="For over 15 years, we've run a digital agency, helping businesses grow online through strategy, design, marketing, and tech. But if there's one issue we saw again and again — across startups, SMEs, and even bigger brands — it was hosting."
        size="medium"
        className="bg-gradient-to-br from-primary-50 via-white to-blue-50"
      />

      {/* Problems Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h2 className="section-title">Clients were constantly battling:</h2>
              </div>
            </FadeInOnScroll>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="group">
                <CardBody>
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Sluggish, unreliable shared hosting
                      </h3>
                      <p className="text-gray-600">
                        Slow loading times and frequent downtime affecting business growth
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="group">
                <CardBody>
                  <div className="flex items-start">
                    <Bot className="w-6 h-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Robotic support that treats you like a ticket number
                      </h3>
                      <p className="text-gray-600">
                        Cold, impersonal support with no real understanding of business needs
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="group">
                <CardBody>
                  <div className="flex items-start">
                    <Wrench className="w-6 h-6 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        WordPress errors and updates they didn't understand
                      </h3>
                      <p className="text-gray-600">
                        Technical issues that business owners shouldn't have to deal with
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="group">
                <CardBody>
                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Wasted time stressing about downtime, not growth
                      </h3>
                      <p className="text-gray-600">
                        Focus diverted from business development to technical problems
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </StaggerChildren>

            <FadeInOnScroll>
              <div className="text-center">
                <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full text-lg font-semibold">
                  <Lightbulb className="w-6 h-6 mr-2" />
                  That's when we had a lightbulb moment: what if we solved this ourselves?
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h2 className="section-title">So We Created HostWP</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Not just another hosting company. A solution.
                </p>
                <RevealText className="text-lg text-gray-700 leading-relaxed mb-8">
                  HostWP was born out of a need to bridge the gap between fast, secure hosting and real human support.
                  We don't just provide server space — we maintain your website. From plugin updates to small changes, you've got a team behind you.
                </RevealText>
                <div className="text-xl font-semibold text-primary-600 mb-8">
                  This is done-for-you WordPress hosting — the way it should be.
                </div>
              </div>
            </FadeInOnScroll>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardBody>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Fast. Secure. Scalable.
                  </h3>
                  <p className="text-gray-600">
                    Built on optimized infrastructure for maximum performance
                  </p>
                </CardBody>
              </Card>

              <Card className="text-center">
                <CardBody>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Backed by real people.
                  </h3>
                  <p className="text-gray-600">
                    Human support that understands your business needs
                  </p>
                </CardBody>
              </Card>

              <Card className="text-center">
                <CardBody>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Built to support your growth.
                  </h3>
                  <p className="text-gray-600">
                    Hosting that scales with your business ambitions
                  </p>
                </CardBody>
              </Card>
            </StaggerChildren>

            <FadeInOnScroll>
              <div className="text-center mt-12">
                <p className="text-lg font-semibold text-gray-900">
                  We're not here to be the biggest hosting company. We're here to be the most helpful.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Final Message Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInOnScroll>
              <h2 className="section-title mb-8">Hosting Reimagined — By People Who Actually Get It</h2>
              <RevealText className="text-xl text-gray-700 leading-relaxed mb-8">
                We've been in your shoes. We've helped hundreds of businesses like yours. And we know the stress that comes with unreliable tech.
              </RevealText>
              <div className="bg-primary-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-primary-900 mb-4">HostWP is our answer.</h3>
                <p className="text-lg text-primary-800">
                  It's hosting that's fast, human, and just works — so you can stop worrying about your site and start building your business.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <FadeInOnScroll>
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-primary-200 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Experience the Difference?
              </h2>
            </div>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Join businesses who've made the switch to hosting that actually cares about their success.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleGetStartedClick}
              icon={ArrowRight}
              iconPosition="right"
            >
              Get Started Today
            </Button>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
};

export default OurStory;