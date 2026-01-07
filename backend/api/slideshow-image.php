<?php
/**
 * Slideshow Image Upload API
 * Handle slideshow image uploads (Admin only)
 */

// Include database configuration
require_once '../config/database.php';

// Require authentication for all methods
require_once __DIR__ . '/../auth/middleware.php';
requireAuth();

// Set CORS headers
setCORSHeaders();

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// POST - Upload slideshow image
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'No file uploaded or upload error'
        ]);
        exit;
    }
    
    $file = $_FILES['image'];
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    $maxSize = 2 * 1024 * 1024; // 2MB
    
    // Validate file type
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid file type. Only JPG and PNG are allowed.'
        ]);
        exit;
    }
    
    // Validate file size
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'File too large. Maximum size is 2MB.'
        ]);
        exit;
    }
    
    // Create upload directory if it doesn't exist
    $uploadDir = '../../images/slideshow/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'slide_' . time() . '_' . uniqid() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $imageUrl = 'images/slideshow/' . $filename;
        
        echo json_encode([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'image_url' => $imageUrl,
            'filename' => $filename
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to move uploaded file'
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
?>
