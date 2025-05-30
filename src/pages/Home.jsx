import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { Wrapper } from "@googlemaps/react-wrapper";
import {
  MapPin,
  Phone,
  Clock,
  Award,
  Users,
  Car,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar";
import GoogleReviews from "../components/GoogleReviews";
import cars from "../data/cars";
import { debugGoogleMapsAPI, checkAPIKeyRestrictions, suggestAPIKeyFixes } from "../utils/googleMapsDebug";

// Google Maps Component
const MapComponent = ({ center, zoom }) => {
  const ref = React.useRef(null);
  const mapRef = React.useRef(null);
  const markerRef = React.useRef(null);

  React.useEffect(() => {
    if (ref.current && window.google) {
      if (!mapRef.current) {
        mapRef.current = new window.google.maps.Map(ref.current, {
          center,
          zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          mapId: process.env.REACT_APP_GOOGLE_MAPS_ID || undefined, // Map ID required for advanced markers
        });
      } else {
        mapRef.current.setCenter(center);
        mapRef.current.setZoom(zoom);
      }

      // Remove old marker if it exists
      if (markerRef.current) {
        if (markerRef.current.setMap) {
          markerRef.current.setMap(null);
        } else if (markerRef.current.map) {
          markerRef.current.map = null;
        }
      }
      // Use AdvancedMarkerElement if available, else fallback to Marker
      if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
        markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
          position: center,
          map: mapRef.current,
          title: "Rams Motors - 2655 Lawrence Ave E unit m12, Scarborough, ON M1P 2S3",
        });
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: center,
          map: mapRef.current,
          title: "Rams Motors - 2655 Lawrence Ave E unit m12, Scarborough, ON M1P 2S3",
          animation: window.google.maps.Animation.DROP,
        });
      }
    }
  }, [center, zoom]);

  return <div ref={ref} className="w-full h-full" />;
};

// Fallback Map Component
const FallbackMap = () => (
  <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-600">
    <MapPin className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-semibold mb-2">Rams Motors</h3>
    <p className="text-center">
      2655 Lawrence Ave E unit m12
      <br />
      Scarborough, ON M1P 2S3
    </p>
    <a
      href="https://maps.google.com/?q=2655+Lawrence+Ave+E+unit+m12,+Scarborough,+ON+M1P+2S3"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
    >
      Open in Google Maps
    </a>
  </div>
);

const Home = () => {
  const center = { lat: 43.751454684487484, lng: -79.26328702204334 }; // Coordinates for the Scarborough address
  const zoom = 15;
  // 🚨 DEBUGGING: Check environment variables
  React.useEffect(() => {
    console.log('🔍 DEBUGGING: Environment Variables Check');
    console.log('REACT_APP_GOOGLE_MAPS_API_KEY:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'PRESENT' : 'MISSING');
    console.log('REACT_APP_GOOGLE_PLACES_API_KEY:', process.env.REACT_APP_GOOGLE_PLACES_API_KEY ? 'PRESENT' : 'MISSING');
    console.log('REACT_APP_GOOGLE_PLACE_ID:', process.env.REACT_APP_GOOGLE_PLACE_ID ? 'PRESENT' : 'MISSING');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('All process.env keys:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
    
    // Run Google Maps API diagnostics
    if (process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
      console.log('✅ Google Maps API key found, length:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY.length);
      console.log('API key starts with:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');
      
      checkAPIKeyRestrictions(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
      debugGoogleMapsAPI(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
        .then(result => {
          if (!result.success) {
            console.error('🗺️ Google Maps API test failed:', result.error);
            if (result.suggestions) {
              console.log('💡 Suggestions:', result.suggestions);
            }
            suggestAPIKeyFixes();
          }
        });
    } else {
      console.error('❌ Google Maps API key is missing!');
      suggestAPIKeyFixes();
    }
  }, []);

  const featuredCars = cars.slice(0, 3); // Show first 3 cars

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Guarantee",
      description: "All vehicles thoroughly inspected and certified",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Award Winning Service",
      description: "Recognized for excellence in customer satisfaction",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Team",
      description: "Experienced professionals ready to help you",
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Wide Selection",
      description: "Extensive inventory of quality pre-owned vehicles",
    },
  ];
  return (
    <>
      <Helmet>
        <title>Rams Motors - Quality Pre-Owned Vehicles in Scarborough, ON</title>
        <meta name="description" content="Your trusted car dealership in Scarborough. Quality pre-owned vehicles, exceptional service, competitive prices. Browse our inventory of certified used cars. Call (416) 123-4567." />
        <meta name="keywords" content="used cars Scarborough, pre-owned vehicles Toronto, car dealership Ontario, quality used cars, automotive financing, vehicle inspection, car sales Scarborough" />
        <link rel="canonical" href="https://ramsmotors.ca/" />
        <meta property="og:title" content="Rams Motors - Quality Pre-Owned Vehicles in Scarborough" />
        <meta property="og:description" content="Your trusted dealership in Scarborough. Quality vehicles, exceptional service, and competitive prices. Browse our inventory today!" />
        <meta property="og:url" content="https://ramsmotors.ca/" />
      </Helmet>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Rams Motors
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your trusted dealership in Scarborough - Quality cars, exceptional
              service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/inventory"
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Inventory
              </Link>
              <a
                href="tel:+14161234567"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rams Motors?
            </h2>
            <p className="text-lg text-gray-600">
              We're committed to providing you with the best car buying
              experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-lg shadow-lg"
              >
                <div className="text-red-600 flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Vehicles
            </h2>
            <p className="text-lg text-gray-600">
              Check out some of our top quality vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Car className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-2xl font-bold text-red-600 mb-2">
                    {car.price}
                  </p>
                  <p className="text-gray-600 mb-4">{car.description}</p>
                  <Link
                    to={`/vehicle/${car.id}`}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/inventory"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About Rams Motors
              </h2>
              <p className="text-lg mb-6 opacity-90">
                For over a decade, Rams Motors has been serving the Scarborough
                community with quality pre-owned vehicles and exceptional
                customer service. We believe in building lasting relationships
                with our customers by providing honest, transparent service and
                reliable vehicles.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">500+</div>
                  <div className="text-sm opacity-80">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">10+</div>
                  <div className="text-sm opacity-80">Years Experience</div>
                </div>
              </div>            </div>            
            <GoogleReviews />
          </div>
        </div>      </section>

      {/* Contact & Location */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visit Our Showroom
            </h2>
            <p className="text-lg text-gray-600">
              Come see our vehicles in person or contact us for more information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-gray-600">
                    2655 Lawrence Ave E unit m12
                    <br />
                    Scarborough, ON M1P 2S3
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">(416) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Hours</h3>
                  <div className="text-gray-600">
                    <p>Mon - Fri: 9:00 AM - 7:00 PM</p>
                    <p>Saturday: 9:00 AM - 6:00 PM</p>
                    <p>Sunday: 11:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="tel:+14161234567"
                  className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block"
                >
                  Call Now
                </a>
              </div>
            </div>            {/* Map */}
            <div className="h-96 rounded-lg overflow-hidden shadow-lg">
              {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? (
                <Wrapper
                  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                  version="weekly"
                  libraries={["places"]}
                  render={(status) => {
                    console.log('🗺️ Google Maps API Status:', status);
                    console.log('🔑 API Key (first 20 chars):', process.env.REACT_APP_GOOGLE_MAPS_API_KEY?.substring(0, 20));
                    
                    if (status === "LOADING") return (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                          <p className="text-gray-600">Loading Google Maps...</p>
                        </div>
                      </div>
                    );
                    
                    if (status === "FAILURE") {
                      console.error('❌ Google Maps failed to load - API key may be invalid or restricted');
                      console.error('💡 Please check:');
                      console.error('1. API key is valid and active');
                      console.error('2. Maps JavaScript API is enabled');
                      console.error('3. Billing is set up in Google Cloud Console');
                      console.error('4. API restrictions allow localhost and your domain');
                      return <FallbackMap />;
                    }
                    
                    return null;
                  }}
                >
                  <MapComponent center={center} zoom={zoom} />
                </Wrapper>
              ) : (
                <>
                  {console.log('⚠️ No Google Maps API key found - using fallback')}
                  <FallbackMap />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
