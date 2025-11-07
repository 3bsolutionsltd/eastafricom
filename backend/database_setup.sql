-- East Africom CMS Database Setup
-- Run this SQL script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS eastafricom_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eastafricom_cms;

-- Products table for dynamic product management
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    grade VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    category ENUM('coffee', 'cocoa') DEFAULT 'coffee',
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_active (active),
    INDEX idx_category (category),
    INDEX idx_featured (featured)
);

-- Testimonials table for dynamic social proof
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    content TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    order_size VARCHAR(100),
    country VARCHAR(100),
    image_url VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_active (active),
    INDEX idx_featured (featured),
    INDEX idx_display_order (display_order)
);

-- Live activity table for real-time social proof
CREATE TABLE IF NOT EXISTS live_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    amount VARCHAR(100),
    product_name VARCHAR(255),
    client_name VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    auto_generated BOOLEAN DEFAULT FALSE,
    
    INDEX idx_active (active),
    INDEX idx_timestamp (timestamp)
);

-- Site settings table for dynamic configuration
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category)
);

-- Content sections table for dynamic page content
CREATE TABLE IF NOT EXISTS content_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500),
    content TEXT,
    section_type ENUM('hero', 'about', 'services', 'contact') DEFAULT 'general',
    active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_section_type (section_type),
    INDEX idx_active (active)
);

-- Insert sample products
INSERT INTO products (name, price, stock_quantity, grade, description, category, featured) VALUES
('Premium Arabica AA', 4.50, 847, 'Grade AA', 'Premium quality Arabica coffee beans sourced from the highlands of Uganda. Perfect balance of acidity and body.', 'coffee', TRUE),
('Arabica AB Grade', 4.00, 623, 'Grade AB', 'High quality Arabica coffee beans with excellent cup profile. Ideal for specialty coffee roasters.', 'coffee', TRUE),
('Superior Robusta Grade 1', 2.80, 445, 'Grade 1', 'Superior Robusta coffee beans with low defect count. Perfect for espresso blends.', 'coffee', FALSE),
('Premium Cocoa Beans', 3.20, 298, 'Grade A', 'High-quality cocoa beans with rich chocolate flavor profile. Perfect for premium chocolate production.', 'cocoa', TRUE),
('Organic Arabica', 5.00, 156, 'Organic AA', 'Certified organic Arabica coffee beans. Sustainably grown without chemical fertilizers.', 'coffee', FALSE);

-- Insert sample testimonials
INSERT INTO testimonials (client_name, company, content, rating, order_size, country, featured, display_order) VALUES
('John Smith', 'Coffee Imports LLC', 'EastAfricom has been our trusted partner for over 5 years. Their quality consistency is unmatched, and we have never received a single defective batch. Highly recommended!', 5, '1,200 MT', 'Germany', TRUE, 1),
('Maria Rodriguez', 'European Coffee Co.', 'Outstanding service and exceptional quality. Our customers consistently praise the taste and aroma of coffees sourced through EastAfricom. The team is professional and reliable.', 5, '800 MT', 'Spain', TRUE, 2),
('Ahmed Hassan', 'Middle East Trading', 'Excellent quality coffee beans and timely deliveries. EastAfricom understands our market needs and consistently delivers premium products at competitive prices.', 5, '950 MT', 'UAE', TRUE, 3),
('Sarah Johnson', 'Specialty Roasters Inc.', 'The Arabica AA grade from EastAfricom is exceptional. Perfect for our specialty coffee line. Great communication and smooth logistics every time.', 5, '450 MT', 'USA', FALSE, 4),
('Pierre Dubois', 'French Coffee House', 'Consistent quality and excellent customer service. EastAfricom has helped us maintain our reputation for serving the finest coffee in France.', 5, '600 MT', 'France', FALSE, 5);

-- Insert sample live activity (recent orders/inquiries)
INSERT INTO live_activity (action_type, location, amount, product_name, client_name, timestamp, auto_generated) VALUES
('New Order Placed', 'Germany', '250 MT', 'Premium Arabica AA', 'Munich Coffee Roasters', NOW() - INTERVAL 5 MINUTE, FALSE),
('Quote Requested', 'Netherlands', '180 MT', 'Arabica AB Grade', 'Amsterdam Trading Co.', NOW() - INTERVAL 12 MINUTE, FALSE),
('Sample Approved', 'USA', '500 MT', 'Superior Robusta Grade 1', 'New York Imports', NOW() - INTERVAL 18 MINUTE, FALSE),
('Contract Signed', 'Italy', '320 MT', 'Premium Cocoa Beans', 'Milano Chocolate Ltd.', NOW() - INTERVAL 25 MINUTE, FALSE),
('Shipment Delivered', 'Spain', '400 MT', 'Premium Arabica AA', 'Barcelona Coffee Co.', NOW() - INTERVAL 35 MINUTE, FALSE),
('New Inquiry', 'France', '150 MT', 'Organic Arabica', 'Paris Specialty Coffee', NOW() - INTERVAL 42 MINUTE, FALSE);

-- Insert site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, category) VALUES
('contact_phone', '+256 776 701 003', 'text', 'Primary contact phone number', 'contact'),
('contact_email', 'frank.asiimwe@eastafricom.com', 'text', 'Primary contact email address', 'contact'),
('whatsapp_number', '256776701003', 'text', 'WhatsApp contact number (without +)', 'contact'),
('company_address', 'Mulago-Kampala, Uganda', 'text', 'Company headquarters address', 'contact'),
('business_hours', '8:00 AM - 6:00 PM EAT', 'text', 'Business operating hours', 'contact'),
('company_name', 'East Africom Limited', 'text', 'Official company name', 'general'),
('tagline', 'Premium Coffee & Cocoa Exports from East Africa', 'text', 'Company tagline', 'general'),
('min_order_quantity', '100', 'number', 'Minimum order quantity in MT', 'business'),
('shipping_lead_time', '14-21', 'text', 'Shipping lead time in days', 'business'),
('currency', 'USD', 'text', 'Primary currency for pricing', 'business'),
('show_live_activity', 'true', 'boolean', 'Show live activity widget', 'features'),
('show_trust_badges', 'true', 'boolean', 'Show trust and credibility badges', 'features'),
('auto_refresh_interval', '30', 'number', 'Auto refresh interval in seconds', 'technical');

-- Insert content sections
INSERT INTO content_sections (section_key, title, content, section_type) VALUES
('hero_headline', 'Premium Coffee & Cocoa Direct from East Africa', 'Get premium quality coffee and cocoa beans directly from East African farms. Competitive prices, reliable supply, and exceptional quality guaranteed.', 'hero'),
('hero_subtext', 'Trusted by 200+ International Buyers', 'Join coffee roasters and chocolate manufacturers worldwide who trust EastAfricom for consistent quality and reliable supply chains.', 'hero'),
('about_intro', 'About East Africom', 'East Africom Limited is a leading exporter of premium coffee and cocoa from East Africa. With over a decade of experience, we connect international buyers with the finest beans from carefully selected farms.', 'about'),
('quality_commitment', 'Our Quality Promise', 'Every batch is carefully selected, processed, and quality-tested to meet international standards. We guarantee consistent quality and reliable supply for your business needs.', 'about');

-- Create indexes for better performance
CREATE INDEX idx_products_category_active ON products(category, active);
CREATE INDEX idx_testimonials_featured_active ON testimonials(featured, active);
CREATE INDEX idx_live_activity_timestamp_active ON live_activity(timestamp, active);
CREATE INDEX idx_settings_category ON site_settings(category);

-- Show tables created
SHOW TABLES;