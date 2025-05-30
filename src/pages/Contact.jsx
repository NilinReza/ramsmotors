import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { Wrapper } from "@googlemaps/react-wrapper";
import apiService from '../services/api';

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
        });
      } else {
        mapRef.current.setCenter(center);
        mapRef.current.setZoom(zoom);
      }

      // Remove old marker if it exists
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      // Add marker for dealership location (revert to Marker)
      markerRef.current = new window.google.maps.Marker({
        position: center,
        map: mapRef.current,
        title: "Rams Motors - 2655 Lawrence Ave E unit m12, Scarborough, ON M1P 2S3",
        animation: window.google.maps.Animation.DROP,
      });
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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    vehicleInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const center = React.useMemo(() => ({ lat: 43.751454684487484, lng: -79.26328702204334 }), []); // Coordinates for the Scarborough address
  const zoom = 15;
  // Debug environment variables
  React.useEffect(() => {
    console.log('🔍 Contact Page Debug Info:');
    console.log('API Key Available:', !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    console.log('API Key (first 20 chars):', process.env.REACT_APP_GOOGLE_MAPS_API_KEY?.substring(0, 20));
    console.log('Center coordinates:', center);
    console.log('Zoom level:', zoom);
  }, [center, zoom]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Try to submit via API first
      try {
        const response = await apiService.submitContactForm({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          vehicleInterest: formData.vehicleInterest
        });

        if (response.success) {
          setIsSubmitted(true);
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            vehicleInterest: ''
          });
          return;
        }
      } catch (apiError) {
        console.log('API submission failed, falling back to mailto');
      }

      // Fallback to mailto if API fails
      const subject = encodeURIComponent(formData.subject || 'Contact Form Submission');
      const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Vehicle Interest: ${formData.vehicleInterest || 'N/A'}

Message:
${formData.message}
      `);

      const mailtoLink = `mailto:ramsmotorsinc@gmail.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        vehicleInterest: ''
      });

    } catch (err) {
      setError('There was an error submitting your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center bg-green-50 border border-green-200 rounded-lg p-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
          <p className="text-green-700 mb-6">
            Your message has been prepared and your email client should have opened. 
            If it didn't open automatically, please email us directly at ramsmotorsinc@gmail.com
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>Contact Us - Get in Touch | Rams Motors Scarborough</title>
        <meta name="description" content="Contact Rams Motors in Scarborough, ON. Get directions, hours, phone number and send us a message. We're here to help you find your perfect vehicle." />
        <meta name="keywords" content="contact Rams Motors, Scarborough dealership, car dealer contact, 2655 Lawrence Ave E, automotive contact form, vehicle inquiry" />
        <link rel="canonical" href="https://ramsmotors.ca/contact" />
        <meta property="og:title" content="Contact Us - Get in Touch | Rams Motors" />
        <meta property="og:description" content="Contact our team in Scarborough. We're here to help you find your perfect vehicle." />
        <meta property="og:url" content="https://ramsmotors.ca/contact" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          Get in touch with our team. We're here to help you find your perfect vehicle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          
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
              <Mail className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-gray-600">ramsmotorsinc@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Business Hours</h3>
                <div className="text-gray-600 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                  <p>Saturday: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: 11:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>          {/* Map */}
          <div className="mt-8 h-64 rounded-lg overflow-hidden shadow-lg">
            {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? (
              <>
                {console.log('🔑 Using Google Maps API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY?.substring(0, 10) + '...')}
                <Wrapper
                  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                  version="weekly"
                  libraries={["places"]}
                  render={(status) => {
                    console.log('🗺️ Google Maps API Status (Contact):', status);
                    
                    if (status === "LOADING") return (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                          <p className="text-gray-600 text-sm">Loading Google Maps...</p>
                        </div>
                      </div>
                    );
                    
                    if (status === "FAILURE") {
                      console.error('❌ Google Maps failed to load on Contact page');
                      console.error('💡 Check API key configuration in Google Cloud Console');
                      return <FallbackMap />;
                    }
                    
                    if (status === "SUCCESS") {
                      console.log('✅ Google Maps API loaded successfully!');
                    }
                    
                    return null;
                  }}
                >
                  <MapComponent center={center} zoom={zoom} />
                </Wrapper>
              </>
            ) : (
              <>
                {console.log('⚠️ No Google Maps API key found on Contact page - using fallback')}
                <FallbackMap />
              </>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="vehicleInterest" className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle of Interest
                </label>
                <input
                  type="text"
                  id="vehicleInterest"
                  name="vehicleInterest"
                  value={formData.vehicleInterest}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020 Honda Civic"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="What can we help you with?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Tell us more about what you're looking for..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>        </div>
      </div>
      </div>
    </>
  );
};

export default Contact;
