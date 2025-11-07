-- Uganda Coffee Varieties Database Population
-- Comprehensive list of coffee varieties found in Uganda

USE eastafricom_cms;

-- Clear existing products to replace with comprehensive Uganda varieties
DELETE FROM products WHERE 1=1;

-- Reset auto increment
ALTER TABLE products AUTO_INCREMENT = 1;

-- ARABICA VARIETIES FOUND IN UGANDA
-- Uganda is known for high-quality Arabica from regions like Mt. Elgon, Rwenzori Mountains, and Lake Victoria

-- 1. BUGISU ARABICA (Mt. Elgon Region)
INSERT INTO products (name, price, stock_quantity, grade, description, category, featured, image_url) VALUES
('Bugisu Arabica AA', 4800.00, 850, 'Grade AA', 'Premium Bugisu Arabica from Mt. Elgon slopes. Screen size 18+, altitude 1600-2200m. Known for bright acidity, wine-like notes, and exceptional cup quality. Fully washed process.', 'coffee', TRUE, 'images/coffee_bag_beans.jpeg'),

('Bugisu Arabica AB', 4500.00, 1200, 'Grade AB', 'High-quality Bugisu Arabica, screen size 15-17. Grown on volcanic soils of Mt. Elgon. Medium body with citrus notes and clean finish. Ideal for specialty coffee market.', 'coffee', TRUE, 'images/coffee_bag_beans.jpeg'),

('Bugisu Arabica PB (Peaberry)', 5200.00, 320, 'Peaberry', 'Rare Bugisu Peaberry coffee from Mt. Elgon. Single rounded bean with concentrated flavors. Exceptional cup profile with wine-like acidity and floral notes.', 'coffee', TRUE, 'images/coffee_bag_beans.jpeg'),

-- 2. RWENZORI ARABICA (Rwenzori Mountains)
('Rwenzori Arabica AA', 4600.00, 650, 'Grade AA', 'Premium Rwenzori Arabica from the Mountains of the Moon. Altitude 1800-2300m. Full body with chocolate undertones and low acidity. Fully washed process.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

('Rwenzori Arabica Natural', 4700.00, 450, 'Grade A Natural', 'Sun-dried Rwenzori Arabica with fruity, wine-like characteristics. Natural process enhances sweetness and body. Grown at high altitudes in Kasese district.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 3. LAKE VICTORIA ARABICA
('Victoria Arabica Washed', 4200.00, 980, 'Grade A', 'Lake Victoria region Arabica, fully washed. Balanced cup with medium body and bright acidity. Grown at 1400-1800m altitude with consistent rainfall patterns.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 4. SIPI FALLS ARABICA (Eastern Uganda)
('Sipi Falls Arabica AA', 4900.00, 420, 'Grade AA', 'Exclusive Sipi Falls Arabica from eastern Uganda highlands. Grown near the famous waterfalls at 1600-2000m. Exceptional cup with floral notes and bright acidity.', 'coffee', TRUE, 'images/coffee_bag_beans.jpeg'),

-- 5. KAPCHORWA ARABICA (Mt. Elgon Foothills)
('Kapchorwa Arabica Honey Process', 5000.00, 280, 'Honey Process', 'Specialty Kapchorwa Arabica with honey processing. Semi-washed method creates unique sweetness and body. Limited production from small-holder farmers.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- ROBUSTA VARIETIES - Uganda is the largest Robusta producer in Africa
-- Robusta grows well in lower altitudes (500-1200m) and accounts for 80% of Uganda''s coffee production

-- 6. NGANDA ROBUSTA (Central Uganda)
('Nganda Robusta Grade 1', 2850.00, 2500, 'Grade 1', 'Premium Nganda Robusta from central Uganda. Screen size 18+, low defect count. High caffeine content, full body, perfect for espresso blends. Grown at 800-1200m.', 'coffee', TRUE, 'images/coffee_bag_beans.jpeg'),

('Nganda Robusta Grade 2', 2650.00, 1800, 'Grade 2', 'Quality Nganda Robusta, screen size 16-17. Consistent flavor profile with earthy notes and good crema potential. Ideal for commercial coffee blends.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 7. MUKONO ROBUSTA (Central Region)
('Mukono Robusta Screen 18', 2900.00, 1600, 'Screen 18+', 'Large bean Mukono Robusta from fertile soils near Lake Victoria. Excellent for espresso with strong body and low acidity. Washed process for clean cup.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 8. MASAKA ROBUSTA (Southern Uganda)
('Masaka Robusta Natural', 2750.00, 2200, 'Natural Process', 'Sun-dried Masaka Robusta with enhanced body and earthy characteristics. Traditional processing method adds complexity. Perfect for dark roast profiles.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 9. LUWERO ROBUSTA (Central Uganda)
('Luwero Robusta Washed', 2800.00, 1900, 'Washed Grade 1', 'Fully washed Luwero Robusta with clean cup profile. Grown in red soil conditions optimal for Robusta. High yield variety with consistent quality.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 10. BUNDIBUGYO ROBUSTA (Western Uganda)
('Bundibugyo Robusta Organic', 3200.00, 850, 'Organic Certified', 'Certified organic Bundibugyo Robusta from western Uganda forests. Shade-grown under indigenous trees. UTZ and Organic certified for premium markets.', 'coffee', TRUE, 'images/coffee_bag_beans.jpeg'),

-- SPECIALTY AND EXPERIMENTAL VARIETIES

-- 11. SL14 ARABICA (Research Variety)
('SL14 Arabica Experimental', 5500.00, 180, 'Experimental', 'Scott Labs 14 variety Arabica adapted to Ugandan conditions. Rust-resistant with excellent cup quality. Limited availability from research stations and progressive farmers.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 12. SL28 ARABICA (High-quality Variety)
('SL28 Arabica Premium', 5800.00, 150, 'Premium SL28', 'Scott Labs 28 variety known for exceptional cup quality. Wine-like acidity with complex flavor profile. Grown in select high-altitude locations in Uganda.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 13. CATIMOR ARABICA (Hybrid Variety)
('Catimor Arabica Hybrid', 4300.00, 380, 'Hybrid Variety', 'Catimor hybrid Arabica combining disease resistance with good cup quality. Medium body with chocolate notes. Suitable for sustainable farming practices.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- REGIONAL BLENDS AND COMMERCIAL GRADES

-- 14. UGANDA COMMERCIAL BLEND
('Uganda Commercial Blend', 3500.00, 3000, 'Commercial Grade', 'Blend of Uganda Arabica and Robusta for commercial market. Balanced profile suitable for instant coffee and retail blends. Consistent quality and competitive pricing.', 'coffee', TRUE, 'images/coffee_bag_beans.jpeg'),

-- 15. FAIR TRADE CERTIFIED VARIETIES
('Fair Trade Uganda Arabica', 4800.00, 680, 'Fair Trade AA', 'Fair Trade certified Uganda Arabica supporting smallholder farmers. Premium quality with social impact. Traceable to cooperative level with development premiums.', 'coffee', TRUE, 'images/coffee_bag_beans.jpeg'),

('Fair Trade Uganda Robusta', 3100.00, 1200, 'Fair Trade Grade 1', 'Fair Trade certified Uganda Robusta from organized farmer cooperatives. Sustainable production with guaranteed minimum prices and community development support.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 16. ORGANIC CERTIFIED VARIETIES
('Organic Uganda Arabica AA', 5200.00, 420, 'Organic AA', 'Certified organic Uganda Arabica meeting EU, USDA, and JAS standards. Chemical-free production with full traceability from farm to export.', 'coffee', TRUE, 'images/coffee_bag_beans.jpeg'),

-- 17. WOMEN''S COOPERATIVE COFFEE
('Women Farmers Arabica', 4900.00, 320, 'Women''s Coop AA', 'Premium Arabica from women''s cooperatives in eastern Uganda. Empowering female farmers with direct market access. Exceptional quality with social impact story.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 18. YOUTH COOPERATIVE ROBUSTA
('Youth Farmers Robusta', 2950.00, 450, 'Youth Coop Grade 1', 'High-quality Robusta from youth farmer cooperatives. Supporting next generation of coffee farmers with modern processing techniques and quality focus.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- SPECIALTY PROCESSING METHODS

-- 19. ANAEROBIC FERMENTATION ARABICA
('Anaerobic Fermentation Arabica', 6200.00, 120, 'Anaerobic Process', 'Experimental anaerobic fermentation Arabica from Mt. Elgon. Unique flavor profile with enhanced sweetness and complexity. Limited microlot production.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg'),

-- 20. CARBONIC MACERATION COFFEE
('Carbonic Maceration Coffee', 6500.00, 80, 'Carbonic Process', 'Innovative carbonic maceration processing of Uganda Arabica. Wine-making technique applied to coffee for unique flavor development. Exclusive artisan production.', 'coffee', FALSE, 'images/coffee_bag_beans.jpeg');

-- Update stock status and pricing based on current market conditions
UPDATE products SET 
    last_updated = CURRENT_TIMESTAMP,
    active = TRUE
WHERE category = 'coffee';

-- Add cocoa varieties for completeness (Uganda also produces cocoa)
INSERT INTO products (name, price, stock_quantity, grade, description, category, featured, image_url) VALUES
('Uganda Trinitario Cocoa', 3800.00, 450, 'Fine Flavor', 'Premium Trinitario cocoa from western Uganda. Fine flavor variety with complex chocolate notes. Ideal for premium chocolate production.', 'cocoa', TRUE, 'images/coffee_bag_beans.jpeg'),

('Uganda Forastero Cocoa', 3200.00, 680, 'Bulk Grade', 'High-quality Forastero cocoa beans from Uganda. Consistent flavor profile suitable for commercial chocolate production. Well-fermented and properly dried.', 'cocoa', FALSE, 'images/coffee_bag_beans.jpeg'),

('Organic Uganda Cocoa', 4200.00, 280, 'Organic Certified', 'Certified organic cocoa from sustainable farms in western Uganda. EU and USDA organic certified with full traceability and environmental compliance.', 'cocoa', TRUE, 'images/coffee_bag_beans.jpeg');

-- Verify the data insertion
SELECT 
    category,
    COUNT(*) as total_varieties,
    AVG(price) as average_price,
    SUM(stock_quantity) as total_stock
FROM products 
GROUP BY category;

SELECT 
    'Total Coffee Varieties' as description,
    COUNT(*) as count
FROM products 
WHERE category = 'coffee'
UNION ALL
SELECT 
    'Featured Products' as description,
    COUNT(*) as count
FROM products 
WHERE featured = TRUE
UNION ALL
SELECT 
    'Arabica Varieties' as description,
    COUNT(*) as count
FROM products 
WHERE category = 'coffee' AND name LIKE '%Arabica%'
UNION ALL
SELECT 
    'Robusta Varieties' as description,
    COUNT(*) as count
FROM products 
WHERE category = 'coffee' AND name LIKE '%Robusta%';