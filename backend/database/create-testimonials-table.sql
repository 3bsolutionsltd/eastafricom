-- Create Testimonials Table
-- This table is missing from your database

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `rating` int(1) DEFAULT 5,
  `order_size` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `featured` (`featured`),
  KEY `active` (`active`),
  KEY `display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample testimonials
INSERT INTO `testimonials` (`client_name`, `company`, `content`, `rating`, `order_size`, `country`, `featured`, `display_order`, `active`) VALUES
('John Smith', 'Premium Coffee Roasters', 'Outstanding quality coffee beans! The consistency and flavor profile are exceptional. Our customers love the rich taste.', 5, '500kg', 'United States', 1, 1, 1),
('Li Wei', '北京咖啡进口公司', '优质的咖啡豆，稳定的供应链。我们与East Africom合作三年了，非常满意。', 5, '1000kg', 'China', 1, 2, 1),
('Sarah Johnson', 'Global Traders Ltd', 'Reliable partner for our cocoa needs. Fast shipping and excellent customer service.', 5, '750kg', 'United Kingdom', 1, 3, 1);

SELECT 'Testimonials table created successfully!' as status;
