<?php
/**
 * Complete Database Setup and Population Script
 * This will create the database, tables, and populate with Uganda varieties
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Complete Database Setup and Population</h2>";
echo "<div style='font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;'>";

try {
    // Step 1: Connect to MySQL server (without specifying database)
    echo "<p><strong>Step 1:</strong> Connecting to MySQL server...</p>";
    $pdo = new PDO("mysql:host=localhost", "root", "FUdy5X6FYr9HBAcu", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true
    ]);
    echo "<p>✅ Connected to MySQL server successfully</p>";
    
    // Step 2: Create database if not exists
    echo "<p><strong>Step 2:</strong> Creating database...</p>";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS eastafricom_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "<p>✅ Database 'eastafricom_cms' created/verified</p>";
    
    // Step 3: Switch to our database
    echo "<p><strong>Step 3:</strong> Switching to eastafricom_cms database...</p>";
    $pdo->exec("USE eastafricom_cms");
    echo "<p>✅ Using eastafricom_cms database</p>";
    
    // Step 4: Create products table if not exists
    echo "<p><strong>Step 4:</strong> Creating products table...</p>";
    $createTable = "
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
    )";
    $pdo->exec($createTable);
    echo "<p>✅ Products table created/verified</p>";
    
    // Step 5: Clear existing data and reset auto increment
    echo "<p><strong>Step 5:</strong> Clearing existing products...</p>";
    $pdo->exec("DELETE FROM products WHERE 1=1");
    $pdo->exec("ALTER TABLE products AUTO_INCREMENT = 1");
    echo "<p>✅ Existing products cleared</p>";
    
    // Step 6: Insert all Uganda coffee varieties
    echo "<p><strong>Step 6:</strong> Inserting Uganda coffee varieties...</p>";
    
    $varieties = [
        // Arabica varieties
        ['Bugisu Arabica AA', 4800.00, 850, 'Grade AA', 'Premium Bugisu Arabica from Mt. Elgon slopes. Screen size 18+, altitude 1600-2200m. Known for bright acidity, wine-like notes, and exceptional cup quality. Fully washed process.', 'coffee', 1],
        ['Bugisu Arabica AB', 4500.00, 1200, 'Grade AB', 'High-quality Bugisu Arabica, screen size 15-17. Grown on volcanic soils of Mt. Elgon. Medium body with citrus notes and clean finish. Ideal for specialty coffee market.', 'coffee', 1],
        ['Bugisu Arabica PB (Peaberry)', 5200.00, 320, 'Peaberry', 'Rare Bugisu Peaberry coffee from Mt. Elgon. Single rounded bean with concentrated flavors. Exceptional cup profile with wine-like acidity and floral notes.', 'coffee', 1],
        ['Rwenzori Arabica AA', 4600.00, 650, 'Grade AA', 'Premium Rwenzori Arabica from the Mountains of the Moon. Altitude 1800-2300m. Full body with chocolate undertones and low acidity. Fully washed process.', 'coffee', 0],
        ['Rwenzori Arabica Natural', 4700.00, 450, 'Grade A Natural', 'Sun-dried Rwenzori Arabica with fruity, wine-like characteristics. Natural process enhances sweetness and body. Grown at high altitudes in Kasese district.', 'coffee', 0],
        ['Victoria Arabica Washed', 4200.00, 980, 'Grade A', 'Lake Victoria region Arabica, fully washed. Balanced cup with medium body and bright acidity. Grown at 1400-1800m altitude with consistent rainfall patterns.', 'coffee', 0],
        ['Sipi Falls Arabica AA', 4900.00, 420, 'Grade AA', 'Exclusive Sipi Falls Arabica from eastern Uganda highlands. Grown near the famous waterfalls at 1600-2000m. Exceptional cup with floral notes and bright acidity.', 'coffee', 1],
        ['Kapchorwa Arabica Honey Process', 5000.00, 280, 'Honey Process', 'Specialty Kapchorwa Arabica with honey processing. Semi-washed method creates unique sweetness and body. Limited production from small-holder farmers.', 'coffee', 0],
        
        // Robusta varieties
        ['Nganda Robusta Grade 1', 2850.00, 2500, 'Grade 1', 'Premium Nganda Robusta from central Uganda. Screen size 18+, low defect count. High caffeine content, full body, perfect for espresso blends. Grown at 800-1200m.', 'coffee', 1],
        ['Nganda Robusta Grade 2', 2650.00, 1800, 'Grade 2', 'Quality Nganda Robusta, screen size 16-17. Consistent flavor profile with earthy notes and good crema potential. Ideal for commercial coffee blends.', 'coffee', 0],
        ['Mukono Robusta Screen 18', 2900.00, 1600, 'Screen 18+', 'Large bean Mukono Robusta from fertile soils near Lake Victoria. Excellent for espresso with strong body and low acidity. Washed process for clean cup.', 'coffee', 0],
        ['Masaka Robusta Natural', 2750.00, 2200, 'Natural Process', 'Sun-dried Masaka Robusta with enhanced body and earthy characteristics. Traditional processing method adds complexity. Perfect for dark roast profiles.', 'coffee', 0],
        ['Luwero Robusta Washed', 2800.00, 1900, 'Washed Grade 1', 'Fully washed Luwero Robusta with clean cup profile. Grown in red soil conditions optimal for Robusta. High yield variety with consistent quality.', 'coffee', 0],
        ['Bundibugyo Robusta Organic', 3200.00, 850, 'Organic Certified', 'Certified organic Bundibugyo Robusta from western Uganda forests. Shade-grown under indigenous trees. UTZ and Organic certified for premium markets.', 'coffee', 1],
        
        // Specialty varieties
        ['SL14 Arabica Experimental', 5500.00, 180, 'Experimental', 'Scott Labs 14 variety Arabica adapted to Ugandan conditions. Rust-resistant with excellent cup quality. Limited availability from research stations and progressive farmers.', 'coffee', 0],
        ['SL28 Arabica Premium', 5800.00, 150, 'Premium SL28', 'Scott Labs 28 variety known for exceptional cup quality. Wine-like acidity with complex flavor profile. Grown in select high-altitude locations in Uganda.', 'coffee', 0],
        ['Catimor Arabica Hybrid', 4300.00, 380, 'Hybrid Variety', 'Catimor hybrid Arabica combining disease resistance with good cup quality. Medium body with chocolate notes. Suitable for sustainable farming practices.', 'coffee', 0],
        ['Uganda Commercial Blend', 3500.00, 3000, 'Commercial Grade', 'Blend of Uganda Arabica and Robusta for commercial market. Balanced profile suitable for instant coffee and retail blends. Consistent quality and competitive pricing.', 'coffee', 1],
        ['Fair Trade Uganda Arabica', 4800.00, 680, 'Fair Trade AA', 'Fair Trade certified Uganda Arabica supporting smallholder farmers. Premium quality with social impact. Traceable to cooperative level with development premiums.', 'coffee', 1],
        ['Fair Trade Uganda Robusta', 3100.00, 1200, 'Fair Trade Grade 1', 'Fair Trade certified Uganda Robusta from organized farmer cooperatives. Sustainable production with guaranteed minimum prices and community development support.', 'coffee', 0],
        ['Organic Uganda Arabica AA', 5200.00, 420, 'Organic AA', 'Certified organic Uganda Arabica meeting EU, USDA, and JAS standards. Chemical-free production with full traceability from farm to export.', 'coffee', 1],
        ['Women Farmers Arabica', 4900.00, 320, 'Women\'s Coop AA', 'Premium Arabica from women\'s cooperatives in eastern Uganda. Empowering female farmers with direct market access. Exceptional quality with social impact story.', 'coffee', 0],
        ['Youth Farmers Robusta', 2950.00, 450, 'Youth Coop Grade 1', 'High-quality Robusta from youth farmer cooperatives. Supporting next generation of coffee farmers with modern processing techniques and quality focus.', 'coffee', 0],
        ['Anaerobic Fermentation Arabica', 6200.00, 120, 'Anaerobic Process', 'Experimental anaerobic fermentation Arabica from Mt. Elgon. Unique flavor profile with enhanced sweetness and complexity. Limited microlot production.', 'coffee', 0],
        ['Carbonic Maceration Coffee', 6500.00, 80, 'Carbonic Process', 'Innovative carbonic maceration processing of Uganda Arabica. Wine-making technique applied to coffee for unique flavor development. Exclusive artisan production.', 'coffee', 0],
        
        // Cocoa varieties
        ['Uganda Trinitario Cocoa', 3800.00, 450, 'Fine Flavor', 'Premium Trinitario cocoa from western Uganda. Fine flavor variety with complex chocolate notes. Ideal for premium chocolate production.', 'cocoa', 1],
        ['Uganda Forastero Cocoa', 3200.00, 680, 'Bulk Grade', 'High-quality Forastero cocoa beans from Uganda. Consistent flavor profile suitable for commercial chocolate production. Well-fermented and properly dried.', 'cocoa', 0],
        ['Organic Uganda Cocoa', 4200.00, 280, 'Organic Certified', 'Certified organic cocoa from sustainable farms in western Uganda. EU and USDA organic certified with full traceability and environmental compliance.', 'cocoa', 1]
    ];
    
    $insertSQL = "INSERT INTO products (name, price, stock_quantity, grade, description, category, featured, image_url, active) VALUES (?, ?, ?, ?, ?, ?, ?, 'images/coffee_bag_beans.jpeg', 1)";
    $stmt = $pdo->prepare($insertSQL);
    
    $insertedCount = 0;
    foreach ($varieties as $variety) {
        $stmt->execute($variety);
        $insertedCount++;
        echo "<p>✓ Added: {$variety[0]}</p>";
    }
    
    echo "<p>✅ Successfully inserted $insertedCount varieties</p>";
    
    // Step 7: Verify the data
    echo "<p><strong>Step 7:</strong> Verifying inserted data...</p>";
    $stmt = $pdo->query("SELECT category, COUNT(*) as count FROM products GROUP BY category");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($results as $result) {
        echo "<p>📊 {$result['category']}: {$result['count']} varieties</p>";
    }
    
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM products");
    $total = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p><strong>🎯 Total products in database: {$total['total']}</strong></p>";
    
    echo "<div style='background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;'>";
    echo "<h3>✅ SUCCESS!</h3>";
    echo "<p>Database setup and population completed successfully!</p>";
    echo "<p>You can now view your Uganda coffee varieties at:</p>";
    echo "<ul>";
    echo "<li><a href='view_products_direct.php'>Direct Database Viewer</a></li>";
    echo "<li><a href='../admin/'>Admin Dashboard</a></li>";
    echo "</ul>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0;'>";
    echo "<h3>❌ ERROR!</h3>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "</div>";
}

echo "</div>";
?>

<style>
body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
a { color: #007bff; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>