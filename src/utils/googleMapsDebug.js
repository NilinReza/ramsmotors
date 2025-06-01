// Google Maps API Debug Utility
// This utility helps debug Google Maps API issues

export const debugGoogleMapsAPI = async (apiKey) => {
  console.log('🔍 GOOGLE MAPS API DEBUGGING');
  console.log('============================');
  
  if (!apiKey) {
    console.error('❌ No API key provided');
    return { success: false, error: 'No API key' };
  }
  
    // Test if the API key works with a simple request
  try {
    const testUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
    console.log('🌐 Testing API endpoint:', testUrl.replace(apiKey, 'API_KEY_HIDDEN'));
    
    // Create a script element to test loading
    const script = document.createElement('script');
    script.src = testUrl;
    
    return new Promise((resolve) => {
      script.onload = () => {
        console.log('✅ Google Maps API loaded successfully');
        document.head.removeChild(script);
        resolve({ success: true });
      };
      
      script.onerror = (error) => {
        console.error('❌ Google Maps API failed to load:', error);
        document.head.removeChild(script);
        resolve({ 
          success: false, 
          error: 'Failed to load Google Maps API',
          suggestions: [
            'Check if the API key is valid',
            'Ensure Maps JavaScript API is enabled in Google Cloud Console',
            'Verify billing is set up',
            'Check API restrictions (HTTP referrers, IP addresses)',
            'Ensure the API key has sufficient quota'
          ]
        });
      };
      
      document.head.appendChild(script);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
          console.error('⏰ Google Maps API loading timed out');
          resolve({ 
            success: false, 
            error: 'API loading timed out',
            suggestions: [
              'Check network connectivity',
              'Verify API key permissions',
              'Check for firewall/proxy issues'
            ]
          });
        }
      }, 10000);
    });
    
  } catch (error) {
    console.error('💥 Error testing Google Maps API:', error);
    return { 
      success: false, 
      error: error.message,
      suggestions: ['Check browser console for more details']
    };
  }
};

export const checkAPIKeyRestrictions = (apiKey) => {
  console.log('🔍 API Key Configuration Check');
  console.log('===============================');
  
  if (!apiKey) {
    console.error('❌ No API key to check');
    return;
  }
  
  const currentDomain = window.location.hostname;
  const currentProtocol = window.location.protocol;
  const currentPort = window.location.port;
  const fullDomain = `${currentProtocol}//${currentDomain}${currentPort ? ':' + currentPort : ''}`;
  
  console.log('🌐 Current domain:', fullDomain);
  console.log('📝 Make sure your Google Cloud Console API restrictions include:');
  console.log('   - http://localhost:3000/* (for development)');
  console.log('   - https://yourdomain.com/* (for production)');
  console.log('   - https://ramsmotors.ca/* (for your production domain)');
  
  console.log('🔧 Required APIs in Google Cloud Console:');
  console.log('   - Maps JavaScript API');
  console.log('   - Places API (if using places features)');
  console.log('   - Maps Embed API (if using embedded maps)');
  
  console.log('💳 Billing requirements:');
  console.log('   - Billing account must be active');
  console.log('   - Maps JavaScript API is not free (check pricing)');
  console.log('   - Set up spending limits if needed');
};

export const suggestAPIKeyFixes = () => {
  console.log('🛠️ GOOGLE MAPS API TROUBLESHOOTING GUIDE');
  console.log('==========================================');
  
  console.log('1. 🔑 API Key Issues:');
  console.log('   • Ensure the API key is valid and not expired');
  console.log('   • Check if the key is properly configured in .env.local');
  console.log('   • Verify the key has the correct permissions');
  
  console.log('2. 🌐 API Restrictions:');
  console.log('   • Check HTTP referrers in Google Cloud Console');
  console.log('   • Add your domains: localhost:3000, your-domain.com');
  console.log('   • Ensure no IP address restrictions block your server');
  
  console.log('3. 🔌 Enabled APIs:');
  console.log('   • Maps JavaScript API must be enabled');
  console.log('   • Places API (if using places functionality)');
  console.log('   • Check quota and usage limits');
  
  console.log('4. 💳 Billing:');
  console.log('   • Billing account must be active and linked');
  console.log('   • Maps JavaScript API requires billing');
  console.log('   • Check for exceeded quotas or spending limits');
  
  console.log('5. 🔧 Common Solutions:');
  console.log('   • Clear browser cache and reload');
  console.log('   • Check browser developer tools for specific errors');
  console.log('   • Test with a simple HTML file first');
  console.log('   • Verify environment variables are loaded');
  
  console.log('6. 🆘 If all else fails:');
  console.log('   • Use the fallback map component');
  console.log('   • Contact Google Cloud Support');
  console.log('   • Check Google Cloud Console status page');
};
