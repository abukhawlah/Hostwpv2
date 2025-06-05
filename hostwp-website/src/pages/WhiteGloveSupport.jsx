import React from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Shield, 
  Brain, 
  Edit3, 
  Settings, 
  Link, 
  RotateCcw, 
  Eye 
} from 'lucide-react';
import Hero from '../components/ui/Hero';
import { FadeInOnScroll, StaggerChildren } from '../components/animations/ScrollAnimations';

const WhiteGloveSupport = () => {
  const services = [
    {
      icon: RefreshCw,
      title: "Plugin Updates",
      description: "We regularly check and update your plugins to ensure compatibility, performance, and security. If anything breaks after an update, we roll it back — fast."
    },
    {
      icon: Shield,
      title: "Secure Backups",
      description: "We automatically back up your entire website every 7 days and store it on a secure local server. If disaster ever strikes, your site can be restored in minutes."
    },
    {
      icon: Brain,
      title: "WordPress Core Updates",
      description: "We safely apply the latest WordPress core updates so you're always running on the most stable and secure version."
    },
    {
      icon: Edit3,
      title: "Content Updates",
      description: "Need to update a service page, swap a banner, or upload new blog posts? We take care of that. Just send us the content — we'll format and publish it professionally."
    },
    {
      icon: Settings,
      title: "Script & Program Updates",
      description: "Whether it's a custom script or third-party tool, we keep all integrated software up to date so your site continues running smoothly."
    },
    {
      icon: Link,
      title: "Broken Link & 404 Monitoring",
      description: "Dead pages and broken links hurt your SEO and your visitors' trust. We scan your site for broken links and fix them before they become a problem."
    },
    {
      icon: RotateCcw,
      title: "Redirects Management",
      description: "When pages move or change, we'll implement proper 301 redirects to preserve your traffic, rankings, and user experience."
    },
    {
      icon: Eye,
      title: "24/7 Site Monitoring",
      description: "Your website is constantly monitored for downtime and security threats. If there's ever an issue, we'll notify you within 1 hour and begin resolving it immediately — no waiting, no stress."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <Hero
        headline="White Glove Support"
        subheadline="WordPress Maintenance — Handled by Humans, Not Robots"
        size="medium"
        className="bg-gradient-to-br from-primary-50 via-white to-blue-50"
      />

      {/* Introduction */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <FadeInOnScroll>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <p className="text-xl text-gray-600 leading-relaxed">
                When you host with HostWP, you're not just getting fast servers and solid security — you're getting a full team behind your site. Our White Glove Support means we handle the heavy lifting so you can focus on growing your business.
              </p>
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Here's everything that's included in your maintenance package:
                </h2>
              </div>
            </div>
          </FadeInOnScroll>

          {/* Services Grid */}
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors duration-300"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </StaggerChildren>

          {/* Closing Section */}
          <FadeInOnScroll>
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Maintenance that Feels Like an Extension of Your Team
              </h2>
              <div className="max-w-3xl mx-auto space-y-4 text-lg text-gray-600 mb-8">
                <p>
                  Most hosting companies stop at uptime.
                </p>
                <p>
                  We go further — with full site care, regular updates, real-time monitoring, and proactive support.
                </p>
                <p className="font-semibold text-gray-900">
                  This is what we mean by White Glove.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 inline-block">
                <p className="text-gray-700 font-medium">
                  Got something extra you need done? Just ask. We're here to help.
                </p>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
};

export default WhiteGloveSupport;