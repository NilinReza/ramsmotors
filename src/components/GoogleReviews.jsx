import React, { useState, useEffect, useRef } from 'react';
import supabaseApiService from '../services/supabaseApi';

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    mountedRef.current = true;

    const fetchGoogleReviews = async () => {      // Prevent multiple simultaneous fetches
      if (fetchingRef.current) {
        return;
      }

      try {
        fetchingRef.current = true;
        setError(null);

        // Wait a bit to ensure everything is initialized
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize the service first
        const initialized = await supabaseApiService.initialize();
        if (!initialized && isMounted) {
          console.warn('⚠️ Service initialization failed, retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Use the retry version to fetch reviews
        const result = await supabaseApiService.getGoogleReviewsWithRetry();
          if (!isMounted || !mountedRef.current) {
          return;
        }

        if (result.success) {
          setReviews(result.data.reviews || []);
        } else {
          console.error('Failed to fetch reviews:', result.error);
          setError(result.error);
        }
      } catch (error) {
        if (!isMounted || !mountedRef.current) return;
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred');
      } finally {
        if (isMounted && mountedRef.current) {
          setLoading(false);
        }
        fetchingRef.current = false;
      }
    };    // Only fetch if we don't have reviews yet
    if (reviews.length === 0) {
      const timer = setTimeout(fetchGoogleReviews, 200);
      
      return () => {
        isMounted = false;
        mountedRef.current = false;
        clearTimeout(timer);
        fetchingRef.current = false;
      };
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
      mountedRef.current = false;
      fetchingRef.current = false;
    };
  }, [reviews.length]); // Add reviews.length to dependency array

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      fetchingRef.current = false;
    };
  }, []);
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
        <p className="mt-2 text-gray-300">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">Error loading reviews: {error}</p>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
            setReviews([]);
            supabaseApiService.clearGoogleReviewsCache();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300">No reviews available at the moment.</p>
      </div>
    );
  }return (
    <div className="bg-transparent p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
      
      {/* Individual Reviews */}
      <div className="space-y-4">        {reviews.slice(0, 5).map((review, index) => (
          <div key={`${review.author}-${index}`} className="border-b border-gray-600 pb-4">
            <div className="flex items-start space-x-3">
              {review.profilePhoto ? (
                <img
                  src={review.profilePhoto}
                  alt={review.author}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-avatar.png';
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {review.author?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white">
                    {review.author || "Anonymous"}
                  </h4>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>                    <span className="ml-2 text-sm text-gray-300">
                      {review.relative_time_description || 
                       new Date(review.time * 1000 || review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {review.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Reviews Link */}
      <div className="mt-6 text-center">        <a
          href="https://www.google.com/maps/place/Rams+Motors"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 hover:text-red-300 font-medium text-sm inline-flex items-center"
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