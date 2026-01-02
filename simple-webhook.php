<?php
// Simple webhook handler for GitHub
header('Content-Type: application/json');

// Configuration
$secret_key = 'eastafricom_webhook_secret_2025';
$deploy_secret = 'EAC_Deploy_2025_5d7c8a7b9c2e4f6a1b3c8d9e2f4a6b8c';

// Log function
function logWebhook($message) {
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents('simple-webhook.log', "[$timestamp] $message\n", FILE_APPEND);
}

try {
    // Get the payload
    $payload = file_get_contents('php://input');
    $data = json_decode($payload, true);
    
    // Verify GitHub signature
    $signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
    $expected_signature = 'sha256=' . hash_hmac('sha256', $payload, $secret_key);
    
    if (!hash_equals($expected_signature, $signature)) {
        logWebhook("Invalid signature");
        http_response_code(403);
        echo json_encode(['error' => 'Invalid signature']);
        exit;
    }
    
    // Check if it's a push to main branch
    if ($data['ref'] !== 'refs/heads/main') {
        logWebhook("Ignoring push to " . $data['ref']);
        echo json_encode(['message' => 'Ignoring non-main branch']);
        exit;
    }
    
    logWebhook("Valid push to main branch received");
    
    // Trigger deployment
    $deploy_url = 'https://live.eastafricom.com/simple-deploy.php?secret=' . urlencode($deploy_secret);
    
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 60
        ]
    ]);
    
    $result = file_get_contents($deploy_url, false, $context);
    
    if ($result !== false) {
        logWebhook("Deployment triggered successfully");
        echo json_encode(['success' => true, 'message' => 'Deployment triggered']);
    } else {
        logWebhook("Failed to trigger deployment");
        echo json_encode(['success' => false, 'message' => 'Failed to trigger deployment']);
    }
    
} catch (Exception $e) {
    logWebhook("Webhook error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>