"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, ThumbsUp, ChevronDown, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/authContext";

// Dummy data for reviews
const initialReviews = [
  {
    id: "rev-1",
    author: "Nuva",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    rating: 5,
    date: "2 days ago",
    content: "Chef Nusrat's Kacchi Biryani is absolutely divine! The meat was so tender it fell off the bone, and the aroma was just perfect. Highly recommended for any weekend family dinner.",
    helpful: 12,
  },
  {
    id: "rev-2",
    author: "tasu",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    rating: 4,
    date: "1 week ago",
    content: "Great food overall. The Beef Kala Bhuna by Chef Ali was spicy and flavourful. Delivery was a bit late, but the food was still warm. Will order again.",
    helpful: 5,
  },
  {
    id: "rev-3",
    author: "Nawfat",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 5,
    date: "2 weeks ago",
    content: "The best homemade pasta I've ever had in Dhaka. Chef Rahman knows his Italian cuisine perfectly. The white sauce was creamy and rich without being heavy.",
    helpful: 8,
  }

];

export default function RatingPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { profile } = useAuth();

  // Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview = {
        id: `rev-${Date.now()}`,
        author: profile?.name || "Guest User",
        avatar: "https://ui-avatars.com/api/?name=" + (profile?.name || "Guest") + "&background=3E6F56&color=fff",
        rating,
        date: "Just now",
        content: reviewText,
        helpful: 0,
      };

      setReviews([newReview, ...reviews]);
      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form after a delay
      setTimeout(() => {
        setIsFormOpen(false);
        setShowSuccess(false);
        setRating(0);
        setReviewText("");
      }, 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-sage-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between mb-12 bg-white p-8 rounded-3xl shadow-sm border border-sage-100">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-display font-bold text-sage-900 mb-2">Community Reviews</h1>
            <p className="text-sage-600 max-w-md">
              Read what our community is saying about the amazing home chefs in your neighborhood, or share your own experience!
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-sage-50 rounded-2xl min-w-[200px]">
            <div className="text-5xl font-bold text-emerald-700 mb-2">4.8</div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-apricot text-apricot" />
              ))}
            </div>
            <div className="text-sm text-sage-500 font-medium">Based on 1,248 reviews</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sage-700 font-medium">
            <span className="bg-sage-200 text-sage-800 py-1 px-3 rounded-full text-sm">
              {reviews.length} Reviews
            </span>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            {isFormOpen ? "Cancel Review" : "Write a Review"}
          </button>
        </div>

        {/* Review Form (Expandable) */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-sage-200">
                {showSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-emerald-600"
                  >
                    <CheckCircle2 className="w-16 h-16 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Review Submitted!</h3>
                    <p className="text-sage-600">Thank you for sharing your experience.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className="text-xl font-bold text-sage-900 mb-6">Share Your Experience</h3>

                    {!profile && (
                      <div className="mb-6 p-4 bg-apricot/10 border border-apricot/20 rounded-xl flex items-start gap-3 text-sage-800 text-sm">
                        <div className="mt-0.5">ℹ️</div>
                        <p>You are writing this review as a guest. <a href="/login" className="text-emerald-600 font-semibold hover:underline">Log in</a> to keep track of your reviews and get loyalty points!</p>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-sage-700 mb-2">Overall Rating *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${(hoverRating || rating) >= star
                                ? "fill-apricot text-apricot"
                                : "text-sage-300"
                                } transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="reviewText" className="block text-sm font-medium text-sage-700 mb-2">Your Review *</label>
                      <textarea
                        id="reviewText"
                        rows={4}
                        required
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Tell us about the food, the chef, delivery experience..."
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none bg-sage-50/50"
                      ></textarea>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={rating === 0 || reviewText.trim() === "" || isSubmitting}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${rating > 0 && reviewText.trim() !== "" && !isSubmitting
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                          : "bg-sage-200 text-sage-500 cursor-not-allowed"
                          }`}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="space-y-6">
          <AnimatePresence>
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-sage-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-sage-200 shrink-0">
                      <Image src={review.avatar} alt={review.author} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sage-900">{review.author}</h4>
                      <div className="text-sm text-sage-500">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? "fill-apricot text-apricot" : "text-sage-200"}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sage-700 leading-relaxed mb-6">
                  {review.content}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-sage-100">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-sage-100 text-sage-500 text-sm font-medium transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More (Dummy) */}
        <div className="mt-10 text-center">
          <button className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
            Load More Reviews <ChevronDown className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
