import { motion } from "framer-motion";
import { Star, Award, Calendar, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";

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
  {
    id: 1,
    name: "Priya Sharma",
    role: "Senior Makeup Artist",
    image: artist1,
    rating: 4.9,
    reviews: 156,
    experience: "8+ years",
    specializations: ["Bridal Makeup", "HD Makeup", "Airbrush"],
    styles: ["Traditional", "Contemporary", "Fusion"],
    bio: "Priya brings over 8 years of experience in bridal artistry. Known for her flawless skin work and attention to detail.",
    featured: true,
  },
  {
    id: 2,
    name: "Elena Rose",
    role: "Hair Styling Expert",
    image: artist2,
    rating: 4.8,
    reviews: 124,
    experience: "10+ years",
    specializations: ["Bridal Updos", "Extensions", "Color"],
    styles: ["Classic", "Modern", "Bohemian"],
    bio: "Elena specializes in creating stunning hairstyles that complement your bridal look perfectly.",
    featured: true,
  },
  {
    id: 3,
    name: "Anita Desai",
    role: "Bridal Consultant & Stylist",
    image: artist3,
    rating: 5.0,
    reviews: 89,
    experience: "12+ years",
    specializations: ["Saree Draping", "Styling", "Jewelry"],
    styles: ["Traditional", "South Indian", "Indo-Western"],
    bio: "With deep knowledge of traditional and modern bridal styling, Anita ensures your complete bridal transformation.",
    featured: true,
  },
];

export default function Artists() {
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
              Our Team
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            >
              Meet Our{" "}
              <span className="text-gradient-rose">Expert Artists</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              Our team of talented artists brings together years of experience 
              and a passion for creating unforgettable bridal looks.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            {artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                variants={fadeInUp}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="relative group">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-elegant">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {artist.featured && (
                      <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gold/90 text-primary-foreground text-sm font-medium flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Featured Artist
                      </div>
                    )}
                    <a
                      href="#"
                      className="absolute bottom-4 right-4 p-3 rounded-full bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2">
                        {artist.name}
                      </h2>
                      <p className="text-primary text-lg">{artist.role}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-gold fill-gold" />
                        <span className="font-semibold">{artist.rating}</span>
                        <span className="text-muted-foreground">
                          ({artist.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                        <span>{artist.experience}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {artist.bio}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-3">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {artist.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Styles</h4>
                      <div className="flex flex-wrap gap-2">
                        {artist.styles.map((style) => (
                          <span
                            key={style}
                            className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button variant="elegant" size="lg" asChild>
                      <Link to={`/booking?artist=${artist.id}`}>
                        Book with {artist.name.split(" ")[0]}
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-20 lg:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl md:text-4xl font-semibold mb-6"
            >
              Are You a Talented Artist?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground mb-8"
            >
              Join our team of expert bridal artists and be part of creating 
              unforgettable moments for brides.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Apply to Join</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
