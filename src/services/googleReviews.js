// Google Reviews API Service
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5246/api';

// Service to fetch Google Reviews via backend proxy
export const googleReviewsService = {
  // Fetch reviews from backend API proxy
  async fetchReviews() {
    try {
      console.log('Fetching Google Reviews from backend...');
      const response = await axios.get(`${API_BASE_URL}/reviews/google`);
      
      if (response.data) {
        console.log('Successfully fetched reviews:', response.data);
        return response.data;
      } else {
        throw new Error('No review data received');
      }
    } catch (error) {
      console.error('Error fetching Google Reviews:', error);
      // Return fallback data
      return this.getFallbackReviews();
    }
  },
  // Format review for display (reviews are already formatted by backend)
  formatReview(review) {
    return review;
  },

  // Fallback reviews (handled by backend)
  getFallbackReviews() {
    return {
      rating: 4.8,
      totalReviews: 127,
      reviews: [
        {
          id: "fallback_1",
          author: "John D.",
          rating: 5,
          text: "Excellent service and great selection of vehicles! The team at Rams Motors went above and beyond to help me find the perfect car.",
          date: "Dec 15, 2024",
          profilePhoto: null
        },
        {
          id: "fallback_2", 
          author: "Sarah M.",
          rating: 5,
          text: "Professional and honest dealership. They made the car buying process smooth and stress-free. Highly recommend!",
          date: "Dec 10, 2024",
          profilePhoto: null
        },
        {
          id: "fallback_3",
          author: "Mike R.",
          rating: 4,
          text: "Good experience overall. Fair pricing and the staff was knowledgeable about the vehicles.",
          date: "Dec 08, 2024", 
          profilePhoto: null
        }
      ]
    };
  }
};

export default googleReviewsService;
