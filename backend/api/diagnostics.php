<?php
/**
 * Database Diagnostic Tool
 * Checks database connection and table status
 */

require_once '../config/database.php';

header('Content-Type: application/json');
setCORSHeaders();

try {
    $db = getDB();
    
    $diagnostics = [
        'success' => true,
        'timestamp' => date('Y-m-d H:i:s'),
        'database' => [],
        'tables' => []
    ];
    
    // Get database info
    $database = new Database();
    $diagnostics['database']['environment'] = $database->getEnvironment();
    $diagnostics['database']['connection'] = 'OK';
    
    // Check for testimonials table
    $tableCheck = $db->query("SHOW TABLES LIKE 'testimonials'");
    $diagnostics['tables']['testimonials_exists'] = $tableCheck->rowCount() > 0;
    
    if ($diagnostics['tables']['testimonials_exists']) {
        // Get table structure
        $structure = $db->query("DESCRIBE testimonials")->fetchAll();
        $diagnostics['tables']['testimonials_structure'] = $structure;
        
        // Get row count
        $count = $db->query("SELECT COUNT(*) as count FROM testimonials")->fetch();
        $diagnostics['tables']['testimonials_count'] = $count['count'];
        
        // Get active count
        $activeCount = $db->query("SELECT COUNT(*) as count FROM testimonials WHERE active = 1")->fetch();
        $diagnostics['tables']['testimonials_active_count'] = $activeCount['count'];
        
        // Get featured count
        $featuredCount = $db->query("SELECT COUNT(*) as count FROM testimonials WHERE active = 1 AND featured = 1")->fetch();
        $diagnostics['tables']['testimonials_featured_count'] = $featuredCount['count'];
        
        // Get sample testimonial
        $sample = $db->query("SELECT * FROM testimonials WHERE active = 1 LIMIT 1")->fetch();
        $diagnostics['tables']['sample_testimonial'] = $sample;
    } else {
        $diagnostics['tables']['testimonials_error'] = 'Table does not exist';
        $diagnostics['tables']['solution'] = 'Run create-testimonials-table.sql to create the table';
    }
    
    // Check other important tables
    $importantTables = ['products', 'contact_info', 'settings'];
    foreach ($importantTables as $table) {
        $check = $db->query("SHOW TABLES LIKE '$table'");
        $diagnostics['tables'][$table . '_exists'] = $check->rowCount() > 0;
    }
    
    echo json_encode($diagnostics, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
?>
