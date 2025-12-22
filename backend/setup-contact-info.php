<?php
/**
 * Setup Contact Info Table
 * Run this once to create the contact_info table
 */

require_once 'config/database.php';

try {
    // Get database connection
    $db = getDB();
    
    // Read and execute SQL file
    $sql = file_get_contents(__DIR__ . '/contact_info_setup.sql');
    
    // Execute SQL statements
    $db->exec($sql);
    
    echo json_encode([
        'success' => true,
        'message' => 'Contact info table created successfully!'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
