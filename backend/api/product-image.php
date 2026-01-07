<?php
/**
 * Product Image Upload API
 * Handle product image uploads (Admin only)
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

// Get database connection
$db = getDB();

// POST - Upload product image
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
    
    $productId = $_POST['product_id'] ?? null;
    if (!$productId) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Product ID is required'
        ]);
        exit;
    }
    
    $file = $_FILES['image'];
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    
    // Validate file type
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'
        ]);
        exit;
    }
    
    // Validate file size
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'File too large. Maximum size is 5MB.'
        ]);
        exit;
    }
    
    // Create upload directory if it doesn't exist
    $uploadDir = '../../images/products/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'product_' . $productId . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Update database with image path
        try {
            $imageUrl = 'images/products/' . $filename;
            
            $stmt = $db->prepare("UPDATE products SET image_url = :image_url WHERE id = :id");
            $stmt->execute([
                ':image_url' => $imageUrl,
                ':id' => $productId
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'image_url' => $imageUrl,
                'filename' => $filename
            ]);
        } catch (PDOException $e) {
            // Delete uploaded file if database update fails
            unlink($filepath);
            
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Database error: ' . $e->getMessage()
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to move uploaded file'
        ]);
    }
    exit;
}

// DELETE - Remove product image
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $productId = $input['product_id'] ?? null;
    
    if (!$productId) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Product ID is required'
        ]);
        exit;
    }
    
    try {
        // Get current image URL
        $stmt = $db->prepare("SELECT image_url FROM products WHERE id = :id");
        $stmt->execute([':id' => $productId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($product && $product['image_url']) {
            // Delete file from filesystem
            $filepath = '../../' . $product['image_url'];
            if (file_exists($filepath)) {
                unlink($filepath);
            }
            
            // Update database
            $stmt = $db->prepare("UPDATE products SET image_url = NULL WHERE id = :id");
            $stmt->execute([':id' => $productId]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Image deleted successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'No image found for this product'
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
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
