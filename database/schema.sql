-- Rams Motors Database Schema
-- Run this script in MySQL Workbench or MySQL Command Line

CREATE DATABASE IF NOT EXISTS rams_motors;
USE rams_motors;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    vin VARCHAR(17) PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    mileage INT NOT NULL, -- in kilometers
    transmission ENUM('Manual', 'Automatic', 'CVT') NOT NULL,
    engine VARCHAR(50) NOT NULL, -- e.g., '4-Cylinder', '6-Cylinder', 'V8'
    body_style VARCHAR(30) NOT NULL, -- e.g., 'Sedan', 'SUV', 'Hatchback'
    fuel_type ENUM('Gasoline', 'Diesel', 'Hybrid', 'Electric') NOT NULL,
    color VARCHAR(30) NOT NULL,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_make (make),
    INDEX idx_model (model),
    INDEX idx_year (year),
    INDEX idx_price (price),
    INDEX idx_mileage (mileage),
    INDEX idx_available (is_available)
);

-- Vehicle Images Table
CREATE TABLE IF NOT EXISTS vehicle_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_vin VARCHAR(17) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_vin) REFERENCES vehicles(vin) ON DELETE CASCADE,
    INDEX idx_vehicle_vin (vehicle_vin),
    INDEX idx_order (image_order)
);

-- Vehicle Videos Table
CREATE TABLE IF NOT EXISTS vehicle_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_vin VARCHAR(17) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    video_title VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_vin) REFERENCES vehicles(vin) ON DELETE CASCADE,
    INDEX idx_vehicle_vin (vehicle_vin)
);

-- Insert default admin user (password: admin123 - change this!)
INSERT INTO admin_users (username, email, password_hash) 
VALUES ('admin', 'admin@ramsmotors.ca', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdj6MjqSEXpuO');

-- Insert sample vehicles
INSERT INTO vehicles (vin, make, model, year, price, mileage, transmission, engine, body_style, fuel_type, color, description, is_featured) VALUES
('1HGCM82633A123456', 'Toyota', 'Camry', 2020, 18500.00, 45000, 'Automatic', '4-Cylinder', 'Sedan', 'Gasoline', 'Silver', 'Reliable midsize sedan with excellent fuel economy.', TRUE),
('JH4DB8590SS123457', 'Honda', 'Civic', 2019, 15800.00, 52000, 'Manual', '4-Cylinder', 'Sedan', 'Gasoline', 'Blue', 'Compact car with sporty design and great value.', TRUE),
('1FMCU0GX8KUA12345', 'Ford', 'Escape', 2021, 22000.00, 38000, 'Automatic', '4-Cylinder', 'SUV', 'Gasoline', 'Red', 'Compact SUV perfect for families.', FALSE),
('WBA3A5C59DF123458', 'BMW', '320i', 2018, 24500.00, 61000, 'Automatic', '4-Cylinder', 'Sedan', 'Gasoline', 'Black', 'Luxury sedan with premium features.', TRUE),
('JTDKN3DU8D0123459', 'Toyota', 'Prius', 2019, 17200.00, 42000, 'CVT', 'Hybrid', 'Hatchback', 'Hybrid', 'White', 'Eco-friendly hybrid with excellent gas mileage.', FALSE);

-- Insert sample images for vehicles
INSERT INTO vehicle_images (vehicle_vin, image_url, image_order, is_primary) VALUES
('1HGCM82633A123456', '/images/camry_front.jpg', 1, TRUE),
('1HGCM82633A123456', '/images/camry_side.jpg', 2, FALSE),
('1HGCM82633A123456', '/images/camry_interior.jpg', 3, FALSE),
('JH4DB8590SS123457', '/images/civic_front.jpg', 1, TRUE),
('JH4DB8590SS123457', '/images/civic_side.jpg', 2, FALSE),
('1FMCU0GX8KUA12345', '/images/escape_front.jpg', 1, TRUE),
('WBA3A5C59DF123458', '/images/bmw_front.jpg', 1, TRUE),
('JTDKN3DU8D0123459', '/images/prius_front.jpg', 1, TRUE);
