import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import serviceMakeup from "@/assets/service-makeup.jpg";
import serviceHair from "@/assets/service-hair.jpg";
import serviceSaree from "@/assets/service-saree.jpg";
import serviceRings from "@/assets/service-rings.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const services = [
  {
    id: 1,
    name: "Bridal Makeup",
    image: serviceMakeup,
    description: "Transform into the most beautiful version of yourself with our expert bridal makeup services.",
    features: [
      "HD & Airbrush Techniques",
      "Long-lasting formulas",
      "Skin prep & care",
      "Touch-up kit included",
      "Pre-wedding trial session",
    ],
    price: "Starting ₹25,000",
    popular: true,
  },
  {
    id: 2,
    name: "Hair Styling",
    image: serviceHair,
    description: "Elegant updos, cascading curls, or sleek modern styles - we create the perfect bridal hairstyle.",
    features: [
      "Custom styling consultation",
      "Hair extensions available",
      "Flower & accessory placement",
      "Heat & humidity resistant",
      "Multiple style changes",
    ],
    price: "Starting ₹15,000",
    popular: false,
  },
  {
    id: 3,
    name: "Saree Draping",
    image: serviceSaree,
    description: "Expert saree draping in various styles - from traditional Gujarati to contemporary fusion.",
    features: [
      "Multiple draping styles",
      "Perfect pleating",
      "Secure pinning",
      "Comfort-focused",
      "Quick-change support",
    ],
    price: "Starting ₹8,000",
    popular: false,
  },
  {
    id: 4,
    name: "Jewelry & Accessories",
    image: serviceRings,
    description: "Complete your bridal look with perfectly coordinated jewelry and accessories.",
    features: [
      "Jewelry selection guidance",
      "Rental options available",
      "Custom styling",
      "Hair accessories",
      "Dupatta setting",
    ],
    price: "Starting ₹5,000",
    popular: false,
  },
];

const packages = [
  {
    name: "Essential",
    price: "₹35,000",
    description: "Perfect for intimate weddings",
    features: [
      "Bridal Makeup",
      "Hair Styling",
      "1 Trial Session",
      "Basic Touch-up Kit",
    ],
  },
  {
    name: "Premium",
    price: "₹65,000",
    description: "Our most popular choice",
    features: [
      "HD Bridal Makeup",
      "Hair Styling with Extensions",
      "Saree Draping",
      "2 Trial Sessions",
      "Complete Touch-up Kit",
      "Reception Look Included",
    ],
    popular: true,
  },
  {
    name: "Luxury",
    price: "₹1,25,000",
    description: "The complete bridal experience",
    features: [
      "Airbrush Bridal Makeup",
      "Custom Hair Styling",
      "All Event Coverage",
      "Unlimited Trials",
      "Personal Stylist",
      "Jewelry Coordination",
      "Family Makeup (2 persons)",
      "Photography Consultation",
    ],
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-blush">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-sm font-medium text-primary mb-4"
            >
              What We Offer
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            >
              Our Bridal{" "}
              <span className="text-gradient-rose">Services</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              From makeup to styling, we provide comprehensive bridal services 
              to make you look stunning on your special day.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-2xl font-semibold mb-2">
                        {service.name}
                      </h3>
                      {service.popular && (
                        <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-medium">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-semibold">{service.price}</p>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/booking">Book This Service</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 lg:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-sm font-medium text-primary mb-4"
            >
              Packages
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6"
            >
              Bridal{" "}
              <span className="text-gradient-rose">Packages</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Choose a package that suits your needs and budget. 
              All packages include consultation and trials.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={fadeInUp}
                className={`relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-elegant transition-all duration-300 ${
                  pkg.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="font-display text-2xl font-semibold mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {pkg.description}
                  </p>
                  <p className="font-display text-4xl font-semibold text-primary">
                    {pkg.price}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={pkg.popular ? "elegant" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link to="/booking">
                    Choose {pkg.name}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Style Options */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-sm font-medium text-primary mb-4"
            >
              Your Style
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6"
            >
              Choose Your{" "}
              <span className="text-gradient-rose">Look</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Traditional",
                description: "Classic bridal elegance with timeless beauty",
                color: "bg-rose-gold",
              },
              {
                name: "Contemporary",
                description: "Modern, fresh looks for the stylish bride",
                color: "bg-primary",
              },
              {
                name: "Fusion",
                description: "Best of both worlds - tradition meets trend",
                color: "bg-gold",
              },
            ].map((style) => (
              <motion.div
                key={style.name}
                variants={fadeInUp}
                className="group text-center p-8 rounded-2xl bg-card shadow-soft hover:shadow-elegant transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-full ${style.color} mx-auto mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className="font-display text-2xl font-semibold mb-3">
                  {style.name}
                </h3>
                <p className="text-muted-foreground">{style.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
