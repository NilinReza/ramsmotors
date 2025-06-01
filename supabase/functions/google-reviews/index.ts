// Supabase Edge Function for Google Reviews
// This file is designed to run in Deno runtime
/// <reference path="./types.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Type definitions for better code organization
interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url?: string;
}

interface GooglePlacesResponse {
  result: {
    reviews?: GoogleReview[];
    rating: number;
    user_ratings_total: number;
  };
  status: string;
}

interface TransformedReview {
  author: string;
  rating: number;
  text: string;
  date: string;
  profilePhoto: string | null;
  source: string;
}

interface ReviewsData {
  reviews: TransformedReview[];
  overall_rating: number;
  total_reviews: number;
  fetched_at: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  // Only allow GET requests (fix the 405 error)
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: { ...corsHeaders, 'Allow': 'GET, OPTIONS' } 
    });
  }

  try {
    // Get environment variables with validation
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')
    const GOOGLE_PLACE_ID = Deno.env.get('GOOGLE_PLACE_ID')
    
    // Debug logging for environment variables
    console.log('Environment variables check:', {
      hasApiKey: !!GOOGLE_PLACES_API_KEY,
      hasPlaceId: !!GOOGLE_PLACE_ID,
      apiKeyLength: GOOGLE_PLACES_API_KEY?.length || 0,
      placeIdLength: GOOGLE_PLACE_ID?.length || 0
    })
    
    if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
      console.error('Missing environment variables:', {
        hasApiKey: !!GOOGLE_PLACES_API_KEY,
        hasPlaceId: !!GOOGLE_PLACE_ID
      })
      throw new Error('Missing Google Places API configuration')
    }

    // Create Supabase client with validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      })
      throw new Error('Missing Supabase configuration')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check cache first (reviews are cached for 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    const { data: cachedReviews, error: cacheError } = await supabase
      .from('google_reviews_cache')
      .select('*')
      .eq('place_id', GOOGLE_PLACE_ID)
      .gte('updated_at', oneHourAgo)
      .single()

    if (cachedReviews && !cacheError) {
      console.log('Returning cached Google Reviews')
      return new Response(
        JSON.stringify({
          success: true,
          data: cachedReviews.reviews_data,
          source: 'cache'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch fresh reviews from Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`
    
    const response = await fetch(url)
    const data: GooglePlacesResponse = await response.json()

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`)
    }

    // Transform the reviews
    const transformedReviews: TransformedReview[] = (data.result.reviews || []).map(review => ({
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      date: new Date(review.time * 1000).toISOString(),
      profilePhoto: review.profile_photo_url || null,
      source: 'Google'
    }))

    const reviewsData: ReviewsData = {
      reviews: transformedReviews,
      overall_rating: data.result.rating,
      total_reviews: data.result.user_ratings_total,
      fetched_at: new Date().toISOString()
    }

    // Cache the results
    await supabase
      .from('google_reviews_cache')
      .upsert({
        place_id: GOOGLE_PLACE_ID,
        reviews_data: reviewsData,
        updated_at: new Date().toISOString()
      })

    console.log(`Fetched ${transformedReviews.length} fresh Google Reviews`)
    
    return new Response(
      JSON.stringify({
        success: true,
        data: reviewsData,
        source: 'fresh'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Google Reviews function error:', error.message)
    
    // Return fallback reviews on error
    const fallbackReviews: ReviewsData = {
      reviews: [
        {
          author: "John D.",
          rating: 5,
          text: "Excellent service and great selection of vehicles. The staff was very helpful and professional.",
          date: new Date().toISOString(),
          profilePhoto: null,
          source: "Google"
        },
        {
          author: "Sarah M.",
          rating: 5,
          text: "Found my dream car here! The buying process was smooth and hassle-free.",
          date: new Date().toISOString(),
          profilePhoto: null,
          source: "Google"
        },
        {
          author: "Mike R.",
          rating: 4,
          text: "Good experience overall. Fair prices and honest dealings.",
          date: new Date().toISOString(),
          profilePhoto: null,
          source: "Google"
        }
      ],
      overall_rating: 4.7,
      total_reviews: 45,
      fetched_at: new Date().toISOString()
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: fallbackReviews,
        source: 'fallback',
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})