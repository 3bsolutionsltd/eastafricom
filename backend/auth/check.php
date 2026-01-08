<?php
/**
 * Check Authentication Status
 * Returns current user info if authenticated
 */

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/auth.php';

    $auth = new Auth();

    if ($auth->isAuthenticated()) {
        $user = $auth->getCurrentUser();
        echo json_encode([
            'authenticated' => true,
            'user' => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'authenticated' => false,
            'message' => 'Not authenticated'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'authenticated' => false,
        'error' => 'Auth system error: ' . $e->getMessage()
    ]);
}
