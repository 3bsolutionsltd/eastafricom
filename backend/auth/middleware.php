<?php
/**
 * Authentication Middleware
 * Include this at the top of all protected API endpoints
 */

require_once __DIR__ . '/auth.php';

function requireAuth() {
    $auth = new Auth();
    
    if (!$auth->isAuthenticated()) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Authentication required'
        ]);
        exit;
    }
    
    return $auth;
}

function requireCSRF() {
    $auth = new Auth();
    
    // Skip CSRF for GET requests
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        return;
    }
    
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    
    if (!$token || !$auth->verifyCSRFToken($token)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Invalid CSRF token'
        ]);
        exit;
    }
}
