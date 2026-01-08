-- Add missing columns to products table
-- Run this on staging/production database if these columns don't exist

-- Add defect_free column (for quality badge)
ALTER TABLE `products` 
ADD COLUMN `defect_free` tinyint(1) DEFAULT 1 AFTER `featured`;

-- Add organic column (for organic certification badge)
ALTER TABLE `products` 
ADD COLUMN `organic` tinyint(1) DEFAULT 1 AFTER `defect_free`;

-- Update existing products to have these flags set to true
UPDATE `products` SET `defect_free` = 1, `organic` = 1 WHERE `defect_free` IS NULL;

SELECT 'Product columns added successfully!' as status;
