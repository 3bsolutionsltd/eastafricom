<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDB();
    
    if ($method === 'GET') {
        // Fetch all quality badges
        $stmt = $pdo->prepare("
            SELECT id, icon, title_en, title_zh, description_en, description_zh, 
                   badge_text, position, active, created_at, updated_at
            FROM quality_badges 
            ORDER BY position ASC
        ");
        
        $stmt->execute();
        $badges = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'badges' => $badges,
                'total' => count($badges)
            ]
        ]);
        
    } elseif ($method === 'POST') {
        // Create or update quality badge
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (isset($data['id']) && $data['id']) {
            // Update existing badge
            $stmt = $pdo->prepare("
                UPDATE quality_badges SET 
                    icon = ?, title_en = ?, title_zh = ?, 
                    description_en = ?, description_zh = ?, 
                    badge_text = ?, position = ?, active = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            
            $stmt->execute([
                $data['icon'],
                $data['title_en'],
                $data['title_zh'],
                $data['description_en'],
                $data['description_zh'],
                $data['badge_text'],
                $data['position'],
                $data['active'] ? 1 : 0,
                $data['id']
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Quality badge updated successfully'
            ]);
            
        } else {
            // Create new badge
            $stmt = $pdo->prepare("
                INSERT INTO quality_badges 
                (icon, title_en, title_zh, description_en, description_zh, badge_text, position, active) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $data['icon'],
                $data['title_en'],
                $data['title_zh'],
                $data['description_en'],
                $data['description_zh'],
                $data['badge_text'],
                $data['position'],
                $data['active'] ? 1 : 0
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Quality badge created successfully',
                'id' => $pdo->lastInsertId()
            ]);
        }
        
    } elseif ($method === 'DELETE') {
        // Delete quality badge
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            throw new Exception('Badge ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM quality_badges WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Quality badge deleted successfully'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
