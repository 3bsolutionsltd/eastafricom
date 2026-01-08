<?php
/**
 * Slideshow API Endpoint
 * Returns and manages slideshow slides
 */

// Include database configuration
require_once '../config/database.php';

// Check if this is a mutation request (POST, PUT, DELETE) and require auth
$isMutation = in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'DELETE']);
if ($isMutation) {
    require_once __DIR__ . '/../auth/middleware.php';
    requireAuth();
}

// Set CORS headers
setCORSHeaders();

try {
    $pdo = getDB();
    
    // Handle different HTTP methods
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            handleGetSlides($pdo);
            break;
        case 'POST':
            handleCreateSlide($pdo);
            break;
        case 'PUT':
            handleUpdateSlide($pdo);
            break;
        case 'DELETE':
            handleDeleteSlide($pdo);
            break;
        default:
            errorResponse('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    errorResponse('Server error: ' . $e->getMessage(), 500);
}

/**
 * Get all slides
 */
function handleGetSlides($pdo) {
    try {
        $includeInactive = $_GET['admin'] ?? null;
        
        // Check if table exists first
        $tableCheck = $pdo->query("SHOW TABLES LIKE 'slideshow_slides'");
        if ($tableCheck->rowCount() === 0) {
            // Table doesn't exist, return empty array
            successResponse([
                'slides' => [],
                'total' => 0,
                'note' => 'Slideshow table not found'
            ]);
            return;
        }
        
        if ($includeInactive === 'true') {
            $sql = "SELECT * FROM slideshow_slides ORDER BY position ASC";
        } else {
            $sql = "SELECT * FROM slideshow_slides WHERE active = 1 ORDER BY position ASC";
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $slides = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        successResponse([
            'slides' => $slides,
            'total' => count($slides)
        ]);
        
    } catch (PDOException $e) {
        errorResponse('Failed to fetch slides: ' . $e->getMessage());
    }
}

/**
 * Create new slide
 */
function handleCreateSlide($pdo) {
    try {
        // Check if table exists first
        $tableCheck = $pdo->query("SHOW TABLES LIKE 'slideshow_slides'");
        if ($tableCheck->rowCount() === 0) {
            errorResponse('Slideshow table not found. Please create the table first.');
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        $required = ['chapter', 'title_en', 'title_zh', 'subtitle_en', 'subtitle_zh'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                errorResponse("Missing required field: $field");
            }
        }
        
        $sql = "INSERT INTO slideshow_slides 
                (chapter, title_en, title_zh, subtitle_en, subtitle_zh, image_url, 
                 button_text_en, button_text_zh, button_link, position, autoplay_duration, active) 
                VALUES 
                (:chapter, :title_en, :title_zh, :subtitle_en, :subtitle_zh, :image_url,
                 :button_text_en, :button_text_zh, :button_link, :position, :autoplay_duration, :active)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':chapter' => $input['chapter'],
            ':title_en' => $input['title_en'],
            ':title_zh' => $input['title_zh'],
            ':subtitle_en' => $input['subtitle_en'],
            ':subtitle_zh' => $input['subtitle_zh'],
            ':image_url' => $input['image_url'] ?? 'images/coffee_bag_beans.jpg',
            ':button_text_en' => $input['button_text_en'] ?? 'Learn More',
            ':button_text_zh' => $input['button_text_zh'] ?? '了解更多',
            ':button_link' => $input['button_link'] ?? '#',
            ':position' => $input['position'] ?? 1,
            ':autoplay_duration' => $input['autoplay_duration'] ?? 6000,
            ':active' => $input['active'] ?? 1
        ]);
        
        $slideId = $pdo->lastInsertId();
        
        successResponse([
            'id' => $slideId,
            'message' => 'Slide created successfully'
        ]);
        
    } catch (PDOException $e) {
        errorResponse('Failed to create slide: ' . $e->getMessage());
    }
}

/**
 * Update existing slide
 */
function handleUpdateSlide($pdo) {
    try {
        // Check if table exists first
        $tableCheck = $pdo->query("SHOW TABLES LIKE 'slideshow_slides'");
        if ($tableCheck->rowCount() === 0) {
            errorResponse('Slideshow table not found. Please create the table first.');
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            errorResponse('Slide ID is required');
        }
        
        $updateFields = [];
        $params = [':id' => $input['id']];
        
        $allowedFields = [
            'chapter', 'title_en', 'title_zh', 'subtitle_en', 'subtitle_zh',
            'image_url', 'button_text_en', 'button_text_zh', 'button_link',
            'position', 'autoplay_duration', 'active'
        ];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updateFields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }
        
        if (empty($updateFields)) {
            errorResponse('No fields to update');
        }
        
        $sql = "UPDATE slideshow_slides SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Check if slide exists even if no changes were made
        if ($stmt->rowCount() === 0) {
            // Verify the slide exists
            $checkStmt = $pdo->prepare("SELECT id FROM slideshow_slides WHERE id = :id");
            $checkStmt->execute([':id' => $input['id']]);
            
            if ($checkStmt->rowCount() === 0) {
                errorResponse('Slide not found', 404);
            } else {
                // Slide exists but no changes were made - still success
                successResponse(['message' => 'Slide updated successfully (no changes detected)']);
            }
        } else {
            successResponse(['message' => 'Slide updated successfully']);
        }
        
    } catch (PDOException $e) {
        errorResponse('Failed to update slide: ' . $e->getMessage());
    }
}

/**
 * Delete slide
 */
function handleDeleteSlide($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            errorResponse('Slide ID is required');
        }
        
        // Soft delete
        $sql = "UPDATE slideshow_slides SET active = 0 WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $input['id']]);
        
        if ($stmt->rowCount() === 0) {
            errorResponse('Slide not found', 404);
        }
        
        successResponse(['message' => 'Slide deleted successfully']);
        
    } catch (PDOException $e) {
        errorResponse('Failed to delete slide: ' . $e->getMessage());
    }
}
