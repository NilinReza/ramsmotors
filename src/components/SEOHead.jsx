import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = "Rams Motors - Quality Pre-Owned Vehicles in Scarborough, ON",
  description = "Your trusted car dealership in Scarborough. Quality pre-owned vehicles, exceptional service, competitive prices. Browse our inventory of certified used cars.",
  keywords = "used cars Scarborough, pre-owned vehicles Toronto, car dealership Ontario, quality used cars, automotive financing",
  url = "https://ramsmotors.ca",
  image = "https://ramsmotors.ca/og-image.jpg",
  type = "website"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:site_name" content="Rams Motors" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Rams Motors" />
      <meta name="language" content="English" />
    </Helmet>
  );
};

export default SEOHead;
