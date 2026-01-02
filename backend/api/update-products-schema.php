<?php
/**
 * Add defect_free and organic columns to products table
 * Run this once to update the database schema
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Failed to connect to database");
    }
    
    // Check if columns already exist
    $checkSql = "SHOW COLUMNS FROM products LIKE 'defect_free'";
    $stmt = $conn->query($checkSql);
    $defectFreeExists = $stmt->rowCount() > 0;
    
    $checkSql = "SHOW COLUMNS FROM products LIKE 'organic'";
    $stmt = $conn->query($checkSql);
    $organicExists = $stmt->rowCount() > 0;
    
    $changes = [];
    
    // Add defect_free column if it doesn't exist
    if (!$defectFreeExists) {
        $sql = "ALTER TABLE products 
                ADD COLUMN defect_free BOOLEAN DEFAULT TRUE AFTER featured,
                ADD INDEX idx_defect_free (defect_free)";
        $conn->exec($sql);
        $changes[] = 'Added defect_free column';
    } else {
        $changes[] = 'defect_free column already exists';
    }
    
    // Add organic column if it doesn't exist
    if (!$organicExists) {
        $sql = "ALTER TABLE products 
                ADD COLUMN organic BOOLEAN DEFAULT TRUE AFTER defect_free,
                ADD INDEX idx_organic (organic)";
        $conn->exec($sql);
        $changes[] = 'Added organic column';
    } else {
        $changes[] = 'organic column already exists';
    }
    
    // Update all existing products to have defect_free and organic set to true by default
    $updateSql = "UPDATE products 
                  SET defect_free = TRUE, organic = TRUE 
                  WHERE defect_free IS NULL OR organic IS NULL";
    $conn->exec($updateSql);
    $changes[] = 'Updated existing products with default values';
    
    echo json_encode([
        'success' => true,
        'message' => 'Database schema updated successfully',
        'changes' => $changes
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
