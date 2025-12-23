import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Phone, Mail, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const artists = [
  { id: "1", name: "Priya Sharma", specialization: "Bridal Makeup" },
  { id: "2", name: "Elena Rose", specialization: "Hair Styling" },
  { id: "3", name: "Anita Desai", specialization: "Saree Draping" },
];

const services = [
  "Bridal Makeup",
  "Hair Styling",
  "Saree Draping",
  "Jewelry Styling",
  "Complete Package",
];

// Example booked dates (in real app, this would come from database)
const bookedDates = [
  new Date(2024, 1, 14),
  new Date(2024, 1, 20),
  new Date(2024, 2, 5),
  new Date(2024, 2, 15),
];

export default function Booking() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
    style: "",
    artist: "",
    service: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Please select a date",
        description: "Choose your preferred wedding date from the calendar.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would submit to the backend
    console.log({ ...formData, date });
    setSubmitted(true);
    toast({
      title: "Booking Request Submitted!",
      description: "We'll contact you within 24 hours to confirm your appointment.",
    });
  };

  const isDateDisabled = (dateToCheck: Date) => {
    // Disable past dates
    if (dateToCheck < new Date()) return true;
    // Disable booked dates
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.getDate() === dateToCheck.getDate() &&
        bookedDate.getMonth() === dateToCheck.getMonth() &&
        bookedDate.getFullYear() === dateToCheck.getFullYear()
    );
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-20 lg:py-28 min-h-[80vh] flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                Booking Request Received!
              </h1>
              <p className="text-muted-foreground mb-8">
                Thank you for choosing Moonlight Elegance. Our team will review your 
                request and contact you within 24 hours to confirm your appointment.
              </p>
              <Button variant="elegant" onClick={() => setSubmitted(false)}>
                Make Another Booking
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

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
              Book Your Appointment
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            >
              Schedule Your{" "}
              <span className="text-gradient-rose">Bridal Session</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              Fill out the form below and we'll get back to you within 24 hours 
              to confirm your booking.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Form Fields */}
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-6"
                >
                  <motion.h2
                    variants={fadeInUp}
                    className="font-display text-2xl font-semibold mb-6"
                  >
                    Your Details
                  </motion.h2>

                  <motion.div variants={fadeInUp} className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </motion.div>

                  <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-2">
                    <Label htmlFor="location">Wedding Location *</Label>
                    <Input
                      id="location"
                      placeholder="Venue name and city"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-2">
                    <Label htmlFor="service">Service Required *</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-2">
                    <Label htmlFor="artist">Preferred Artist</Label>
                    <Select
                      value={formData.artist}
                      onValueChange={(value) => setFormData({ ...formData, artist: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an artist (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {artists.map((artist) => (
                          <SelectItem key={artist.id} value={artist.id}>
                            {artist.name} - {artist.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-4">
                    <Label>Preferred Style *</Label>
                    <RadioGroup
                      value={formData.style}
                      onValueChange={(value) => setFormData({ ...formData, style: value })}
                      className="grid grid-cols-3 gap-4"
                    >
                      {["Traditional", "Contemporary", "Fusion"].map((style) => (
                        <div key={style} className="flex items-center space-x-2">
                          <RadioGroupItem value={style} id={style} />
                          <Label htmlFor={style} className="cursor-pointer">
                            {style}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-2">
                    <Label htmlFor="message">Additional Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your vision, preferences, or any special requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                    />
                  </motion.div>
                </motion.div>

                {/* Right Column - Calendar */}
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-6"
                >
                  <motion.h2
                    variants={fadeInUp}
                    className="font-display text-2xl font-semibold mb-6"
                  >
                    Select Wedding Date
                  </motion.h2>

                  <motion.div
                    variants={fadeInUp}
                    className="bg-card rounded-2xl p-6 shadow-soft"
                  >
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={isDateDisabled}
                      className="rounded-lg w-full"
                    />
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-muted" />
                        <span>Booked</span>
                      </div>
                    </div>
                    {date && (
                      <p className="mt-4 text-sm font-medium text-primary flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Selected: {date.toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </motion.div>

                  {/* Contact Info */}
                  <motion.div
                    variants={fadeInUp}
                    className="bg-secondary/50 rounded-2xl p-6 space-y-4"
                  >
                    <h3 className="font-display text-lg font-semibold">
                      Need Help?
                    </h3>
                    <div className="space-y-3">
                      <a
                        href="tel:+919876543210"
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        +91 98765 43210
                      </a>
                      <a
                        href="mailto:booking@moonlightelegance.com"
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        booking@moonlightelegance.com
                      </a>
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp Us
                      </a>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Button variant="elegant" size="xl" type="submit" className="w-full">
                      Submit Booking Request
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
