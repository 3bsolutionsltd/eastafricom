<?php
/**
 * Testimonials API Endpoint
 * Returns active testimonials for social proof
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
    // Get database connection
    $db = getDB();
    
    // Handle different HTTP methods
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            handleGetTestimonials($db);
            break;
        case 'POST':
            handleCreateTestimonial($db);
            break;
        case 'PUT':
            handleUpdateTestimonial($db);
            break;
        case 'DELETE':
            handleDeleteTestimonial($db);
            break;
        default:
            errorResponse('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    errorResponse('Server error: ' . $e->getMessage(), 500);
}

/**
 * Get all active testimonials
 */
function handleGetTestimonials($db) {
    try {
        // Get filter parameters
        $featured = $_GET['featured'] ?? null;
        $limit = $_GET['limit'] ?? 10;
        
        // Build query
        $sql = "SELECT * FROM testimonials WHERE active = TRUE";
        $params = [];
        
        if ($featured !== null) {
            $sql .= " AND featured = :featured";
            $params[':featured'] = $featured === 'true' ? 1 : 0;
        }
        
        $sql .= " ORDER BY featured DESC, display_order ASC, created_at DESC";
        
        if ($limit && is_numeric($limit)) {
            $sql .= " LIMIT :limit";
            $params[':limit'] = (int)$limit;
        }
        
        $stmt = $db->prepare($sql);
        
        // Bind parameters
        foreach ($params as $key => $value) {
            if ($key === ':limit') {
                $stmt->bindValue($key, $value, PDO::PARAM_INT);
            } else {
                $stmt->bindValue($key, $value);
            }
        }
        
        $stmt->execute();
        $testimonials = $stmt->fetchAll();
        
        // Format testimonials for frontend
        $formattedTestimonials = array_map(function($testimonial) {
            return [
                'id' => (int)$testimonial['id'],
                'name' => $testimonial['client_name'],
                'company' => $testimonial['company'],
                'content' => $testimonial['content'],
                'rating' => (int)$testimonial['rating'],
                'orderSize' => $testimonial['order_size'],
                'country' => $testimonial['country'],
                'image' => $testimonial['image_url'],
                'featured' => (bool)$testimonial['featured'],
                'displayOrder' => (int)$testimonial['display_order'],
                'createdAt' => $testimonial['created_at']
            ];
        }, $testimonials);
        
        successResponse([
            'testimonials' => $formattedTestimonials,
            'count' => count($formattedTestimonials),
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } catch (Exception $e) {
        errorResponse('Failed to fetch testimonials: ' . $e->getMessage());
    }
}

/**
 * Create new testimonial (Admin only)
 */
function handleCreateTestimonial($db) {
    try {
        // Get JSON data
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['client_name', 'content'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                errorResponse("Missing required field: $field");
            }
        }
        
        // Validate rating
        $rating = $input['rating'] ?? 5;
        if ($rating < 1 || $rating > 5) {
            errorResponse('Rating must be between 1 and 5');
        }
        
        // Insert new testimonial
        $sql = "INSERT INTO testimonials (client_name, company, content, rating, order_size, country, image_url, featured, display_order) 
                VALUES (:client_name, :company, :content, :rating, :order_size, :country, :image_url, :featured, :display_order)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':client_name' => trim($input['client_name']),
            ':company' => trim($input['company'] ?? ''),
            ':content' => trim($input['content']),
            ':rating' => $rating,
            ':order_size' => trim($input['order_size'] ?? ''),
            ':country' => trim($input['country'] ?? ''),
            ':image_url' => trim($input['image_url'] ?? ''),
            ':featured' => $input['featured'] ?? false,
            ':display_order' => $input['display_order'] ?? 0
        ]);
        
        $testimonialId = $db->lastInsertId();
        
        successResponse([
            'id' => $testimonialId,
            'message' => 'Testimonial created successfully'
        ]);
        
    } catch (Exception $e) {
        errorResponse('Failed to create testimonial: ' . $e->getMessage());
    }
}

/**
 * Update existing testimonial (Admin only)
 */
function handleUpdateTestimonial($db) {
    try {
        // Get JSON data
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            errorResponse('Testimonial ID is required');
        }
        
        // Build update query dynamically
        $updateFields = [];
        $params = [':id' => $input['id']];
        
        $allowedFields = ['client_name', 'company', 'content', 'rating', 'order_size', 'country', 'image_url', 'featured', 'display_order', 'active'];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updateFields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }
        
        if (empty($updateFields)) {
            errorResponse('No fields to update');
        }
        
        // Validate rating if provided
        if (isset($input['rating']) && ($input['rating'] < 1 || $input['rating'] > 5)) {
            errorResponse('Rating must be between 1 and 5');
        }
        
        $sql = "UPDATE testimonials SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        
        if ($stmt->rowCount() === 0) {
            errorResponse('Testimonial not found or no changes made', 404);
        }
        
        successResponse(['message' => 'Testimonial updated successfully']);
        
    } catch (Exception $e) {
        errorResponse('Failed to update testimonial: ' . $e->getMessage());
    }
}

/**
 * Delete testimonial (Admin only)
 */
function handleDeleteTestimonial($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            errorResponse('Testimonial ID is required');
        }
        
        // Soft delete (set active = false)
        $sql = "UPDATE testimonials SET active = FALSE WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':id' => $input['id']]);
        
        if ($stmt->rowCount() === 0) {
            errorResponse('Testimonial not found', 404);
        }
        
        successResponse(['message' => 'Testimonial deleted successfully']);
        
    } catch (Exception $e) {
        errorResponse('Failed to delete testimonial: ' . $e->getMessage());
    }
}
?>