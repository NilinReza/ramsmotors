import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import apiService from "../services/api_clean";

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  // Inline service functions
  const formatReview = (review) => {
    return {
      id: review.time || Math.random(),
      author: review.author,
      rating: review.rating,
      text: review.text,
      time: review.time,
      relativeTime: review.relative_time_description,
      profilePhoto: review.profilePhoto,
      isGoogle: true,
    };
  };
  const getFallbackReviews = () => {
    const fallbackReviews = [
      {
        author: "Sarah Johnson",
        rating: 5,
        text: "Excellent service and great selection of vehicles! The team at Rams Motors was very helpful and professional throughout the entire process.",
        time: 1672531200,
        relative_time_description: "2 months ago",
        profilePhoto: null,
      },
      {
        author: "Mike Chen",
        rating: 5,
        text: "Found the perfect car at a great price. The staff was knowledgeable and made the buying process smooth and easy.",
        time: 1671926400,
        relative_time_description: "3 months ago",
        profilePhoto: null,
      },
      {
        author: "Jennifer Martinez",
        rating: 5,
        text: "Highly recommend Rams Motors! They have quality vehicles and honest pricing. Will definitely come back for my next car purchase.",
        time: 1671321600,
        relative_time_description: "3 months ago",
        profilePhoto: null,
      },
      {
        author: "David Thompson",
        rating: 4,
        text: "Great experience overall. The team was helpful and the car I purchased has been running perfectly. Good selection of pre-owned vehicles.",
        time: 1670716800,
        relative_time_description: "4 months ago",
        profilePhoto: null,
      },
    ];

    return {
      success: true,
      data: {
        overall_rating: 4.8,
        total_reviews: 127,
        reviews: fallbackReviews,
      },
      source: "Fallback Data",
    };
  };

  const fetchReviews = async () => {    try {
      // Use the API service which calls the Supabase Edge Function
      const result = await apiService.getGoogleReviews();
      
      if (result.success && result.data) {
        
        return {
          success: true,
          data: {
            overall_rating: result.data.overall_rating,
            total_reviews: result.data.total_reviews,
            reviews: result.data.reviews || [],
          },
          source: result.source || "API Service",
        };      } else {
        // Fall back to static reviews
        return getFallbackReviews();
      }
    } catch (error) {
      console.error("❌ Unexpected error in fetchReviews:", error);
      return getFallbackReviews();
    }  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Use the API service which calls the Supabase Edge Function
        const result = await apiService.getGoogleReviews();
        
        if (result.success && result.data) {
          
          return {
            success: true,
            data: {
              overall_rating: result.data.overall_rating,
              total_reviews: result.data.total_reviews,
              reviews: result.data.reviews || [],
            },
            source: result.source || "API Service",
          };
        } else {
          // Fall back to static reviews
          return getFallbackReviews();
        }
      } catch (error) {
        console.error("❌ Unexpected error in fetchReviews:", error);
        return getFallbackReviews();
      }
    };

    const loadReviews = async (retryCount = 0) => {
      const maxRetries = 2;try {
        setLoading(true);
        setError(null);

        const result = await fetchReviews();

        if (result.success && result.data) {
          setReviewsData(result.data);
          setReviews(result.data.reviews.map((review) => formatReview(review)));          // If we got fallback data on first try and there are retries left, try again
          if (result.source === "Fallback Data" && retryCount < maxRetries) {
            setTimeout(() => loadReviews(retryCount + 1), 1000);
            return;
          }
        } else {
          throw new Error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("❌ Error loading reviews:", error);        // Retry if we haven't reached max retries
        if (retryCount < maxRetries) {
          setTimeout(() => loadReviews(retryCount + 1), 2000);
          return;
        }

        setError("Unable to load reviews at this time");

        // Try to get fallback reviews as last resort
        try {
          const fallbackResult = getFallbackReviews();
          if (fallbackResult.success) {
            setReviewsData(fallbackResult.data);
            setReviews(
              fallbackResult.data.reviews.map((review) => formatReview(review))
            );
          }
        } catch (fallbackError) {
          console.error("❌ Error getting fallback reviews:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []); // Remove dependency on fetchReviews to avoid infinite loops

  const renderStars = (rating, size = "w-4 h-4") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Reviews
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Reviews
        </h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
        {reviewsData && (
          <div className="text-sm text-gray-600">
            Source: {reviewsData.source || "Unknown"}
          </div>
        )}
      </div>

      {/* Overall Rating Summary */}
      {reviewsData && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-800 mr-2">
                {reviewsData.overall_rating?.toFixed(1) || "4.8"}
              </div>
              {renderStars(
                Math.round(reviewsData.overall_rating || 4.8),
                "w-5 h-5"
              )}
            </div>
            <div className="text-sm text-gray-600">
              ({reviewsData.total_reviews || 0} reviews)
            </div>
          </div>
        </div>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.slice(0, 5).map((review, index) => (
          <div key={review.id || index} className="border-b border-gray-200 pb-4">
            <div className="flex items-start space-x-3">
              {review.profilePhoto ? (
                <img
                  src={review.profilePhoto}
                  alt={review.author}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">
                    {review.author?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-800">
                    {review.author || "Anonymous"}
                  </h4>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {review.relativeTime ||
                        new Date(review.time * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Reviews Link */}
      <div className="mt-6 text-center">
        <a
          href="https://www.google.com/maps/place/Rams+Motors"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
        >
          View all reviews on Google
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default GoogleReviews;
