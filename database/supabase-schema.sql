-- Supabase Database Schema for RamsMotors Multi-Tenant Architecture
-- Run these commands in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-key';

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dealer_id VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dealer_id VARCHAR(50) NOT NULL,
    vin VARCHAR(17) UNIQUE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(10,2),
    mileage INTEGER,
    transmission VARCHAR(20),
    fuel_type VARCHAR(20),
    body_style VARCHAR(30),
    exterior_color VARCHAR(30),
    interior_color VARCHAR(30),
    engine VARCHAR(100),
    drivetrain VARCHAR(20),
    description TEXT,
    features TEXT[],
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicle_images table
CREATE TABLE IF NOT EXISTS public.vehicle_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    public_id VARCHAR(255) NOT NULL, -- Cloudinary public_id
    is_primary BOOLEAN DEFAULT false,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicle_videos table
CREATE TABLE IF NOT EXISTS public.vehicle_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    public_id VARCHAR(255) NOT NULL, -- Cloudinary public_id
    title VARCHAR(255),
    description TEXT,
    duration INTEGER, -- in seconds
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create google_reviews_cache table
CREATE TABLE IF NOT EXISTS public.google_reviews_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    place_id VARCHAR(255) NOT NULL UNIQUE,
    reviews_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_dealer_id ON public.vehicles(dealer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON public.vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON public.vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON public.vehicles(is_available);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON public.vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_videos_vehicle_id ON public.vehicle_videos(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_dealer_id ON public.admin_users(dealer_id);
CREATE INDEX IF NOT EXISTS idx_google_reviews_place_id ON public.google_reviews_cache(place_id);
CREATE INDEX IF NOT EXISTS idx_google_reviews_updated_at ON public.google_reviews_cache(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_reviews_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for multi-tenant security

-- Admin users can only access their own dealer's data
CREATE POLICY "Admin users can only access their dealer data" ON public.admin_users
    FOR ALL USING (
        dealer_id = COALESCE(
            current_setting('app.current_dealer_id', true),
            (auth.jwt() ->> 'dealer_id')
        )
    );

-- Vehicles policies
CREATE POLICY "Users can view vehicles for their dealer" ON public.vehicles
    FOR SELECT USING (
        dealer_id = COALESCE(
            current_setting('app.current_dealer_id', true),
            (auth.jwt() ->> 'dealer_id')
        )
    );

CREATE POLICY "Authenticated users can manage vehicles for their dealer" ON public.vehicles
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        dealer_id = COALESCE(
            current_setting('app.current_dealer_id', true),
            (auth.jwt() ->> 'dealer_id')
        )
    );

-- Vehicle images policies
CREATE POLICY "Users can view images for their dealer's vehicles" ON public.vehicle_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vehicles v 
            WHERE v.id = vehicle_id 
            AND v.dealer_id = COALESCE(
                current_setting('app.current_dealer_id', true),
                (auth.jwt() ->> 'dealer_id')
            )
        )
    );

CREATE POLICY "Authenticated users can manage images for their dealer's vehicles" ON public.vehicle_images
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.vehicles v 
            WHERE v.id = vehicle_id 
            AND v.dealer_id = COALESCE(
                current_setting('app.current_dealer_id', true),
                (auth.jwt() ->> 'dealer_id')
            )
        )
    );

-- Vehicle videos policies
CREATE POLICY "Users can view videos for their dealer's vehicles" ON public.vehicle_videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vehicles v 
            WHERE v.id = vehicle_id 
            AND v.dealer_id = COALESCE(
                current_setting('app.current_dealer_id', true),
                (auth.jwt() ->> 'dealer_id')
            )
        )
    );

CREATE POLICY "Authenticated users can manage videos for their dealer's vehicles" ON public.vehicle_videos
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.vehicles v 
            WHERE v.id = vehicle_id 
            AND v.dealer_id = COALESCE(
                current_setting('app.current_dealer_id', true),
                (auth.jwt() ->> 'dealer_id')
            )
        )
    );

-- Google Reviews cache policies
CREATE POLICY "Users can view their dealer's Google Reviews cache" ON public.google_reviews_cache
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vehicles v 
            WHERE v.dealer_id = COALESCE(
                current_setting('app.current_dealer_id', true),
                (auth.jwt() ->> 'dealer_id')
            )
        )
    );

CREATE POLICY "Authenticated users can manage their dealer's Google Reviews cache" ON public.google_reviews_cache
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.vehicles v 
            WHERE v.dealer_id = COALESCE(
                current_setting('app.current_dealer_id', true),
                (auth.jwt() ->> 'dealer_id')
            )
        )
    );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data for RamsMotors
INSERT INTO public.admin_users (dealer_id, email, password_hash, first_name, last_name) VALUES
('ramsmotors', 'admin@ramsmotors.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample vehicles for RamsMotors
INSERT INTO public.vehicles (
    dealer_id, vin, make, model, year, price, mileage, transmission, 
    fuel_type, body_style, exterior_color, interior_color, engine, 
    drivetrain, description, features, is_available, is_featured
) VALUES 
(
    'ramsmotors', 
    '1HGBH41JXMN109186', 
    'Honda', 
    'Civic', 
    2022, 
    25999.99, 
    15000, 
    'CVT', 
    'Gasoline', 
    'Sedan', 
    'Silver', 
    'Black', 
    '2.0L 4-Cylinder', 
    'FWD',
    'Excellent condition Honda Civic with low mileage. Perfect for daily commuting.',
    ARRAY['Backup Camera', 'Bluetooth', 'Apple CarPlay', 'Honda Sensing'],
    true,
    true
),
(
    'ramsmotors', 
    '1FTEW1EP5HFC10312', 
    'Ford', 
    'F-150', 
    2023, 
    45999.99, 
    8000, 
    'Automatic', 
    'Gasoline', 
    'Pickup Truck', 
    'Blue', 
    'Gray', 
    '5.0L V8', 
    '4WD',
    'Powerful Ford F-150 truck, perfect for work and adventure.',
    ARRAY['4WD', 'Towing Package', 'Bed Liner', 'Navigation'],
    true,
    false
)
ON CONFLICT (vin) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
