<?php
/**
 * Setup Site Settings Table
 * Run this script to create and populate the site_settings table
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Setup Site Settings Table</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { color: #2B1810; border-bottom: 3px solid #6ab43e; padding-bottom: 10px; }
        .step { margin: 15px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #6ab43e; }
        .success { color: #22c55e; font-weight: bold; }
        .error { color: #ef4444; font-weight: bold; }
        .warning { color: #f59e0b; font-weight: bold; }
        pre { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h2>🗄️ Site Settings Table Setup</h2>
<?php

try {
    // Step 1: Connect to database
    echo "<div class='step'>";
    echo "<strong>Step 1:</strong> Connecting to database...<br>";
    
    $pdo = new PDO(
        "mysql:host=localhost;dbname=eastafricom_cms;charset=utf8mb4",
        "root",
        "FUdy5X6FYr9HBAcu",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    echo "<span class='success'>✅ Connected to database successfully</span>";
    echo "</div>";
    
    // Step 2: Create site_settings table
    echo "<div class='step'>";
    echo "<strong>Step 2:</strong> Creating site_settings table...<br>";
    
    $createTableSQL = "
    CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_type ENUM('text', 'number', 'boolean', 'json', 'url') DEFAULT 'text',
        description VARCHAR(255),
        category VARCHAR(50) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_category (category),
        INDEX idx_key (setting_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createTableSQL);
    echo "<span class='success'>✅ Table created/verified successfully</span>";
    echo "</div>";
    
    // Step 3: Check if data already exists
    echo "<div class='step'>";
    echo "<strong>Step 3:</strong> Checking existing data...<br>";
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM site_settings");
    $result = $stmt->fetch();
    $existingCount = $result['count'];
    
    if ($existingCount > 0) {
        echo "<span class='warning'>⚠️ Found {$existingCount} existing settings. Skipping data population to preserve existing data.</span><br>";
        echo "<small>If you want to reset, manually delete records first or drop the table.</small>";
    } else {
        echo "<span class='success'>✅ No existing data found. Proceeding with population...</span>";
        echo "</div>";
        
        // Step 4: Insert default settings
        echo "<div class='step'>";
        echo "<strong>Step 4:</strong> Inserting default settings...<br>";
        
        $defaultSettings = [
            // General Settings
            ['site_title', 'East Africom Consults', 'text', 'Website title', 'general'],
            ['site_description', 'Premium Uganda Coffee & Cocoa Export', 'text', 'Website description', 'general'],
            ['site_email', 'info@eastafricom.com', 'text', 'Contact email', 'general'],
            ['site_phone', '+256 700 123 456', 'text', 'Contact phone', 'general'],
            
            // Feature Flags
            ['enable_live_activity', 'true', 'boolean', 'Show live activity feed', 'features'],
            ['enable_auto_refresh', 'false', 'boolean', 'Auto-refresh dynamic content', 'features'],
            ['enable_testimonials', 'true', 'boolean', 'Show testimonials section', 'features'],
            ['enable_trust_badges', 'true', 'boolean', 'Show trust badges', 'features'],
            
            // Content Settings
            ['products_per_page', '12', 'number', 'Products displayed per page', 'content'],
            ['testimonials_per_page', '6', 'number', 'Testimonials per page', 'content'],
            ['refresh_interval', '30000', 'number', 'Auto-refresh interval in ms', 'content'],
            
            // Social Media
            ['facebook_url', 'https://facebook.com/eastafricom', 'url', 'Facebook page URL', 'social'],
            ['twitter_url', 'https://twitter.com/eastafricom', 'url', 'Twitter profile URL', 'social'],
            ['instagram_url', 'https://instagram.com/eastafricom', 'url', 'Instagram profile URL', 'social'],
            ['linkedin_url', 'https://linkedin.com/company/eastafricom', 'url', 'LinkedIn page URL', 'social'],
            
            // Business Settings
            ['business_hours', '{"monday":"8:00-17:00","tuesday":"8:00-17:00","wednesday":"8:00-17:00","thursday":"8:00-17:00","friday":"8:00-17:00","saturday":"9:00-13:00","sunday":"Closed"}', 'json', 'Business operating hours', 'business'],
            ['shipping_countries', '["Uganda","Kenya","Tanzania","Rwanda","South Sudan"]', 'json', 'Available shipping countries', 'business'],
            ['payment_methods', '["Bank Transfer","Mobile Money","PayPal","Credit Card"]', 'json', 'Accepted payment methods', 'business']
        ];
        
        $insertSQL = "INSERT INTO site_settings (setting_key, setting_value, setting_type, description, category) 
                      VALUES (:key, :value, :type, :description, :category)";
        $stmt = $pdo->prepare($insertSQL);
        
        $inserted = 0;
        foreach ($defaultSettings as $setting) {
            try {
                $stmt->execute([
                    ':key' => $setting[0],
                    ':value' => $setting[1],
                    ':type' => $setting[2],
                    ':description' => $setting[3],
                    ':category' => $setting[4]
                ]);
                $inserted++;
            } catch (PDOException $e) {
                echo "<span class='error'>❌ Failed to insert '{$setting[0]}': {$e->getMessage()}</span><br>";
            }
        }
        
        echo "<span class='success'>✅ Inserted {$inserted} default settings</span>";
        echo "</div>";
    }
    
    // Step 5: Verify installation
    echo "<div class='step'>";
    echo "<strong>Step 5:</strong> Verifying installation...<br>";
    
    $stmt = $pdo->query("SELECT COUNT(*) as count, COUNT(DISTINCT category) as categories FROM site_settings");
    $result = $stmt->fetch();
    
    echo "<span class='success'>✅ Total settings: {$result['count']}</span><br>";
    echo "<span class='success'>✅ Categories: {$result['categories']}</span><br>";
    echo "</div>";
    
    // Show sample data
    echo "<div class='step'>";
    echo "<strong>Step 6:</strong> Sample data (first 5 records)...<br>";
    
    $stmt = $pdo->query("SELECT * FROM site_settings ORDER BY category, setting_key LIMIT 5");
    $samples = $stmt->fetchAll();
    
    echo "<table style='width:100%; border-collapse: collapse; margin-top: 10px;'>";
    echo "<tr style='background:#6ab43e; color:white;'>";
    echo "<th style='padding:8px; text-align:left;'>Key</th>";
    echo "<th style='padding:8px; text-align:left;'>Value</th>";
    echo "<th style='padding:8px; text-align:left;'>Type</th>";
    echo "<th style='padding:8px; text-align:left;'>Category</th>";
    echo "</tr>";
    
    foreach ($samples as $row) {
        echo "<tr style='border-bottom:1px solid #ddd;'>";
        echo "<td style='padding:8px;'><strong>{$row['setting_key']}</strong></td>";
        echo "<td style='padding:8px;'>" . htmlspecialchars(substr($row['setting_value'], 0, 50)) . "</td>";
        echo "<td style='padding:8px;'><em>{$row['setting_type']}</em></td>";
        echo "<td style='padding:8px;'>{$row['category']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    echo "</div>";
    
    // Success message
    echo "<div class='step' style='background:#d1fae5; border-color:#22c55e;'>";
    echo "<h3 style='color:#22c55e; margin-top:0;'>✅ Setup Complete!</h3>";
    echo "<p>The site_settings table has been created and populated successfully.</p>";
    echo "<p><strong>Next steps:</strong></p>";
    echo "<ul>";
    echo "<li>Test the API: <a href='api/settings.php' target='_blank'>backend/api/settings.php</a></li>";
    echo "<li>View all settings: <a href='api/settings.php?category=general' target='_blank'>backend/api/settings.php?category=general</a></li>";
    echo "<li>Reload your website to see the changes take effect</li>";
    echo "</ul>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<div class='step' style='background:#fee; border-color:#ef4444;'>";
    echo "<span class='error'>❌ Database Error: " . $e->getMessage() . "</span><br><br>";
    echo "<strong>Troubleshooting:</strong><br>";
    echo "<ul>";
    echo "<li>Make sure WAMP/MySQL is running</li>";
    echo "<li>Verify database credentials in config/database.php</li>";
    echo "<li>Check if database 'eastafricom_cms' exists</li>";
    echo "<li>Ensure proper MySQL permissions</li>";
    echo "</ul>";
    echo "</div>";
} catch (Exception $e) {
    echo "<div class='step' style='background:#fee; border-color:#ef4444;'>";
    echo "<span class='error'>❌ Error: " . $e->getMessage() . "</span>";
    echo "</div>";
}

?>
    </div>
</body>
</html>
