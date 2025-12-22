<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config/database.php';

try {
    $pdo = getDB();
    
    // Fetch awards ordered by year descending
    $stmt = $pdo->prepare("
        SELECT id, title, organization, year, description, 
               icon, image_url, category, active
        FROM awards 
        WHERE active = 1 
        ORDER BY year DESC, id DESC
    ");
    
    $stmt->execute();
    $awards = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'awards' => $awards,
            'total' => count($awards)
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
}
