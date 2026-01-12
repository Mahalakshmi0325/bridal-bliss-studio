import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

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

interface Review {
  id: string;
  user_id: string;
  artist_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name?: string;
}

interface Artist {
  id: string;
  specialization: string[];
}

const ratingBreakdown = {
  5: 85,
  4: 10,
  3: 3,
  2: 1,
  1: 1,
};

export default function Reviews() {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [newReview, setNewReview] = useState({
    artist_id: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
    fetchArtists();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setReviews(data as Review[]);
    }
  };

  const fetchArtists = async () => {
    const { data } = await supabase
      .from("artists")
      .select("id, specialization")
      .eq("verified", true);
    
    if (data) {
      setArtists(data as Artist[]);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!newReview.artist_id) {
      toast({
        title: "Please select an artist",
        description: "Choose the artist you want to review.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      artist_id: newReview.artist_id,
      rating: newReview.rating,
      comment: newReview.comment || null,
    });

    if (error) {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
      setShowForm(false);
      setNewReview({ artist_id: "", rating: 5, comment: "" });
      fetchReviews();
    }

    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
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
                <p className="text-muted-foreground">Based on {reviews.length || "500+"}  reviews</p>
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
              {user ? (
                <Button variant="elegant" onClick={() => setShowForm(!showForm)}>
                  Write a Review
                </Button>
              ) : (
                <Button variant="elegant" asChild>
                  <Link to="/login">Sign in to Review</Link>
                </Button>
              )}
            </div>

            {/* Review Form */}
            {showForm && user && (
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
                    <Label htmlFor="artist">Select Artist *</Label>
                    <Select
                      value={newReview.artist_id}
                      onValueChange={(value) => setNewReview({ ...newReview, artist_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose the artist you worked with" />
                      </SelectTrigger>
                      <SelectContent>
                        {artists.map((artist) => (
                          <SelectItem key={artist.id} value={artist.id}>
                            {artist.specialization.join(", ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with us..."
                      rows={4}
                      maxLength={1000}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" variant="elegant" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
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
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No reviews yet. Be the first to share your experience!
                </div>
              ) : (
                reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    variants={fadeInUp}
                    className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elegant transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">Happy Bride</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            Verified
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(review.created_at)}
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

                    {review.comment && (
                      <div className="relative pl-6 mb-4">
                        <Quote className="absolute left-0 top-0 h-4 w-4 text-primary/30" />
                        <p className="text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        Helpful
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
