<?php
/**
 * Quotations API - Fetch and manage quotation requests
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit;
}

// Check if table exists
$tableCheck = $conn->query("SHOW TABLES LIKE 'quotation_requests'");
if ($tableCheck->rowCount() === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Quotation requests table not found. Please run the database setup.'
    ]);
    exit;
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            handleGetRequest($conn);
            break;
        case 'POST':
            handlePostRequest($conn);
            break;
        case 'PUT':
            handlePutRequest($conn);
            break;
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Method not allowed'
            ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

function handleGetRequest($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    
    if ($id) {
        // Get single quotation
        $stmt = $conn->prepare("SELECT * FROM quotation_requests WHERE id = ?");
        $stmt->execute([$id]);
        $quotation = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($quotation) {
            // Map columns to match frontend expectations
            $quotation = [
                'id' => $quotation['id'],
                'customer_name' => $quotation['contact_name'],
                'customer_email' => $quotation['email'],
                'customer_phone' => $quotation['phone'],
                'customer_company' => $quotation['company'],
                'customer_country' => $quotation['country'],
                'product_name' => $quotation['product'],
                'product_category' => '', // Not in old schema
                'quantity' => $quotation['quantity'],
                'unit' => $quotation['unit'],
                'message' => $quotation['requirements'],
                'status' => $quotation['status'],
                'admin_notes' => $quotation['notes'],
                'email_sent' => $quotation['email_sent'],
                'created_at' => $quotation['timestamp']
            ];
            
            echo json_encode([
                'success' => true,
                'data' => ['quotation' => $quotation]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Quotation not found'
            ]);
        }
    } else {
        // Get all quotations with filters
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
        $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
        
        $sql = "SELECT * FROM quotation_requests WHERE 1=1";
        $params = [];
        
        if ($status) {
            $sql .= " AND status = ?";
            $params[] = $status;
        }
        
        if ($search) {
            $sql .= " AND (customer_name LIKE ? OR customer_email LIKE ? OR product_name LIKE ?)";
            $searchTerm = "%{$search}%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $sql .= " ORDER BY timestamp DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $quotations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Map columns to match frontend expectations
        $quotations = array_map(function($q) {
            return [
                'id' => $q['id'],
                'customer_name' => $q['contact_name'],
                'customer_email' => $q['email'],
                'customer_phone' => $q['phone'],
                'customer_company' => $q['company'],
                'customer_country' => $q['country'],
                'product_name' => $q['product'],
                'product_category' => '', // Not in old schema
                'quantity' => $q['quantity'],
                'unit' => $q['unit'],
                'message' => $q['requirements'],
                'status' => $q['status'],
                'admin_notes' => $q['notes'],
                'email_sent' => $q['email_sent'],
                'created_at' => $q['timestamp']
            ];
        }, $quotations);
        
        // Get statistics
        $statsQuery = "SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'quoted' THEN 1 ELSE 0 END) as responded,
            SUM(CASE WHEN status IN ('accepted', 'completed') THEN 1 ELSE 0 END) as converted,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as archived,
            SUM(CASE WHEN DATE(timestamp) = CURDATE() THEN 1 ELSE 0 END) as today
        FROM quotation_requests";
        
        $statsResult = $conn->query($statsQuery);
        $stats = $statsResult->fetch(PDO::FETCH_ASSOC);
        if ($stats) {
            $stats = array_map('intval', $stats);
        } else {
            $stats = [
                'total' => 0,
                'pending' => 0,
                'responded' => 0,
                'converted' => 0,
                'archived' => 0,
                'today' => 0
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => [
                'quotations' => $quotations,
                'statistics' => $stats,
                'total' => count($quotations)
            ]
        ]);
    }
}

function handlePostRequest($conn) {
    // Handle status updates or notes
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Quotation ID required'
        ]);
        return;
    }
    
    $id = intval($input['id']);
    $updates = [];
    $params = [];
    
    if (isset($input['status'])) {
        // Map new status values to old schema
        $statusMap = [
            'pending' => 'pending',
            'responded' => 'quoted',
            'converted' => 'accepted',
            'archived' => 'rejected'
        ];
        $status = $statusMap[$input['status']] ?? 'pending';
        $updates[] = "status = ?";
        $params[] = $status;
    }
    
    if (isset($input['admin_notes'])) {
        $updates[] = "notes = ?";
        $params[] = $input['admin_notes'];
    }
    
    if (empty($updates)) {
        echo json_encode([
            'success' => false,
            'message' => 'No updates provided'
        ]);
        return;
    }
    
    $sql = "UPDATE quotation_requests SET " . implode(", ", $updates) . " WHERE id = ?";
    $params[] = $id;
    
    $stmt = $conn->prepare($sql);
    
    if ($stmt->execute($params)) {
        echo json_encode([
            'success' => true,
            'message' => 'Quotation updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update quotation'
        ]);
    }
}

function handlePutRequest($conn) {
    handlePostRequest($conn);
}
