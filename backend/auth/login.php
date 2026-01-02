<?php
/**
 * Login API Endpoint
 * Handles authentication requests
 */

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

require_once __DIR__ . '/auth.php';

$auth = new Auth();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username and password required']);
        exit;
    }
    
    $username = trim($input['username']);
    $password = $input['password'];
    
    // Validate input
    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username and password cannot be empty']);
        exit;
    }
    
    // Check for brute force attempts
    $bruteForceCheck = $auth->checkBruteForce($username);
    if ($bruteForceCheck['blocked']) {
        http_response_code(429);
        echo json_encode([
            'success' => false, 
            'message' => $bruteForceCheck['message']
        ]);
        exit;
    }
    
    // Attempt login
    $result = $auth->login($username, $password);
    
    if ($result['success']) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(401);
        echo json_encode($result);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error occurred'
    ]);
}
