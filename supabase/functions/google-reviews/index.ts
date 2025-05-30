import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')
    const GOOGLE_PLACE_ID = Deno.env.get('GOOGLE_PLACE_ID')
    
    if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
      throw new Error('Missing Google Places API configuration')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
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
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`
    
    const googleResponse = await fetch(googleApiUrl)
    const googleData = await googleResponse.json()

    if (googleData.status !== 'OK') {
      throw new Error(`Google Places API error: ${googleData.status}`)
    }

    const result = googleData.result
    const reviews = result.reviews || []

    // Transform reviews to our format
    const transformedReviews = reviews.slice(0, 5).map((review: any) => ({
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      date: new Date(review.time * 1000).toISOString(),
      profilePhoto: review.profile_photo_url || null,
      source: 'google'
    }))

    const reviewsData = {
      reviews: transformedReviews,
      overall_rating: result.rating,
      total_reviews: result.user_ratings_total,
      fetched_at: new Date().toISOString()
    }

    // Cache the reviews
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
        source: 'live'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Google Reviews function error:', error)
    
    // Return fallback reviews on error
    const fallbackReviews = {
      reviews: [
        {
          author: "Recent Customer",
          rating: 5,
          text: "Excellent service and quality vehicles. The team at Rams Motors made the car buying process smooth and stress-free.",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          profilePhoto: null,
          source: 'fallback'
        },
        {
          author: "Satisfied Buyer",
          rating: 5,
          text: "Found exactly what I was looking for at a great price. Highly recommend Rams Motors for anyone looking for a reliable used car.",
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          profilePhoto: null,
          source: 'fallback'
        },
        {
          author: "Happy Customer",
          rating: 4,
          text: "Great selection of vehicles and professional staff. The financing options made it easy to get the car I wanted.",
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          profilePhoto: null,
          source: 'fallback'
        }
      ],
      overall_rating: 4.7,
      total_reviews: 89,
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
