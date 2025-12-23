import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

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

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    details: "+91 98765 43210",
    link: "tel:+919876543210",
    description: "Mon-Sat, 10am-7pm",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp",
    details: "+91 98765 43210",
    link: "https://wa.me/919876543210",
    description: "Quick responses",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: "hello@moonlightelegance.com",
    link: "mailto:hello@moonlightelegance.com",
    description: "We reply within 24hrs",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "123 Bridal Lane, Wedding District",
    link: "https://maps.google.com",
    description: "Mumbai 400001",
  },
];

const faqs = [
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 2-3 months in advance for bridal appointments, especially during wedding season (October-February).",
  },
  {
    question: "Do you offer trial sessions?",
    answer: "Yes! All our bridal packages include at least one trial session. Premium and Luxury packages include multiple trials.",
  },
  {
    question: "Do you travel for destination weddings?",
    answer: "Absolutely! We love destination weddings. Travel charges apply based on location and duration.",
  },
  {
    question: "What products do you use?",
    answer: "We use premium, internationally acclaimed brands that are safe for all skin types and long-lasting.",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

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
              Get in Touch
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            >
              Contact{" "}
              <span className="text-gradient-rose">Us</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              Have questions or ready to book? We'd love to hear from you. 
              Reach out through any of the channels below.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contactInfo.map((info) => (
              <motion.a
                key={info.title}
                variants={fadeInUp}
                href={info.link}
                target={info.link.startsWith("http") ? "_blank" : undefined}
                rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <info.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{info.title}</h3>
                <p className="text-primary text-sm mb-1">{info.details}</p>
                <p className="text-xs text-muted-foreground">{info.description}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2
                variants={fadeInUp}
                className="font-display text-2xl md:text-3xl font-semibold mb-8"
              >
                Send Us a Message
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Button variant="elegant" size="lg" type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Hours & Map */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              {/* Business Hours */}
              <motion.div
                variants={fadeInUp}
                className="bg-card rounded-2xl p-8 shadow-soft"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="h-6 w-6 text-primary" />
                  <h3 className="font-display text-xl font-semibold">Business Hours</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { day: "Monday - Friday", hours: "10:00 AM - 7:00 PM" },
                    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
                    { day: "Sunday", hours: "By Appointment Only" },
                  ].map((schedule) => (
                    <div key={schedule.day} className="flex justify-between">
                      <span className="text-muted-foreground">{schedule.day}</span>
                      <span className="font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                variants={fadeInUp}
                className="bg-secondary rounded-2xl h-64 lg:h-80 flex items-center justify-center"
              >
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    123 Bridal Lane, Wedding District
                    <br />
                    Mumbai 400001
                  </p>
                  <Button variant="outline" className="mt-4" asChild>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our services.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 shadow-soft"
                >
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
