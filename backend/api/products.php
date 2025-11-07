<?php
/**
 * Products API Endpoint
 * Returns all active products with current pricing and stock information
 */

// Include database configuration
require_once '../config/database.php';

// Set CORS headers
setCORSHeaders();

try {
    // Get database connection
    $db = getDB();
    
    // Handle different HTTP methods
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            handleGetProducts($db);
            break;
        case 'POST':
            handleCreateProduct($db);
            break;
        case 'PUT':
            handleUpdateProduct($db);
            break;
        case 'DELETE':
            handleDeleteProduct($db);
            break;
        default:
            errorResponse('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    errorResponse('Server error: ' . $e->getMessage(), 500);
}

/**
 * Get all active products
 */
function handleGetProducts($db) {
    try {
        // Get filter parameters
        $category = $_GET['category'] ?? null;
        $featured = $_GET['featured'] ?? null;
        $limit = $_GET['limit'] ?? null;
        
        // Build query
        $sql = "SELECT * FROM products WHERE active = TRUE";
        $params = [];
        
        if ($category) {
            $sql .= " AND category = :category";
            $params[':category'] = $category;
        }
        
        if ($featured !== null) {
            $sql .= " AND featured = :featured";
            $params[':featured'] = $featured === 'true' ? 1 : 0;
        }
        
        $sql .= " ORDER BY featured DESC, name ASC";
        
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
        $products = $stmt->fetchAll();
        
        // Format products for frontend
        $formattedProducts = array_map(function($product) {
            return [
                'id' => (int)$product['id'],
                'name' => $product['name'],
                'price' => (float)$product['price'],
                'stock' => (int)$product['stock_quantity'],
                'grade' => $product['grade'],
                'description' => $product['description'],
                'image' => $product['image_url'],
                'category' => $product['category'],
                'featured' => (bool)$product['featured'],
                'lastUpdated' => $product['last_updated']
            ];
        }, $products);
        
        successResponse([
            'products' => $formattedProducts,
            'count' => count($formattedProducts),
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } catch (Exception $e) {
        errorResponse('Failed to fetch products: ' . $e->getMessage());
    }
}

/**
 * Create new product (Admin only)
 */
function handleCreateProduct($db) {
    try {
        // Get JSON data
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['name', 'price', 'stock_quantity', 'category'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                errorResponse("Missing required field: $field");
            }
        }
        
        // Insert new product
        $sql = "INSERT INTO products (name, price, stock_quantity, grade, description, image_url, category, featured) 
                VALUES (:name, :price, :stock, :grade, :description, :image, :category, :featured)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':name' => $input['name'],
            ':price' => $input['price'],
            ':stock' => $input['stock_quantity'],
            ':grade' => $input['grade'] ?? '',
            ':description' => $input['description'] ?? '',
            ':image' => $input['image_url'] ?? '',
            ':category' => $input['category'],
            ':featured' => $input['featured'] ?? false
        ]);
        
        $productId = $db->lastInsertId();
        
        successResponse([
            'id' => $productId,
            'message' => 'Product created successfully'
        ]);
        
    } catch (Exception $e) {
        errorResponse('Failed to create product: ' . $e->getMessage());
    }
}

/**
 * Update existing product (Admin only)
 */
function handleUpdateProduct($db) {
    try {
        // Get JSON data
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            errorResponse('Product ID is required');
        }
        
        // Build update query dynamically
        $updateFields = [];
        $params = [':id' => $input['id']];
        
        $allowedFields = ['name', 'price', 'stock_quantity', 'grade', 'description', 'image_url', 'category', 'featured', 'active'];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updateFields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }
        
        if (empty($updateFields)) {
            errorResponse('No fields to update');
        }
        
        $sql = "UPDATE products SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        
        if ($stmt->rowCount() === 0) {
            errorResponse('Product not found or no changes made', 404);
        }
        
        successResponse(['message' => 'Product updated successfully']);
        
    } catch (Exception $e) {
        errorResponse('Failed to update product: ' . $e->getMessage());
    }
}

/**
 * Delete product (Admin only)
 */
function handleDeleteProduct($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            errorResponse('Product ID is required');
        }
        
        // Soft delete (set active = false)
        $sql = "UPDATE products SET active = FALSE WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':id' => $input['id']]);
        
        if ($stmt->rowCount() === 0) {
            errorResponse('Product not found', 404);
        }
        
        successResponse(['message' => 'Product deleted successfully']);
        
    } catch (Exception $e) {
        errorResponse('Failed to delete product: ' . $e->getMessage());
    }
}
?>