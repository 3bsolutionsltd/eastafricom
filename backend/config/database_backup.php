<?php
/**
 * Database Configuration for East Africom CMS
 * Update these credentials with your actual database details
 */

class Database {
    // Database configuration
    private $host = "localhost";          // Database host (usually localhost)
    private $db_name = "eastafricom_cms"; // Database name
    private $username = "root";           // Database username (update this)
    private $password = "FUdy5X6FYr9HBAcu";  // Database password (update this)
    public $conn;

    /**
     * Get database connection
     */
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
                )
            );
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
            die();
        }
        
        return $this->conn;
    }

    /**
     * Test database connection
     */
    public function testConnection() {
        try {
            $this->getConnection();
            return true;
        } catch(Exception $e) {
            return false;
        }
    }
}

/**
 * Utility function to get database instance
 */
function getDB() {
    $database = new Database();
    return $database->getConnection();
}

/**
 * CORS Headers for API requests
 */
function setCORSHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * JSON Response helper
 */
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

/**
 * Error response helper
 */
function errorResponse($message, $status = 400) {
    jsonResponse(['error' => $message, 'status' => $status], $status);
}

/**
 * Success response helper
 */
function successResponse($data, $message = 'Success') {
    jsonResponse(['success' => true, 'message' => $message, 'data' => $data]);
}
?>