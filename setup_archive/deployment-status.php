<?php
// Status checker for East Africom deployment
echo "<h1>East Africom Deployment Status</h1>";

// Check if deployment logs exist
if (file_exists('deployment.log')) {
    echo "<h2>Recent Deployment Log (last 20 lines):</h2>";
    echo "<pre>";
    $log = file_get_contents('deployment.log');
    $lines = explode("\n", $log);
    $recent_lines = array_slice($lines, -20);
    echo htmlspecialchars(implode("\n", $recent_lines));
    echo "</pre>";
} else {
    echo "<p>No deployment log found.</p>";
}

// Check if webhook logs exist
if (file_exists('webhook.log')) {
    echo "<h2>Recent Webhook Log (last 10 lines):</h2>";
    echo "<pre>";
    $log = file_get_contents('webhook.log');
    $lines = explode("\n", $log);
    $recent_lines = array_slice($lines, -10);
    echo htmlspecialchars(implode("\n", $recent_lines));
    echo "</pre>";
} else {
    echo "<p>No webhook log found.</p>";
}

// Manual deployment trigger with proper authentication
echo "<h2>Manual Deployment Trigger:</h2>";
echo "<form method='POST'>";
echo "<p>Secret Key: <input type='password' name='secret' placeholder='Enter deployment secret' style='width: 300px;'></p>";
echo "<p><input type='submit' name='deploy' value='Deploy Now' style='padding: 10px 20px; background: #28a745; color: white; border: none; cursor: pointer;'></p>";
echo "</form>";

if (isset($_POST['deploy']) && isset($_POST['secret'])) {
    if ($_POST['secret'] === 'EAC_Deploy_2025_5d7c8a7b9c2e4f6a1b3c8d9e2f4a6b8c') {
        echo "<h3>Triggering Deployment...</h3>";
        $deploy_url = 'https://live.eastafricom.com/deploy.php?secret=EAC_Deploy_2025_5d7c8a7b9c2e4f6a1b3c8d9e2f4a6b8c';
        
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 30
            ]
        ]);
        
        $result = file_get_contents($deploy_url, false, $context);
        echo "<pre>" . htmlspecialchars($result) . "</pre>";
    } else {
        echo "<p style='color: red;'>Invalid secret key!</p>";
    }
}
?>
