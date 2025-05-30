import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import googleReviewsService from '../services/googleReviews';

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Loading Google Reviews...');
        const result = await googleReviewsService.fetchReviews();
        
        if (result.success && result.data) {
          console.log(`✅ Loaded ${result.data.reviews.length} reviews from ${result.source}`);
          setReviewsData(result.data);
          setReviews(result.data.reviews.map(review => 
            googleReviewsService.formatReview(review)
          ));
        } else {
          throw new Error('Failed to fetch reviews');
        }
        
      } catch (error) {
        console.error('❌ Error loading reviews:', error);
        setError('Unable to load reviews at this time');
        
        // Try to get fallback reviews as last resort
        try {
          const fallbackResult = googleReviewsService.getFallbackReviews();
          if (fallbackResult.success) {
            setReviewsData(fallbackResult.data);
            setReviews(fallbackResult.data.reviews.map(review => 
              googleReviewsService.formatReview(review)
            ));
            setError(null); // Clear error since we have fallback data
          }
        } catch (fallbackError) {
          console.error('❌ Even fallback reviews failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Customer Reviews</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="h-4 w-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && (!reviews || reviews.length === 0)) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Customer Reviews</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Reviews Temporarily Unavailable
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>We're working to resolve this issue. Please check back later or visit our Google Business page directly.</p>
              </div>
              <div className="mt-4">
                <a
                  href="https://www.google.com/maps/place/Rams+Motors/@43.751455,-79.263287,15z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-800 underline hover:text-yellow-900"
                >
                  View reviews on Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Google Reviews</h3>
        <div className="flex items-center space-x-2">
          <div className="flex">{renderStars(Math.round(reviewsData?.overall_rating || 5))}</div>
          <span className="text-sm text-gray-600">
            {reviewsData?.overall_rating?.toFixed(1) || '5.0'} ({reviewsData?.total_reviews || 0} reviews)
          </span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {reviews.map((review, index) => (
          <div key={review.id || index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start space-x-3">
              {review.profilePhoto && (
                <img
                  src={review.profilePhoto}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{review.author}</span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <span className="text-sm text-gray-500">{review.relativeTime}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <a
          href="https://www.google.com/maps/place/Rams+Motors/@43.751455,-79.263287,15z"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View all reviews on Google Maps →
        </a>
      </div>
    </div>
  );
};

export default GoogleReviews;