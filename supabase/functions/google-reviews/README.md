# Google Reviews Supabase Edge Function

This Supabase Edge Function fetches Google Reviews for Rams Motors and provides intelligent caching and fallback mechanisms.

## 🎯 Features

- **Smart Caching**: Reviews are cached for 1 hour to reduce API calls
- **Error Handling**: Robust error handling with fallback reviews
- **Data Validation**: Filters and validates review data before processing
- **Type Safety**: Full TypeScript support with proper type definitions
- **CORS Support**: Handles cross-origin requests properly

## 📋 Environment Variables Required

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_PLACE_ID=your_google_place_id
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🗄️ Database Schema

The function expects a `google_reviews_cache` table with:

```sql
CREATE TABLE google_reviews_cache (
  place_id TEXT PRIMARY KEY,
  reviews_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "author": "John Smith",
        "rating": 5,
        "text": "Excellent service!",
        "date": "2025-05-30T15:58:44.000Z",
        "profilePhoto": "https://...",
        "source": "google"
      }
    ],
    "overall_rating": 4.5,
    "total_reviews": 89,
    "fetched_at": "2025-05-30T15:58:44.562Z"
  },
  "source": "cache" | "live" | "fallback"
}
```

### Error Response
```json
{
  "success": true,
  "data": {
    "reviews": [...fallback_reviews],
    "overall_rating": 4.7,
    "total_reviews": 89,
    "fetched_at": "2025-05-30T15:58:44.562Z"
  },
  "source": "fallback",
  "error": "error message"
}
```

## 🧪 Testing

Run the test script to validate the function logic:

```bash
node test-function.js
```

## 🚀 Deployment

Deploy to Supabase:

```bash
supabase functions deploy google-reviews
```

## 🔧 Configuration Files

- `deno.json` - Deno runtime configuration
- `tsconfig.json` - TypeScript compiler configuration
- `types.d.ts` - TypeScript type definitions for Deno
- `import_map.json` - Import map for dependencies

## 💡 Key Improvements Made

1. **Enhanced Error Handling**: Added comprehensive error checking and logging
2. **Type Safety**: Added proper TypeScript interfaces and type checking
3. **Data Validation**: Reviews are filtered and validated before processing
4. **Better Caching**: Improved cache error handling to prevent function failures
5. **HTTP Method Validation**: Only allows GET requests
6. **Rating Validation**: Ensures ratings are within 1-5 range
7. **Fallback System**: Provides fallback reviews when API fails

## 🛠️ Local Development

The TypeScript compiler may show import errors for Deno modules, but this is expected when working in a Node.js environment. The function will work correctly when deployed to Supabase Edge Runtime.

## 📝 Notes

- Reviews are limited to 5 most recent
- Cache duration is 1 hour
- Function includes comprehensive fallback data
- All responses include CORS headers for frontend integration
