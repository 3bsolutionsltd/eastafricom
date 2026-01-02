<?php
/**
 * Reset Password API Endpoint (Emergency Use Only)
 * Allows password reset without authentication
 * SECURITY: IP whitelisted - only accessible from specified IPs
 */

// IP WHITELIST - Add your trusted IPs here
$allowedIPs = [
    '127.0.0.1',          // Localhost
    '::1',                // Localhost IPv6
    // Add your office/home IP here when needed:
    // 'YOUR.IP.ADDRESS.HERE',
];

// Check if request is from allowed IP
$clientIP = $_SERVER['REMOTE_ADDR'];
if (!in_array($clientIP, $allowedIPs)) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => 'Access denied. This endpoint is IP-restricted for security.'
    ]);
    exit;
}

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['username']) || !isset($input['new_password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username and new password required']);
        exit;
    }
    
    $username = trim($input['username']);
    $newPassword = $input['new_password'];
    
    // Validate password strength
    if (strlen($newPassword) < 8) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
        exit;
    }
    
    // Connect to database
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Database connection failed");
    }
    
    // Check if user exists
    $checkSql = "SELECT id FROM admin_users WHERE username = :username";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bindParam(':username', $username);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
    
    // Update password
    $updateSql = "UPDATE admin_users SET password_hash = :password WHERE username = :username";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bindParam(':password', $hashedPassword);
    $updateStmt->bindParam(':username', $username);
    $updateStmt->execute();
    
    if ($updateStmt->rowCount() > 0) {
        // Log the password reset
        try {
            $logSql = "INSERT INTO admin_activity_log (user_id, action, details, ip_address, user_agent) 
                       VALUES ((SELECT id FROM admin_users WHERE username = :username), 'password_reset', 'Password reset via emergency tool', :ip, :ua)";
            $logStmt = $conn->prepare($logSql);
            $logStmt->bindParam(':username', $username);
            $logStmt->bindParam(':ip', $_SERVER['REMOTE_ADDR']);
            $logStmt->bindParam(':ua', $_SERVER['HTTP_USER_AGENT']);
            $logStmt->execute();
        } catch (Exception $e) {
            // Silent fail on logging
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Password reset successfully',
            'warning' => 'Please change this password after logging in'
        ]);
    } else {
        throw new Exception('Password update failed');
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
