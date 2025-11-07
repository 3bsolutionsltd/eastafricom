<?php
/**
 * GitHub Webhook Handler for East Africom
 * Receives webhook calls from GitHub and triggers deployment
 * 
 * Setup: Add this URL to GitHub webhook: https://live.eastafricom.com/webhook.php
 */

// Configuration
$webhook_secret = 'eastafricom_webhook_secret_2025'; // CHANGE THIS!
$deploy_secret = 'EAC_Deploy_2025_' . md5('eastafricom_secure_key');
$allowed_branch = 'main';

function logWebhook($message) {
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents('webhook.log', "[$timestamp] $message\n", FILE_APPEND | LOCK_EX);
}

function verifyGitHubSignature($payload, $signature, $secret) {
    $calculated = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    return hash_equals($calculated, $signature);
}

function triggerDeployment($secret) {
    $url = "https://{$_SERVER['HTTP_HOST']}/deploy.php?secret=" . urlencode($secret);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 300);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['response' => $response, 'http_code' => $http_code];
}

header('Content-Type: application/json');

try {
    // Get payload and signature
    $payload = file_get_contents('php://input');
    $signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
    
    logWebhook("Webhook received from " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    
    // Verify signature
    if (!verifyGitHubSignature($payload, $signature, $webhook_secret)) {
        logWebhook("Invalid signature - rejected");
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Invalid signature']);
        exit;
    }
    
    $data = json_decode($payload, true);
    if (!$data) {
        logWebhook("Invalid JSON payload");
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid payload']);
        exit;
    }
    
    // Check if push event
    if (!isset($data['ref'])) {
        logWebhook("Not a push event - ignoring");
        echo json_encode(['success' => true, 'message' => 'Event ignored']);
        exit;
    }
    
    // Extract branch
    $branch = str_replace('refs/heads/', '', $data['ref']);
    logWebhook("Push to branch: $branch");
    
    // Only deploy from main branch
    if ($branch !== $allowed_branch) {
        logWebhook("Branch $branch not configured for deployment");
        echo json_encode(['success' => true, 'message' => "Branch $branch ignored"]);
        exit;
    }
    
    // Get commit info
    $commit = $data['after'] ?? 'unknown';
    $message = $data['head_commit']['message'] ?? 'No message';
    $author = $data['head_commit']['author']['name'] ?? 'Unknown';
    
    logWebhook("Deploying commit $commit by $author: $message");
    
    // Trigger deployment
    $result = triggerDeployment($deploy_secret);
    
    if ($result['http_code'] === 200) {
        $deploy_response = json_decode($result['response'], true);
        
        if ($deploy_response && $deploy_response['success']) {
            logWebhook("Deployment completed successfully");
            echo json_encode([
                'success' => true,
                'message' => 'Deployment completed',
                'commit' => $commit,
                'author' => $author
            ]);
        } else {
            logWebhook("Deployment failed");
            echo json_encode([
                'success' => false,
                'message' => 'Deployment failed',
                'error' => $deploy_response['message'] ?? 'Unknown error'
            ]);
        }
    } else {
        logWebhook("Failed to trigger deployment");
        echo json_encode([
            'success' => false,
            'message' => 'Failed to trigger deployment'
        ]);
    }

} catch (Exception $e) {
    logWebhook("Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Webhook error']);
}
?>
