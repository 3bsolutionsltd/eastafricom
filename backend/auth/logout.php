<?php
/**
 * Logout API Endpoint
 */

header('Content-Type: application/json');

require_once __DIR__ . '/auth.php';

$auth = new Auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$result = $auth->logout();
echo json_encode($result);
