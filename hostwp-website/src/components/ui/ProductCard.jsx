import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import Button from './Button';
import Card, { CardHeader, CardBody, CardFooter } from './Card';
import { redirectToShop, createProductForTracking } from '../../utils/upmind';
import { trackProductView } from '../../utils/analytics';

const ProductCard = ({
  plan,
  category,
  popular = false,
  className = '',
  index = 0
}) => {
  const product = createProductForTracking(plan, category);

  // Track product view when component mounts
  React.useEffect(() => {
    trackProductView(product);
  }, []);

  const handlePurchase = () => {
    redirectToShop(product, `${category}_product_card_${index}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  const popularBadgeVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        type: "spring",
        stiffness: 200
      }
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Popular Badge */}
      {popular && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
          variants={popularBadgeVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Most Popular
          </div>
        </motion.div>
      )}

      <Card
        variant={popular ? "elevated" : "default"}
        className={`h-full flex flex-col ${popular ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}`}
        hover={true}
        padding="none"
      >
        <div className="p-6 flex-grow flex flex-col">
          <CardHeader>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {plan.description}
              </p>
              
              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-xl text-gray-500 ml-2">
                    /{plan.period || 'month'}
                  </span>
                </div>
                
                {/* Savings badge */}
                {plan.savings && (
                  <motion.div
                    className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    Save {plan.savings}%
                  </motion.div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardBody className="flex-grow">
            {/* Features List */}
            <ul className="space-y-4 mb-8">
              {plan.features?.map((feature, featureIndex) => (
                <motion.li
                  key={featureIndex}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + featureIndex * 0.1 }}
                >
                  {feature === "—" ? (
                    <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={`${feature === "—" ? "text-transparent" : "text-gray-700"}`}>
                    {feature === "—" ? "placeholder" : feature}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Trust signals */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Setup in under 60 seconds
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                24/7 expert support
              </div>
            </div>
          </CardBody>
        </div>

        <CardFooter className="mt-auto">
          <Button
            variant={popular ? "primary" : "secondary"}
            size="lg"
            onClick={handlePurchase}
            className="w-full"
            trackingLabel={`Buy ${plan.name}`}
            trackingLocation={`${category}_product_card`}
          >
            {plan.cta || 'Get Started'}
          </Button>

          {/* Urgency/scarcity message */}
          {plan.urgency && (
            <motion.p
              className="text-center text-sm text-orange-600 mt-3 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {plan.urgency}
            </motion.p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;