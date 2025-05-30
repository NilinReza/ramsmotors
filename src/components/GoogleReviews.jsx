import React, { useState, useEffect } from 'react';
import { Star, ExternalLink, User } from 'lucide-react';
import googleReviewsService from '../services/googleReviews';

const GoogleReviews = ({ showTitle = true, maxReviews = 3 }) => {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const result = await googleReviewsService.fetchReviews();
        
        if (result.success && result.data) {
          setReviewsData(result.data);
        } else {
          // Fallback if API returns unsuccessful result
          const fallbackResult = googleReviewsService.getFallbackReviews();
          setReviewsData(fallbackResult.data);
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
        // Use fallback data on error
        const fallbackResult = googleReviewsService.getFallbackReviews();
        setReviewsData(fallbackResult.data);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Customer Reviews</h3>
            <div className="flex justify-center items-center space-x-2">
              <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        )}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-lg animate-pulse">
            <div className="flex items-center mb-4 space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!reviewsData) {
    return null;
  }
  const displayReviews = reviewsData.reviews
    .slice(0, maxReviews)
    .map((review, index) => ({
      ...review,
      id: review.id || `review_${index}`,
      relativeTime: googleReviewsService.getRelativeTime(review.date)
    }));

  return (
    <div className="space-y-6">      {showTitle && (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Customer Reviews</h3>          <div className="flex justify-center items-center space-x-2">
            <div className="flex">
              {renderStars(Math.round(reviewsData.overall_rating || reviewsData.rating || 4.7))}
            </div>
            <span className="text-white text-lg font-semibold">
              {(reviewsData.overall_rating || reviewsData.rating || 4.7).toFixed(1)}
            </span>
            <span className="text-gray-400">
              ({reviewsData.total_reviews || reviewsData.totalReviews || 89} reviews)
            </span>
          </div>
          {/* Review source indicator */}
          {reviewsData.source && (
            <div className="mt-2">
              {reviewsData.source === 'google' ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Live Google Reviews
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                  Recent Customer Feedback
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {displayReviews.map((review) => (
        <div key={review.id} className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-start mb-4 space-x-3">
            {review.profilePhoto ? (
              <img
                src={review.profilePhoto}
                alt={review.author}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">{review.author}</h4>
                <span className="text-sm text-gray-400">{review.relativeTime}</span>
              </div>
              <div className="flex items-center">
                {renderStars(review.rating)}
                <span className="ml-2 text-sm text-gray-400">
                  {review.rating}/5
                </span>
              </div>
            </div>
          </div>
          
          <blockquote className="text-gray-300 italic mb-4 leading-relaxed">
            "{review.text}"
          </blockquote>
        </div>
      ))}

      <div className="text-center">
        <a
          href="https://www.google.com/maps/place/Rams+Motors/@43.7315,-79.2665,15z/data=!4m5!3m4!1s0x0:0x0!8m2!3d43.7315!4d-79.2665"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-red-400 hover:text-red-300 font-medium transition-colors"
        >
          <span>View all Google Reviews</span>
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
};

export default GoogleReviews;
