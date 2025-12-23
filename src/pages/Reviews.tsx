import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

const reviews = [
  {
    id: 1,
    name: "Meera Kapoor",
    rating: 5,
    date: "December 2024",
    artist: "Priya Sharma",
    text: "Absolutely stunning work! My wedding day look was beyond my dreams. Priya understood exactly what I wanted and executed it perfectly. The entire team was so professional and caring. I felt like a princess!",
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    name: "Sanya Mehta",
    rating: 5,
    date: "November 2024",
    artist: "Elena Rose",
    text: "Moonlight Elegance made me feel like a princess. Elena created the most beautiful hairstyle that stayed perfect throughout my wedding events. Their attention to detail is unmatched. Highly recommend!",
    helpful: 18,
    verified: true,
  },
  {
    id: 3,
    name: "Riya Gupta",
    rating: 5,
    date: "November 2024",
    artist: "Anita Desai",
    text: "From the trial to the wedding day, everything was perfect. Anita's saree draping skills are incredible - I received so many compliments! The artists understood exactly what I wanted and made me look stunning.",
    helpful: 15,
    verified: true,
  },
  {
    id: 4,
    name: "Kavya Reddy",
    rating: 5,
    date: "October 2024",
    artist: "Priya Sharma",
    text: "Best decision I made for my wedding! The bridal makeup was flawless and lasted the entire day. The team was punctual, professional, and incredibly talented. Worth every penny!",
    helpful: 21,
    verified: true,
  },
  {
    id: 5,
    name: "Neha Sharma",
    rating: 4,
    date: "October 2024",
    artist: "Elena Rose",
    text: "Great experience overall! The hairstyling was beautiful and exactly what I showed in my reference pictures. Only minor feedback would be the trial could have been a bit longer, but the final result was amazing.",
    helpful: 12,
    verified: true,
  },
  {
    id: 6,
    name: "Pooja Iyer",
    rating: 5,
    date: "September 2024",
    artist: "Anita Desai",
    text: "I had a fusion wedding look and Anita nailed it perfectly! She blended traditional elements with modern touches beautifully. My photos turned out amazing because of how well everything was done.",
    helpful: 19,
    verified: true,
  },
];

const ratingBreakdown = {
  5: 85,
  4: 10,
  3: 3,
  2: 1,
  1: 1,
};

export default function Reviews() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    text: "",
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback. Your review will be published after verification.",
    });
    setShowForm(false);
    setNewReview({ name: "", rating: 5, text: "" });
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
              Testimonials
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            >
              What Our{" "}
              <span className="text-gradient-rose">Brides Say</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              Read authentic reviews from our happy brides and discover why 
              they chose Moonlight Elegance for their special day.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Rating Overview */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Overall Rating */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="font-display text-5xl font-semibold">4.9</span>
                  <Star className="h-10 w-10 text-gold fill-gold" />
                </div>
                <p className="text-muted-foreground">Based on 500+ reviews</p>
                <div className="flex items-center justify-center md:justify-start gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-gold fill-gold" />
                  ))}
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {Object.entries(ratingBreakdown)
                  .reverse()
                  .map(([stars, percentage]) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm w-12">{stars} stars</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-10">
                        {percentage}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-display text-2xl font-semibold">
                All Reviews
              </h2>
              <Button variant="elegant" onClick={() => setShowForm(!showForm)}>
                Write a Review
              </Button>
            </div>

            {/* Review Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-card rounded-2xl p-8 shadow-soft mb-12"
              >
                <h3 className="font-display text-xl font-semibold mb-6">
                  Share Your Experience
                </h3>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="review-name">Your Name</Label>
                    <Input
                      id="review-name"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${
                              star <= newReview.rating
                                ? "text-gold fill-gold"
                                : "text-muted"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-text">Your Review</Label>
                    <Textarea
                      id="review-text"
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                      placeholder="Share your experience with us..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" variant="elegant">
                      Submit Review
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Reviews Grid */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  variants={fadeInUp}
                  className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elegant transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{review.name}</h3>
                        {review.verified && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.date} • Artist: {review.artist}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-gold fill-gold"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative pl-6 mb-4">
                    <Quote className="absolute left-0 top-0 h-4 w-4 text-primary/30" />
                    <p className="text-muted-foreground leading-relaxed">
                      {review.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
