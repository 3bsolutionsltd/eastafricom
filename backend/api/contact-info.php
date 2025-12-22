<?php
/**
 * Contact Information API
 * Manage company contact details and address
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get database connection
$db = getDB();

// GET - Retrieve contact information
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM contact_info ORDER BY id DESC LIMIT 1");
        $contact = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($contact) {
            echo json_encode([
                'success' => true,
                'contact' => $contact
            ]);
        } else {
            // Return defaults if no data exists
            echo json_encode([
                'success' => true,
                'contact' => [
                    'street_address' => 'Mulago - Kampala',
                    'po_box' => '421481 - Mbarara',
                    'city' => 'Kampala',
                    'country' => 'UGANDA',
                    'primary_phone' => '+256 776 701 003',
                    'secondary_phone' => '+256 754 701 003',
                    'whatsapp_phone' => '+256 776 701 003',
                    'primary_email' => 'frank.asiimwe@eastafricom.com',
                    'secondary_email' => '',
                    'facebook_link' => '',
                    'twitter_link' => '',
                    'linkedin_link' => '',
                    'instagram_link' => '',
                    'years_experience' => '5yrs+',
                    'export_tonnage' => '200+ tons'
                ]
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
    exit;
}

// POST/PUT - Update contact information
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON data'
        ]);
        exit;
    }
    
    try {
        // Check if contact info exists
        $stmt = $db->query("SELECT id FROM contact_info LIMIT 1");
        $existing = $stmt->fetch();
        
        if ($existing) {
            // Update existing record
            $sql = "UPDATE contact_info SET 
                    street_address = :street_address,
                    po_box = :po_box,
                    city = :city,
                    country = :country,
                    primary_phone = :primary_phone,
                    secondary_phone = :secondary_phone,
                    whatsapp_phone = :whatsapp_phone,
                    primary_email = :primary_email,
                    secondary_email = :secondary_email,
                    facebook_link = :facebook_link,
                    twitter_link = :twitter_link,
                    linkedin_link = :linkedin_link,
                    instagram_link = :instagram_link,
                    years_experience = :years_experience,
                    export_tonnage = :export_tonnage,
                    updated_at = CURRENT_TIMESTAMP
                    WHERE id = :id";
            
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':id' => $existing['id'],
                ':street_address' => $input['street_address'] ?? '',
                ':po_box' => $input['po_box'] ?? '',
                ':city' => $input['city'] ?? '',
                ':country' => $input['country'] ?? '',
                ':primary_phone' => $input['primary_phone'] ?? '',
                ':secondary_phone' => $input['secondary_phone'] ?? '',
                ':whatsapp_phone' => $input['whatsapp_phone'] ?? '',
                ':primary_email' => $input['primary_email'] ?? '',
                ':secondary_email' => $input['secondary_email'] ?? '',
                ':facebook_link' => $input['facebook_link'] ?? '',
                ':twitter_link' => $input['twitter_link'] ?? '',
                ':linkedin_link' => $input['linkedin_link'] ?? '',
                ':instagram_link' => $input['instagram_link'] ?? '',
                ':years_experience' => $input['years_experience'] ?? '5yrs+',
                ':export_tonnage' => $input['export_tonnage'] ?? '200+ tons'
            ]);
        } else {
            // Insert new record
            $sql = "INSERT INTO contact_info (
                    street_address, po_box, city, country,
                    primary_phone, secondary_phone, whatsapp_phone,
                    primary_email, secondary_email,
                    facebook_link, twitter_link, linkedin_link, instagram_link,
                    years_experience, export_tonnage
                ) VALUES (
                    :street_address, :po_box, :city, :country,
                    :primary_phone, :secondary_phone, :whatsapp_phone,
                    :primary_email, :secondary_email,
                    :facebook_link, :twitter_link, :linkedin_link, :instagram_link,
                    :years_experience, :export_tonnage
                )";
            
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':street_address' => $input['street_address'] ?? '',
                ':po_box' => $input['po_box'] ?? '',
                ':city' => $input['city'] ?? '',
                ':country' => $input['country'] ?? '',
                ':primary_phone' => $input['primary_phone'] ?? '',
                ':secondary_phone' => $input['secondary_phone'] ?? '',
                ':whatsapp_phone' => $input['whatsapp_phone'] ?? '',
                ':primary_email' => $input['primary_email'] ?? '',
                ':secondary_email' => $input['secondary_email'] ?? '',
                ':facebook_link' => $input['facebook_link'] ?? '',
                ':twitter_link' => $input['twitter_link'] ?? '',
                ':linkedin_link' => $input['linkedin_link'] ?? '',
                ':instagram_link' => $input['instagram_link'] ?? '',
                ':years_experience' => $input['years_experience'] ?? '5yrs+',
                ':export_tonnage' => $input['export_tonnage'] ?? '200+ tons'
            ]);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Contact information updated successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
    exit;
}

// Invalid method
http_response_code(405);
echo json_encode([
    'success' => false,
    'error' => 'Method not allowed'
]);
