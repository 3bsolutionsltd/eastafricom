<?php
/**
 * Setup Admin Authentication Tables
 * Creates admin_users, admin_activity_log, and login_attempts tables
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Failed to connect to database");
    }
    
    // Create admin_users table
    $sql1 = "CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_username (username),
        INDEX idx_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($sql1);
    
    // Create admin_activity_log table
    $sql2 = "CREATE TABLE IF NOT EXISTS admin_activity_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($sql2);
    
    // Create login_attempts table
    $sql3 = "CREATE TABLE IF NOT EXISTS login_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_username_ip (username, ip_address, attempted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($sql3);
    
    // Check if default admin user exists
    $checkSql = "SELECT COUNT(*) as count FROM admin_users WHERE username = 'admin'";
    $stmt = $conn->query($checkSql);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $defaultUserCreated = false;
    if ($result['count'] == 0) {
        // Create default admin user with password 'admin123' (MUST BE CHANGED)
        $defaultPassword = 'admin123';
        $hashedPassword = password_hash($defaultPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        
        $insertSql = "INSERT INTO admin_users (username, password_hash, is_active) 
                      VALUES ('admin', :password, 1)";
        
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bindParam(':password', $hashedPassword);
        $insertStmt->execute();
        
        $defaultUserCreated = true;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Admin authentication tables created successfully',
        'tables_created' => [
            'admin_users',
            'admin_activity_log',
            'login_attempts'
        ],
        'default_user' => $defaultUserCreated ? [
            'username' => 'admin',
            'password' => 'admin123',
            'warning' => '⚠️ CRITICAL: Change this password immediately after first login!'
        ] : null
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
