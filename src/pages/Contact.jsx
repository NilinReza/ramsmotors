import React, { useState, useEffect, useRef, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import googleMapsService from "../services/googleMapsService";

const Contact = () => {
  // Memoize coordinates to prevent useEffect re-runs
  const coordinates = useMemo(() => ({ 
    lat: 43.751454684487484, 
    lng: -79.26328702204334 
  }), []); // Rams Motors location

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null,  });
  const [mapError, setMapError] = useState(false);
  const mapContainerRef = useRef(null);
  useEffect(() => {
    let mapInstance = null;
    let listeners = [];

    const initMap = async () => {
      try {
        console.log('[Contact] Initializing Google Maps...');
        
        // Use the centralized Google Maps service
        const google = await googleMapsService.load();

        if (mapContainerRef.current && google.maps) {
          console.log('[Contact] Creating map instance...');
          
          // Create the map instance
          mapInstance = new google.maps.Map(mapContainerRef.current, {
            center: coordinates,
            zoom: 15,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          });

          // Store map event listeners for cleanup
          const clickListener = mapInstance.addListener('click', () => {
            console.log('[Contact] Map clicked');
          });
          listeners.push(clickListener);

          // Add marker
          try {
            // Try to use AdvancedMarkerElement first if available
            if (
              google.maps.marker &&
              google.maps.marker.AdvancedMarkerElement
            ) {
              new google.maps.marker.AdvancedMarkerElement({
                position: coordinates,
                map: mapInstance,
                title:
                  "Rams Motors - 2655 Lawrence Ave E unit m12, Scarborough, ON M1P 2S3",
              });
            } else {
              // Fall back to standard Marker
              new google.maps.Marker({
                position: coordinates,
                map: mapInstance,
                title:
                  "Rams Motors - 2655 Lawrence Ave E unit m12, Scarborough, ON M1P 2S3",
                animation: google.maps.Animation.DROP,
              });
            }
          } catch (markerError) {
            console.error("Error creating marker:", markerError);
            // Final fallback - use standard marker
            new google.maps.Marker({
              position: coordinates,
              map: mapInstance,
              title:
                "Rams Motors - 2655 Lawrence Ave E unit m12, Scarborough, ON M1P 2S3",
            });          }

          console.log('[Contact] Map initialized successfully');
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError(true);
      }
    };

    initMap();

    // Cleanup function to prevent memory leaks
    return () => {
      try {
        console.log('[Contact] Cleaning up map resources...');
        
        // Remove event listeners
        listeners.forEach(listener => {
          if (listener && listener.remove) {
            listener.remove();
          }
        });
        listeners = [];

        // Clear map instance
        if (mapInstance) {
          // Clear any map-specific listeners
          if (window.google && window.google.maps && window.google.maps.event) {
            window.google.maps.event.clearInstanceListeners(mapInstance);
          }
          
          mapInstance = null;        }

        console.log('[Contact] Map cleanup completed');
      } catch (cleanupError) {
        console.error('[Contact] Error during map cleanup:', cleanupError);
      }    };
  }, [coordinates]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      // In production, this would send data to your backend API
      console.log("Form submitted:", formState);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });
      setFormState({ name: "", email: "", phone: "", message: "" });

      // Reset form after 5 seconds
      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, isSubmitted: false }));
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: "Failed to submit form. Please try again later.",
      });
    }
  };

  // Fallback Map Component if Google Maps fails to load
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

  return (
    <>
      <Helmet>
        <title>Contact Us - Rams Motors</title>
        <meta
          name="description"
          content="Contact Rams Motors in Scarborough. Visit our dealership, call us at (416) 123-4567, or send us a message. We're here to help with all your automotive needs."
        />
      </Helmet>
      <Navbar />

      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Contact Us
            </h1>
            <p className="text-lg text-center max-w-3xl mx-auto">
              Have questions about a vehicle or our services? We're here to
              help. Reach out to our team and we'll get back to you promptly.
            </p>
          </div>
        </div>

        {/* Contact Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
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
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-gray-600">
                      <a
                        href="tel:+14161234567"
                        className="hover:text-red-600 transition-colors"
                      >
                        (416) 123-4567
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-gray-600">
                      <a
                        href="mailto:info@ramsmotors.com"
                        className="hover:text-red-600 transition-colors"
                      >
                        info@ramsmotors.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Hours of Operation</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 9:00 AM - 6:00 PM</p>
                      <p>Sunday: 11:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden shadow-md mt-8">
                {mapError ? (
                  <FallbackMap />
                ) : (
                  <div
                    ref={mapContainerRef}
                    className="w-full h-full"
                    key="contact-map-container"
                  />
                )}
              </div>

              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-1" /> Get Directions
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

              {formStatus.isSubmitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                  <strong className="font-bold">Thank you!</strong>
                  <p>
                    Your message has been sent successfully. We'll get back to
                    you soon.
                  </p>
                </div>
              ) : null}

              {formStatus.error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                  <strong className="font-bold">Error:</strong>
                  <p>{formStatus.error}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formState.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={formStatus.isSubmitting}
                    className={`px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
                      formStatus.isSubmitting
                        ? "opacity-75 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {formStatus.isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
