<?php
/**
 * Section Settings API
 * Save/Load section visibility settings
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$settingsFile = __DIR__ . '/backend/section_settings.json';

// Handle OPTIONS request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// GET - Load settings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($settingsFile)) {
        // Clear file stat cache to avoid serving stale data
        clearstatcache(true, $settingsFile);
        $settings = json_decode(file_get_contents($settingsFile), true);
        echo json_encode([
            'success' => true,
            'settings' => $settings
        ]);
    } else {
        // Return default settings
        echo json_encode([
            'success' => true,
            'settings' => [
                'hero' => true,
                'trustWidget' => true,
                'about' => true,
                'greenProcess' => true,
                'greenServices' => true,
                'products' => true,
                'awards' => true,
                'testimonials' => true,
                'contact' => true
            ]
        ]);
    }
    exit;
}

// POST - Save settings
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['settings'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid data format'
        ]);
        exit;
    }
    
    // Validate settings structure
    $validKeys = ['hero', 'trustWidget', 'about', 'greenProcess', 'greenServices', 'products', 'awards', 'testimonials', 'contact'];
    $settings = [];
    
    foreach ($validKeys as $key) {
        $settings[$key] = isset($data['settings'][$key]) ? (bool)$data['settings'][$key] : true;
    }
    
    // Save to file
    if (file_put_contents($settingsFile, json_encode($settings, JSON_PRETTY_PRINT))) {
        echo json_encode([
            'success' => true,
            'message' => 'Settings saved successfully',
            'settings' => $settings
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to save settings'
        ]);
    }
    exit;
}

// Invalid method
http_response_code(405);
echo json_encode([
    'success' => false,
    'error' => 'Method not allowed'
]);
