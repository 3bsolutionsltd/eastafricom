<?php
/**
 * Setup Live Activity Table
 * Creates the live_activity table for real-time social proof
 */

require_once 'config/database.php';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Setup Live Activity Table</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .success { color: #22c55e; font-weight: bold; }
        .error { color: #ef4444; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Setup Live Activity Table</h2>
<?php

try {
    $db = getDB();
    
    // Create live_activity table
    $sql = "CREATE TABLE IF NOT EXISTS live_activity (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(100) NOT NULL,
        user_country VARCHAR(100) NOT NULL,
        action_type ENUM('inquiry', 'order', 'quote', 'visit') DEFAULT 'inquiry',
        product_name VARCHAR(255),
        quantity VARCHAR(50),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        active BOOLEAN DEFAULT TRUE,
        INDEX idx_timestamp (timestamp),
        INDEX idx_active (active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($sql);
    echo "<p class='success'>✓ Live activity table created successfully</p>";
    
    // Insert sample data
    $stmt = $db->query("SELECT COUNT(*) FROM live_activity");
    $count = $stmt->fetchColumn();
    
    if ($count == 0) {
        echo "<p>Inserting sample activity data...</p>";
        
        $activities = [
            ['Zhang Wei', 'China', 'inquiry', 'Robusta Coffee Beans', '5 tons', 'NOW() - INTERVAL 5 MINUTE'],
            ['John Smith', 'USA', 'order', 'Arabica AA Grade', '2 tons', 'NOW() - INTERVAL 15 MINUTE'],
            ['Mohamed Ali', 'UAE', 'quote', 'Premium Arabica', '10 tons', 'NOW() - INTERVAL 30 MINUTE'],
            ['Liu Chen', 'China', 'inquiry', 'Cocoa Beans', '3 tons', 'NOW() - INTERVAL 45 MINUTE'],
            ['Anna Schmidt', 'Germany', 'order', 'Organic Coffee', '1 ton', 'NOW() - INTERVAL 1 HOUR']
        ];
        
        $stmt = $db->prepare("
            INSERT INTO live_activity (user_name, user_country, action_type, product_name, quantity, timestamp) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        foreach ($activities as $activity) {
            $stmt->execute($activity);
        }
        
        echo "<p class='success'>✓ Inserted " . count($activities) . " sample activities</p>";
    } else {
        echo "<p>Table already contains data ($count activities)</p>";
    }
    
    echo "<p class='success'><strong>Setup Complete!</strong></p>";
    echo "<p>API Endpoint: <a href='api/live-activity.php' target='_blank'>backend/api/live-activity.php</a></p>";
    
} catch (PDOException $e) {
    echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
}
?>
    </div>
</body>
</html>
