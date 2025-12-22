-- Contact Information Table
-- Stores company contact details and address information

CREATE TABLE IF NOT EXISTS contact_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    street_address VARCHAR(255) DEFAULT 'Mulago - Kampala',
    po_box VARCHAR(100) DEFAULT '421481 - Mbarara',
    city VARCHAR(100) DEFAULT 'Kampala',
    country VARCHAR(100) DEFAULT 'UGANDA',
    primary_phone VARCHAR(20) DEFAULT '+256 776 701 003',
    secondary_phone VARCHAR(20) DEFAULT '+256 754 701 003',
    whatsapp_phone VARCHAR(20) DEFAULT '+256 776 701 003',
    primary_email VARCHAR(255) DEFAULT 'frank.asiimwe@eastafricom.com',
    secondary_email VARCHAR(255),
    facebook_link VARCHAR(255),
    twitter_link VARCHAR(255),
    linkedin_link VARCHAR(255),
    instagram_link VARCHAR(255),
    years_experience VARCHAR(50) DEFAULT '5yrs+',
    export_tonnage VARCHAR(50) DEFAULT '200+ tons',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default contact information
INSERT INTO contact_info (
    street_address, po_box, city, country,
    primary_phone, secondary_phone, whatsapp_phone,
    primary_email, years_experience, export_tonnage
) VALUES (
    'Mulago - Kampala',
    '421481 - Mbarara',
    'Kampala',
    'UGANDA',
    '+256 776 701 003',
    '+256 754 701 003',
    '+256 776 701 003',
    'frank.asiimwe@eastafricom.com',
    '5yrs+',
    '200+ tons'
) ON DUPLICATE KEY UPDATE id=id;

-- Add image columns to products table (ignore errors if columns already exist)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'image_url');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN image_url VARCHAR(500) DEFAULT NULL AFTER description',
    'SELECT "Column image_url already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'image_thumbnail');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN image_thumbnail VARCHAR(500) DEFAULT NULL AFTER image_url',
    'SELECT "Column image_thumbnail already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
