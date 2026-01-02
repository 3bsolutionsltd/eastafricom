<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');

require_once '../config/database.php';

// Check if this is a mutation request (POST, PUT, DELETE) and require auth
$isMutation = in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'DELETE']);
if ($isMutation) {
    require_once __DIR__ . '/../auth/middleware.php';
    requireAuth();
}

try {
    $pdo = getDB();
    
    // Fetch slideshow slides ordered by position
    $stmt = $pdo->prepare("
        SELECT id, chapter, title_en, title_zh, subtitle_en, subtitle_zh, 
               image_url, button_text_en, button_text_zh, button_link, 
               position, autoplay_duration, active
        FROM slideshow_slides 
        WHERE active = 1 
        ORDER BY position ASC
    ");
    
    $stmt->execute();
    $slides = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'slides' => $slides,
            'total' => count($slides)
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
