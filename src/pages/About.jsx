import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Car, Users, Award, MapPin } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Rams Motors | Quality Used Cars in Scarborough</title>
        <meta name="description" content="Learn about Rams Motors, your trusted used car dealer in Scarborough, ON. Quality vehicles, honest service, and customer satisfaction since day one." />
        <meta name="keywords" content="about Rams Motors, Scarborough car dealer, used car dealership, automotive history, customer service" />
        <link rel="canonical" href="https://ramsmotors.ca/about" />
        <meta property="og:title" content="About Us - Rams Motors" />
        <meta property="og:description" content="Quality vehicles, honest service, and customer satisfaction in Scarborough, ON." />
        <meta property="og:url" content="https://ramsmotors.ca/about" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Rams Motors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in finding quality used vehicles in Scarborough, Ontario. 
            We're committed to providing honest service and exceptional value to every customer.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Car className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Vehicles Sold</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">300+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Award className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">5 Years</h3>
            <p className="text-gray-600">In Business</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded with a simple mission: to provide quality used vehicles and honest, 
                transparent service to the Scarborough community. At Rams Motors, we believe 
                that buying a car should be an exciting experience, not a stressful one.
              </p>
              <p>
                Our team has years of experience in the automotive industry, and we use that 
                knowledge to carefully select each vehicle in our inventory. Every car goes 
                through a thorough inspection process to ensure it meets our high standards 
                for quality and reliability.
              </p>
              <p>
                Located in the heart of Scarborough, we're proud to serve customers throughout 
                the Greater Toronto Area. We're not just a car dealership – we're your 
                neighbors, committed to building lasting relationships with every customer 
                who walks through our doors.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quality Guaranteed</h3>
                  <p className="text-gray-600">Every vehicle is thoroughly inspected and comes with our quality guarantee.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Transparent Pricing</h3>
                  <p className="text-gray-600">No hidden fees, no surprises. Our prices are fair and clearly displayed.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Customer First</h3>
                  <p className="text-gray-600">Your satisfaction is our priority. We're here to help every step of the way.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Local Expertise</h3>
                  <p className="text-gray-600">We know the local market and can help you find exactly what you need.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="text-center bg-gray-50 rounded-lg p-8">
          <MapPin className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Visit Our Showroom</h2>
          <p className="text-gray-600 mb-4">
            Come see our selection of quality used vehicles in person. We're conveniently 
            located in Scarborough with easy access from anywhere in the GTA.
          </p>
          <div className="text-lg font-semibold text-gray-900">
            2655 Lawrence Ave E unit m12, Scarborough, ON M1P 2S3
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
