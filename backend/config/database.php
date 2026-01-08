<?php
/**
 * East Africom Environment-Aware Database Configuration
 * Automatically detects local vs production environment
 */

// Environment detection based on host
$environment = $_SERVER['HTTP_HOST'] ?? 'localhost';
$isLocal = (strpos($environment, 'localhost') !== false || strpos($environment, '127.0.0.1') !== false);

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        global $isLocal;
        
        if ($isLocal) {
            // Local WAMP development environment
            $this->host = "localhost";
            $this->db_name = "eastafricom_cms";
            $this->username = "root";
            $this->password = "FUdy5X6FYr9HBAcu";
            
            // Development error reporting
            ini_set('display_errors', 1);
            error_reporting(E_ALL);
        } else {
            // Production Hostinger environment  
            $this->host = "localhost";
            $this->db_name = "u266222025_eastafricom";
            $this->username = "u266222025_eastuser";
            $this->password = "n#V6E&+RMR2";
            
            // Production error handling
            ini_set('display_errors', 0);
            error_reporting(0);
        }
    }

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                )
            );
        } catch(PDOException $exception) {
            global $isLocal;
            if ($isLocal) {
                echo "Connection error: " . $exception->getMessage();
            } else {
                error_log("Database connection failed: " . $exception->getMessage());
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Service temporarily unavailable']);
            }
            die();
        }

        return $this->conn;
    }

    public function testConnection() {
        try {
            $this->getConnection();
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    public function getEnvironment() {
        global $isLocal;
        return $isLocal ? 'local' : 'production';
    }
}

// Utility functions
function getDB() {
    $database = new Database();
    return $database->getConnection();
}

function setCORSHeaders() {
    $allowed_origins = [
        'https://eastafricom.com',
        'https://www.eastafricom.com',
        'https://live.eastafricom.com',
        'http://localhost',
        'http://127.0.0.1'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json; charset=utf-8');
    
    // Prevent caching of API responses
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Cache-Control: post-check=0, pre-check=0', false);
    header('Pragma: no-cache');
    header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

function successResponse($data = [], $message = 'Success') {
    try {
        $database = new Database();
        $environment = $database->getEnvironment();
    } catch (Exception $e) {
        $environment = 'unknown';
    }
    
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data' => $data,
        'environment' => $environment,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

function errorResponse($message = 'An error occurred', $code = 400) {
    try {
        $database = new Database();
        $environment = $database->getEnvironment();
    } catch (Exception $e) {
        $environment = 'unknown';
    }
    
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'environment' => $environment,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// Legacy compatibility
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}
?>
