-- East Africom CMS Database Tables Setup
-- Run this script to create all necessary tables for the admin panel

-- Slideshow Slides Table
CREATE TABLE IF NOT EXISTS `slideshow_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chapter` varchar(100) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_zh` varchar(255) NOT NULL,
  `subtitle_en` text NOT NULL,
  `subtitle_zh` text NOT NULL,
  `image_url` varchar(500) DEFAULT 'images/coffee_bag_beans.jpg',
  `button_text_en` varchar(100) DEFAULT 'Learn More',
  `button_text_zh` varchar(100) DEFAULT '了解更多',
  `button_link` varchar(500) DEFAULT '#',
  `position` int(11) DEFAULT 1,
  `autoplay_duration` int(11) DEFAULT 6000,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `position` (`position`),
  KEY `active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Testimonials Table
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

-- Awards Table
CREATE TABLE IF NOT EXISTS `awards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `year` int(4) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT 'fa-trophy',
  `image_url` varchar(500) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `year` (`year`),
  KEY `active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Settings Table
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL UNIQUE,
  `setting_value` text DEFAULT NULL,
  `setting_type` varchar(50) DEFAULT 'text',
  `description` varchar(500) DEFAULT NULL,
  `category` varchar(100) DEFAULT 'general',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Live Activity Table
CREATE TABLE IF NOT EXISTS `live_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_type` varchar(100) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `timestamp` (`timestamp`),
  KEY `active` (`active`),
  KEY `activity_type` (`activity_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default slideshow slides (if table is empty)
INSERT IGNORE INTO `slideshow_slides` (`id`, `chapter`, `title_en`, `title_zh`, `subtitle_en`, `subtitle_zh`, `image_url`, `button_text_en`, `button_text_zh`, `button_link`, `position`, `autoplay_duration`, `active`) VALUES
(1, 'Chapter 1', 'Sourcing Excellence', '卓越采购', 'Direct partnerships with highland farmers ensuring premium quality', '与高原农民直接合作，确保优质品质', 'images/coffee_bag_beans.jpg', 'Learn More', '了解更多', '#about', 1, 6000, 1),
(2, 'Chapter 2', 'Quality Processing', '优质加工', 'State-of-the-art processing facilities with international standards', '具有国际标准的最先进加工设施', 'images/top-view-coffee-cup-coffee-beans-dark-table-scaled.jpg', 'View Process', '查看流程', '#products', 2, 6000, 1),
(3, 'Chapter 3', 'Global Export', '全球出口', 'Reliable supply chain delivering to 20+ countries worldwide', '可靠的供应链，向全球20多个国家交付', 'images/coffee_bag_beans.jpeg', 'Contact Us', '联系我们', '#contact', 3, 6000, 1);

-- Success message
SELECT 'Database tables created successfully!' as status;
