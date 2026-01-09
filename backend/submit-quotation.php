<?php
/**
 * Quotation Request Submission Handler
 * East Africom - Coffee & Cocoa Export
 */

// Start output buffering to catch any stray output
ob_start();

// Disable error display and only log errors
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON data
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Validate required fields
$required = ['product', 'quantity', 'company', 'contactName', 'email', 'phone'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize data
$product = htmlspecialchars($data['product']);
$productId = htmlspecialchars($data['productId']);
$quantity = htmlspecialchars($data['quantity']);
$shipping = htmlspecialchars($data['shipping'] ?? 'FOB');
$company = htmlspecialchars($data['company']);
$country = htmlspecialchars($data['country'] ?? 'Not specified');
$contactName = htmlspecialchars($data['contactName']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars($data['phone']);
$requirements = htmlspecialchars($data['requirements'] ?? 'None');
$certifications = isset($data['certifications']) ? implode(', ', $data['certifications']) : 'None';
$timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Prepare email to business
$to = 'frank.asiimwe@eastafricom.com';
$subject = "New Quotation Request - $product";

$message = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; color: #10b981; margin-bottom: 10px; border-bottom: 2px solid #10b981; padding-bottom: 5px; }
        .info-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .label { font-weight: bold; display: inline-block; width: 150px; }
        .value { color: #1f2937; }
        .footer { background: #1f2937; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        .urgent { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🚀 NEW QUOTATION REQUEST</h2>
        </div>
        <div class='content'>
            <div class='urgent'>
                <strong>⚡ Action Required:</strong> New quotation request received. Please respond within 2 hours.
            </div>
            
            <div class='section'>
                <div class='section-title'>📦 PRODUCT DETAILS</div>
                <div class='info-row'><span class='label'>Product:</span> <span class='value'>$product</span></div>
                <div class='info-row'><span class='label'>Quantity:</span> <span class='value'>$quantity MT (Metric Tons)</span></div>
                <div class='info-row'><span class='label'>Shipping Terms:</span> <span class='value'>$shipping</span></div>
                <div class='info-row'><span class='label'>Certifications:</span> <span class='value'>$certifications</span></div>
            </div>
            
            <div class='section'>
                <div class='section-title'>🏢 COMPANY INFORMATION</div>
                <div class='info-row'><span class='label'>Company Name:</span> <span class='value'>$company</span></div>
                <div class='info-row'><span class='label'>Country:</span> <span class='value'>$country</span></div>
            </div>
            
            <div class='section'>
                <div class='section-title'>👤 CONTACT PERSON</div>
                <div class='info-row'><span class='label'>Name:</span> <span class='value'>$contactName</span></div>
                <div class='info-row'><span class='label'>Email:</span> <span class='value'><a href='mailto:$email'>$email</a></span></div>
                <div class='info-row'><span class='label'>Phone:</span> <span class='value'>$phone</span></div>
            </div>
            
            <div class='section'>
                <div class='section-title'>📝 ADDITIONAL REQUIREMENTS</div>
                <p style='padding: 10px; background: white; border-radius: 4px;'>$requirements</p>
            </div>
            
            <div class='section'>
                <div class='section-title'>⏰ REQUEST DETAILS</div>
                <div class='info-row'><span class='label'>Submitted:</span> <span class='value'>$timestamp</span></div>
                <div class='info-row'><span class='label'>Product ID:</span> <span class='value'>$productId</span></div>
            </div>
        </div>
        <div class='footer'>
            East Africom Consults - Premium Coffee & Cocoa Exports<br>
            Respond to this request by replying directly to: $email
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: East Africom Website <noreply@eastafricom.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Configure PHP to use SMTP (for Test Mail Server Tool)
// Default SMTP settings - can be overridden in php.ini
ini_set('SMTP', 'localhost');
ini_set('smtp_port', '25');
ini_set('sendmail_from', 'noreply@eastafricom.com');

// Send email
try {
    $mailSent = @mail($to, $subject, $message, $headers);
} catch (Exception $e) {
    error_log("Mail error: " . $e->getMessage());
    $mailSent = false;
}

// Send confirmation email to customer
$customerSubject = "Quotation Request Received - East Africom";
$customerMessage = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #1f2937; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>✅ Quotation Request Confirmed</h2>
        </div>
        <div class='content'>
            <p>Dear $contactName,</p>
            
            <p>Thank you for your interest in <strong>$product</strong>!</p>
            
            <div class='highlight'>
                <strong>What happens next?</strong><br>
                Our team will review your request and send you a detailed quotation within <strong>2 hours</strong> during business hours.
            </div>
            
            <p><strong>Your Request Summary:</strong></p>
            <ul>
                <li>Product: $product</li>
                <li>Quantity: $quantity MT</li>
                <li>Shipping: $shipping</li>
                <li>Company: $company</li>
            </ul>
            
            <p>If you have any urgent questions, please contact us directly:</p>
            <ul>
                <li>📧 Email: frank.asiimwe@eastafricom.com</li>
                <li>📱 Phone/WhatsApp: +256-776-701-003</li>
            </ul>
            
            <p>Best regards,<br>
            <strong>Frank Asiimwe</strong><br>
            Managing Director<br>
            East Africom Consults</p>
        </div>
        <div class='footer'>
            East Africom Consults - Premium Coffee & Cocoa Exports from East Africa<br>
            Kampala, Uganda | www.eastafricom.com
        </div>
    </div>
</body>
</html>
";

$customerHeaders = "MIME-Version: 1.0\r\n";
$customerHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
$customerHeaders .= "From: East Africom <frank.asiimwe@eastafricom.com>\r\n";
$customerHeaders .= "Reply-To: frank.asiimwe@eastafricom.com\r\n";

try {
    @mail($email, $customerSubject, $customerMessage, $customerHeaders);
} catch (Exception $e) {
    error_log("Customer mail error: " . $e->getMessage());
}

// Optional: Save to database (uncomment if you have a database setup)
/*
try {
    $db = new PDO('mysql:host=localhost;dbname=eastafricom', 'username', 'password');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $db->prepare("
        INSERT INTO quotation_requests 
        (product, product_id, quantity, shipping, certifications, company, country, 
         contact_name, email, phone, requirements, timestamp, status) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ");
    
    $stmt->execute([
        $product, $productId, $quantity, $shipping, $certifications, 
        $company, $country, $contactName, $email, $phone, $requirements, $timestamp
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
}
*/

// Clean output buffer BEFORE sending JSON
if (ob_get_level()) {
    ob_end_clean();
}

// Return success response
// Always return success if data was received, even if email fails
// This ensures JSON response is always valid
echo json_encode([
    'success' => true,
    'message' => 'Quotation request received successfully. We will contact you within 2 hours.',
    'requestId' => uniqid('QR-', true),
    'emailSent' => $mailSent
]);

exit;
