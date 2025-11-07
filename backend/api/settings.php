<?php
/**
 * Site Settings API Endpoint
 * Returns configurable site settings
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
            handleGetSettings($db);
            break;
        case 'POST':
            handleUpdateSettings($db);
            break;
        default:
            errorResponse('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    errorResponse('Server error: ' . $e->getMessage(), 500);
}

/**
 * Get site settings
 */
function handleGetSettings($db) {
    try {
        // Get category filter
        $category = $_GET['category'] ?? null;
        
        // Build query
        $sql = "SELECT setting_key, setting_value, setting_type, description, category FROM site_settings";
        $params = [];
        
        if ($category) {
            $sql .= " WHERE category = :category";
            $params[':category'] = $category;
        }
        
        $sql .= " ORDER BY category, setting_key";
        
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $settings = $stmt->fetchAll();
        
        // Format settings for frontend
        $formattedSettings = [];
        $groupedSettings = [];
        
        foreach ($settings as $setting) {
            // Convert value based on type
            $value = $setting['setting_value'];
            switch ($setting['setting_type']) {
                case 'number':
                    $value = is_numeric($value) ? (float)$value : 0;
                    break;
                case 'boolean':
                    $value = in_array(strtolower($value), ['true', '1', 'yes']);
                    break;
                case 'json':
                    $value = json_decode($value, true) ?? $value;
                    break;
                default:
                    $value = (string)$value;
            }
            
            $formattedSettings[$setting['setting_key']] = $value;
            
            // Group by category for admin interface
            $groupedSettings[$setting['category']][] = [
                'key' => $setting['setting_key'],
                'value' => $value,
                'type' => $setting['setting_type'],
                'description' => $setting['description']
            ];
        }
        
        successResponse([
            'settings' => $formattedSettings,
            'grouped' => $groupedSettings,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } catch (Exception $e) {
        errorResponse('Failed to fetch settings: ' . $e->getMessage());
    }
}

/**
 * Update site settings (Admin only)
 */
function handleUpdateSettings($db) {
    try {
        // Get JSON data
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input)) {
            errorResponse('No settings provided');
        }
        
        $updated = 0;
        $errors = [];
        
        foreach ($input as $key => $value) {
            try {
                // Get setting type
                $typeQuery = "SELECT setting_type FROM site_settings WHERE setting_key = :key";
                $typeStmt = $db->prepare($typeQuery);
                $typeStmt->execute([':key' => $key]);
                $setting = $typeStmt->fetch();
                
                if (!$setting) {
                    $errors[] = "Setting '$key' not found";
                    continue;
                }
                
                // Convert value to appropriate format for storage
                $storageValue = $value;
                switch ($setting['setting_type']) {
                    case 'boolean':
                        $storageValue = $value ? 'true' : 'false';
                        break;
                    case 'json':
                        $storageValue = json_encode($value);
                        break;
                    default:
                        $storageValue = (string)$value;
                }
                
                // Update setting
                $updateQuery = "UPDATE site_settings SET setting_value = :value WHERE setting_key = :key";
                $updateStmt = $db->prepare($updateQuery);
                $updateStmt->execute([
                    ':value' => $storageValue,
                    ':key' => $key
                ]);
                
                if ($updateStmt->rowCount() > 0) {
                    $updated++;
                }
                
            } catch (Exception $e) {
                $errors[] = "Error updating '$key': " . $e->getMessage();
            }
        }
        
        if ($updated > 0) {
            $response = ['message' => "$updated setting(s) updated successfully"];
            if (!empty($errors)) {
                $response['warnings'] = $errors;
            }
            successResponse($response);
        } else {
            errorResponse('No settings were updated. ' . implode(', ', $errors));
        }
        
    } catch (Exception $e) {
        errorResponse('Failed to update settings: ' . $e->getMessage());
    }
}
?>