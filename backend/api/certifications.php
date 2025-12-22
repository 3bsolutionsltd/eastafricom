<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

try {
    $db = getDB();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all certifications
        $stmt = $db->prepare("
            SELECT * FROM certifications 
            WHERE active = 1
            ORDER BY display_order ASC, id ASC
        ");
        $stmt->execute();
        $certifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'certifications' => $certifications,
                'total' => count($certifications)
            ]
        ]);
    }
    else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new certification
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("
            INSERT INTO certifications 
            (icon, title_en, title_zh, description_en, description_zh, badge1, badge2, badge3, chinese_specific, display_order, active)
            VALUES (:icon, :title_en, :title_zh, :description_en, :description_zh, :badge1, :badge2, :badge3, :chinese_specific, :display_order, :active)
        ");
        
        $stmt->execute([
            'icon' => $data['icon'] ?? 'fas fa-certificate',
            'title_en' => $data['title_en'],
            'title_zh' => $data['title_zh'],
            'description_en' => $data['description_en'],
            'description_zh' => $data['description_zh'],
            'badge1' => $data['badge1'] ?? '',
            'badge2' => $data['badge2'] ?? '',
            'badge3' => $data['badge3'] ?? '',
            'chinese_specific' => $data['chinese_specific'] ?? 0,
            'display_order' => $data['display_order'] ?? 0,
            'active' => $data['active'] ?? 1
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Certification created successfully',
            'id' => $db->lastInsertId()
        ]);
    }
    else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update certification
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("
            UPDATE certifications SET
                icon = :icon,
                title_en = :title_en,
                title_zh = :title_zh,
                description_en = :description_en,
                description_zh = :description_zh,
                badge1 = :badge1,
                badge2 = :badge2,
                badge3 = :badge3,
                chinese_specific = :chinese_specific,
                display_order = :display_order,
                active = :active
            WHERE id = :id
        ");
        
        $stmt->execute([
            'id' => $data['id'],
            'icon' => $data['icon'],
            'title_en' => $data['title_en'],
            'title_zh' => $data['title_zh'],
            'description_en' => $data['description_en'],
            'description_zh' => $data['description_zh'],
            'badge1' => $data['badge1'] ?? '',
            'badge2' => $data['badge2'] ?? '',
            'badge3' => $data['badge3'] ?? '',
            'chinese_specific' => $data['chinese_specific'] ?? 0,
            'display_order' => $data['display_order'],
            'active' => $data['active']
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Certification updated successfully'
        ]);
    }
    else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete certification (soft delete)
        $id = $_GET['id'] ?? null;
        
        if ($id) {
            $stmt = $db->prepare("UPDATE certifications SET active = 0 WHERE id = :id");
            $stmt->execute(['id' => $id]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Certification deleted successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'ID required'
            ]);
        }
    }
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
