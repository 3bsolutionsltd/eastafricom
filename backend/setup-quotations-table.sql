-- Quotation Requests Table for East Africom CMS
-- Add this to your database

USE eastafricom_cms;

-- Create quotation_requests table
CREATE TABLE IF NOT EXISTS quotation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(255) NOT NULL,
    product_id VARCHAR(100),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg', -- kg, lbs, MT, tons
    shipping VARCHAR(50) DEFAULT 'FOB',
    certifications TEXT,
    company VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    requirements TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'quoted', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    email_sent BOOLEAN DEFAULT FALSE,
    notes TEXT, -- Admin notes
    quoted_price DECIMAL(10,2), -- Final quoted price
    quote_sent_date TIMESTAMP NULL,
    
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_timestamp (timestamp),
    INDEX idx_company (company)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
