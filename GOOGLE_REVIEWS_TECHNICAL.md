# Google Reviews Integration - Technical Documentation

## Overview

This system integrates real Google Reviews from your business's Google My Business listing into the RamsMotors website. The implementation uses a secure backend proxy approach to handle authentication and CORS issues.

## Architecture

```
Frontend (React)               Backend (.NET)                  Google
+----------------+            +----------------+             +----------------+
|                |            |                |             |                |
|  GoogleReviews |  Request   |   Reviews      |   API Call  |   Places API   |
|  Component     |----------->|   Controller   |------------>|   (Google Maps)|
|                |            |                |             |                |
+----------------+            +----------------+             +----------------+
       |                             |                              |
       |                             |                              |
       v                             v                              v
+----------------+            +----------------+             +----------------+
|  Displays UI   |            | Processes and  |             |  Returns real  |
|  with reviews  |<-----------|  formats data  |<------------| customer data  |
|  and ratings   |   Response |  with fallback |    Response |  from GMB      |
+----------------+            +----------------+             +----------------+
```

## Implementation Details

### 1. Frontend Component (GoogleReviews.jsx)

- React component that displays reviews in a clean, professional format
- Handles loading states, errors, and empty states
- Star rating visualization
- Responsive layout for all screen sizes
- Located at `src/components/GoogleReviews.jsx`

### 2. Frontend Service (googleReviews.js)

- API service that communicates with the backend
- Handles API requests and response formatting
- Includes fallback logic if the API is unavailable
- Located at `src/services/googleReviews.js`

### 3. Backend Controller (ReviewsController.cs)

- .NET controller that acts as a secure proxy to Google Places API
- Handles authentication with Google using API key
- Formats response data consistently
- Provides fallback reviews if Google API is unavailable
- Located at `RamsMotorsAPI/Controllers/ReviewsController.cs`

### 4. Configuration

- Google Places API key stored in backend `appsettings.json`
- Place ID for your specific business location configured in backend
- CORS settings to allow frontend access

## API Reference

### Backend Endpoint

```
GET: /api/reviews/google
```

**Response Structure:**
```json
{
  "rating": 4.9,            // Overall business rating
  "totalReviews": 27,       // Total number of reviews
  "reviews": [              // Array of review objects
    {
      "id": "unique_id",    // Unique identifier
      "author": "Name",     // Reviewer name
      "rating": 5,          // Individual review rating (1-5)
      "text": "Review text...", // Review content
      "date": "May 04, 2025",   // Formatted date
      "profilePhoto": "https://..." // Profile photo URL (may be null)
    },
    // Additional reviews...
  ]
}
```

## Error Handling

1. **API Unavailable**: Falls back to predefined review data
2. **Rate Limiting**: Handles Google API quotas gracefully
3. **Malformed Responses**: Proper error handling and logging
4. **Network Issues**: Frontend displays fallback UI

## Security Considerations

1. **API Key Protection**: Key stored only on backend, never exposed to client
2. **CORS Protection**: Properly configured for security
3. **Data Validation**: All incoming data validated before processing

## Future Enhancements

1. **Caching**: Implement Redis or in-memory caching to reduce API calls
2. **Pagination**: Add support for viewing more reviews
3. **Sorting Options**: Allow sorting by date, rating, etc.
4. **Review Filtering**: Add ability to filter by rating or keywords
5. **Automated Refresh**: Set up a background service to refresh reviews periodically

## Troubleshooting

If reviews aren't displaying properly:

1. Check backend logs for Google API errors
2. Verify the API key is valid and has proper permissions
3. Confirm the Place ID matches your business listing
4. Check network requests in browser developer tools

## Google Places API Documentation

For more details on the Google Places API:
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Place Details Documentation](https://developers.google.com/maps/documentation/places/web-service/details)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
