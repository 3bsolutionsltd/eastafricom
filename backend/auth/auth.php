<?php
/**
 * Authentication System for East Africom Admin Panel
 * Provides secure login, session management, and password hashing
 */

require_once __DIR__ . '/../config/database.php';

class Auth {
    private $db;
    private $sessionTimeout = 3600; // 1 hour in seconds
    
    public function __construct() {
        $this->db = new Database();
        
        // Start session with secure settings
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_httponly', 1);
            ini_set('session.cookie_secure', isset($_SERVER['HTTPS']) ? 1 : 0);
            ini_set('session.use_only_cookies', 1);
            ini_set('session.cookie_samesite', 'Strict');
            session_start();
        }
    }
    
    /**
     * Login user with username and password
     */
    public function login($username, $password) {
        try {
            $conn = $this->db->getConnection();
            
            $sql = "SELECT id, username, password_hash, is_active, last_login 
                    FROM admin_users 
                    WHERE username = :username AND is_active = 1";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password_hash'])) {
                // Successful login
                $_SESSION['admin_id'] = $user['id'];
                $_SESSION['admin_username'] = $user['username'];
                $_SESSION['login_time'] = time();
                $_SESSION['last_activity'] = time();
                
                // Regenerate session ID to prevent session fixation
                session_regenerate_id(true);
                
                // Update last login time
                $updateSql = "UPDATE admin_users SET last_login = NOW() WHERE id = :id";
                $updateStmt = $conn->prepare($updateSql);
                $updateStmt->bindParam(':id', $user['id']);
                $updateStmt->execute();
                
                // Log successful login
                $this->logActivity($user['id'], 'login', 'Successful login');
                
                return [
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username']
                    ]
                ];
            } else {
                // Failed login - log attempt
                $this->logFailedLogin($username);
                
                return [
                    'success' => false,
                    'message' => 'Invalid username or password'
                ];
            }
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Check if user is authenticated
     */
    public function isAuthenticated() {
        if (!isset($_SESSION['admin_id']) || !isset($_SESSION['last_activity'])) {
            return false;
        }
        
        // Check session timeout
        if (time() - $_SESSION['last_activity'] > $this->sessionTimeout) {
            $this->logout();
            return false;
        }
        
        // Update last activity time
        $_SESSION['last_activity'] = time();
        
        return true;
    }
    
    /**
     * Logout current user
     */
    public function logout() {
        if (isset($_SESSION['admin_id'])) {
            $this->logActivity($_SESSION['admin_id'], 'logout', 'User logged out');
        }
        
        // Unset all session variables
        $_SESSION = array();
        
        // Destroy session cookie
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        // Destroy session
        session_destroy();
        
        return ['success' => true, 'message' => 'Logged out successfully'];
    }
    
    /**
     * Get current authenticated user
     */
    public function getCurrentUser() {
        if (!$this->isAuthenticated()) {
            return null;
        }
        
        try {
            $conn = $this->db->getConnection();
            
            $sql = "SELECT id, username, created_at, last_login 
                    FROM admin_users 
                    WHERE id = :id AND is_active = 1";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $_SESSION['admin_id']);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return null;
        }
    }
    
    /**
     * Change user password
     */
    public function changePassword($userId, $oldPassword, $newPassword) {
        try {
            $conn = $this->db->getConnection();
            
            // Verify old password
            $sql = "SELECT password_hash FROM admin_users WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $userId);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user || !password_verify($oldPassword, $user['password_hash'])) {
                return ['success' => false, 'message' => 'Current password is incorrect'];
            }
            
            // Validate new password strength
            if (strlen($newPassword) < 8) {
                return ['success' => false, 'message' => 'New password must be at least 8 characters'];
            }
            
            // Update password
            $newHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
            $updateSql = "UPDATE admin_users SET password_hash = :hash WHERE id = :id";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bindParam(':hash', $newHash);
            $updateStmt->bindParam(':id', $userId);
            $updateStmt->execute();
            
            $this->logActivity($userId, 'password_change', 'Password changed successfully');
            
            return ['success' => true, 'message' => 'Password changed successfully'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
    
    /**
     * Log user activity
     */
    private function logActivity($userId, $action, $details) {
        try {
            $conn = $this->db->getConnection();
            
            $sql = "INSERT INTO admin_activity_log (user_id, action, details, ip_address, user_agent) 
                    VALUES (:user_id, :action, :details, :ip_address, :user_agent)";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':action', $action);
            $stmt->bindParam(':details', $details);
            $stmt->bindParam(':ip_address', $_SERVER['REMOTE_ADDR']);
            $stmt->bindParam(':user_agent', $_SERVER['HTTP_USER_AGENT']);
            $stmt->execute();
        } catch (PDOException $e) {
            // Silent fail - don't interrupt user actions
            error_log("Activity log error: " . $e->getMessage());
        }
    }
    
    /**
     * Log failed login attempts
     */
    private function logFailedLogin($username) {
        try {
            $conn = $this->db->getConnection();
            
            $sql = "INSERT INTO login_attempts (username, ip_address, attempted_at) 
                    VALUES (:username, :ip_address, NOW())";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':ip_address', $_SERVER['REMOTE_ADDR']);
            $stmt->execute();
        } catch (PDOException $e) {
            error_log("Failed login log error: " . $e->getMessage());
        }
    }
    
    /**
     * Check for brute force attempts
     */
    public function checkBruteForce($username) {
        try {
            $conn = $this->db->getConnection();
            
            // Count failed attempts in last 15 minutes
            $sql = "SELECT COUNT(*) as attempts 
                    FROM login_attempts 
                    WHERE username = :username 
                    AND ip_address = :ip_address 
                    AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':ip_address', $_SERVER['REMOTE_ADDR']);
            $stmt->execute();
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Block after 5 failed attempts
            if ($result['attempts'] >= 5) {
                return [
                    'blocked' => true,
                    'message' => 'Too many failed login attempts. Please try again in 15 minutes.'
                ];
            }
            
            return ['blocked' => false];
        } catch (PDOException $e) {
            return ['blocked' => false]; // Fail open for availability
        }
    }
    
    /**
     * Generate CSRF token
     */
    public function generateCSRFToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    /**
     * Verify CSRF token
     */
    public function verifyCSRFToken($token) {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }
}
