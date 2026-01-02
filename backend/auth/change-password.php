<?php
/**
 * Change Password API Endpoint
 * Allows authenticated users to change their password
 */

header('Content-Type: application/json');

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/middleware.php';

// Require authentication
$auth = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['current_password']) || !isset($input['new_password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Current and new password required']);
        exit;
    }
    
    $userId = $_SESSION['admin_id'];
    $currentPassword = $input['current_password'];
    $newPassword = $input['new_password'];
    
    // Validate new password
    if (strlen($newPassword) < 8) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
        exit;
    }
    
    // Change password
    $authInstance = new Auth();
    $result = $authInstance->changePassword($userId, $currentPassword, $newPassword);
    
    if ($result['success']) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error occurred'
    ]);
}
