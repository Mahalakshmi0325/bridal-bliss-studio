import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, Calendar, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import heroImage from "@/assets/hero-bridal.jpg";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
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

const stats = [
  { icon: Users, value: "500+", label: "Happy Brides" },
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Calendar, value: "10+", label: "Years Experience" },
  { icon: Award, value: "25+", label: "Awards Won" },
];

const services = [
  { name: "Bridal Makeup", image: serviceMakeup, description: "Flawless bridal looks for your special day" },
  { name: "Hair Styling", image: serviceHair, description: "Elegant updos and modern styles" },
  { name: "Saree Draping", image: serviceSaree, description: "Traditional & contemporary draping" },
  { name: "Jewelry Styling", image: serviceRings, description: "Complete bridal accessorizing" },
];

const artists = [
  { name: "Priya Sharma", role: "Senior Makeup Artist", image: artist1, rating: 4.9 },
  { name: "Elena Rose", role: "Hair Styling Expert", image: artist2, rating: 4.8 },
  { name: "Anita Desai", role: "Bridal Consultant", image: artist3, rating: 5.0 },
];

const testimonials = [
  {
    name: "Meera Kapoor",
    text: "Absolutely stunning work! My wedding day look was beyond my dreams. The entire team was so professional and caring.",
    rating: 5,
  },
  {
    name: "Sanya Mehta",
    text: "Moonlight Elegance made me feel like a princess. Their attention to detail is unmatched. Highly recommend!",
    rating: 5,
  },
  {
    name: "Riya Gupta",
    text: "From the trial to the wedding day, everything was perfect. The artists understood exactly what I wanted.",
    rating: 5,
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Elegant bride getting makeup done"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Bridal Studio</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6"
            >
              Your Dream Bridal{" "}
              <span className="text-gradient-rose">Look Awaits</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              Experience the artistry of our expert team. From traditional elegance to contemporary glamour, 
              we craft the perfect look for your most precious moments.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/booking">
                  Book Your Appointment
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/services">Explore Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-blush">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
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
              Our Services
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6"
            >
              Complete Bridal{" "}
              <span className="text-gradient-rose">Experience</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              From makeup to styling, we offer everything you need to look and feel 
              your absolute best on your wedding day.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-elegant transition-all duration-500"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-xl font-semibold text-background mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-background/80">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button variant="elegant" size="lg" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Artists Section */}
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
              Meet Our Team
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6"
            >
              Our Expert{" "}
              <span className="text-gradient-rose">Artists</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Each artist brings years of experience and a passion for creating 
              unforgettable bridal looks.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {artists.map((artist, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group text-center"
              >
                <div className="relative mb-6 mx-auto w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-elegant">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-1">
                  {artist.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">{artist.role}</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <span className="text-sm font-medium">{artist.rating}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/artists">
                Meet All Artists
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              Testimonials
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6"
            >
              What Our{" "}
              <span className="text-gradient-rose">Brides Say</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elegant transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <p className="font-display font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/reviews">
                Read More Reviews
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-rose-gold">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground mb-6"
            >
              Ready to Begin Your Bridal Journey?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-primary-foreground/80 mb-8"
            >
              Book your consultation today and let us help you create the 
              perfect look for your special day.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/booking">
                  Schedule Your Consultation
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
