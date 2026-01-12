<?php
/**
 * Setup Quotations Table
 * Run this file once to create the quotation_requests table
 */

require_once __DIR__ . '/config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Create quotation_requests table
    $sql = "CREATE TABLE IF NOT EXISTS quotation_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product VARCHAR(255) NOT NULL,
        product_id VARCHAR(100),
        quantity DECIMAL(10,2) NOT NULL,
        unit VARCHAR(20) DEFAULT 'kg',
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
        notes TEXT,
        quoted_price DECIMAL(10,2),
        quote_sent_date TIMESTAMP NULL,
        
        INDEX idx_status (status),
        INDEX idx_email (email),
        INDEX idx_timestamp (timestamp),
        INDEX idx_company (company)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($sql);
    
    echo "✅ Success! Quotation requests table has been created.\n\n";
    echo "You can now:\n";
    echo "1. View quotation requests at: backend/view-quotations.php\n";
    echo "2. Receive quotation submissions from your website\n";
    echo "3. Manage quotation statuses from the admin interface\n";
    
} catch (PDOException $e) {
    echo "❌ Error creating table: " . $e->getMessage() . "\n";
    echo "\nPlease check your database configuration in backend/config/database.php\n";
}
?>
