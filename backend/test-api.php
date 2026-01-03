<?php
/**
 * API Diagnostics - Test all API endpoints
 */
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>API Diagnostics</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
        .test { margin: 20px 0; padding: 15px; background: #2d2d2d; border-left: 4px solid #007acc; }
        .success { border-left-color: #22c55e; }
        .error { border-left-color: #ef4444; }
        .warning { border-left-color: #f59e0b; }
        pre { background: #1e1e1e; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🔍 API Diagnostics</h1>

<?php
require_once 'config/database.php';

// Test database connection
echo "<div class='test'>";
echo "<h3>Database Connection</h3>";
try {
    $db = getDB();
    echo "<div class='success'>✅ Connected successfully</div>";
    
    // Show which database we're using
    $stmt = $db->query("SELECT DATABASE() as db");
    $result = $stmt->fetch();
    echo "<p>Database: <strong>{$result['db']}</strong></p>";
} catch (Exception $e) {
    echo "<div class='error'>❌ Connection failed: " . $e->getMessage() . "</div>";
}
echo "</div>";

// Test each table
$tables = [
    'products',
    'testimonials',
    'slideshow_slides',
    'awards',
    'site_settings',
    'live_activity'
];

echo "<div class='test'>";
echo "<h3>Table Structure Check</h3>";
foreach ($tables as $table) {
    try {
        $stmt = $db->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            $countStmt = $db->query("SELECT COUNT(*) as count FROM $table");
            $count = $countStmt->fetch()['count'];
            echo "<div class='success'>✅ $table: $count rows</div>";
        } else {
            echo "<div class='error'>❌ $table: Table not found</div>";
        }
    } catch (Exception $e) {
        echo "<div class='error'>❌ $table: " . $e->getMessage() . "</div>";
    }
}
echo "</div>";

// Test API endpoints
$endpoints = [
    'products.php?admin=true',
    'testimonials.php',
    'slideshow.php',
    'awards.php',
    'settings.php',
    'live-activity.php'
];

echo "<div class='test'>";
echo "<h3>API Endpoint Tests</h3>";
foreach ($endpoints as $endpoint) {
    echo "<h4>Testing: $endpoint</h4>";
    
    $url = 'http://' . $_SERVER['HTTP_HOST'] . '/backend/api/' . $endpoint;
    
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 5,
            'ignore_errors' => true
        ]
    ]);
    
    $result = @file_get_contents($url, false, $context);
    
    if ($result === false) {
        echo "<div class='error'>❌ Failed to connect</div>";
    } else {
        $statusLine = $http_response_header[0] ?? 'Unknown';
        preg_match('/\d{3}/', $statusLine, $matches);
        $statusCode = $matches[0] ?? '000';
        
        if ($statusCode == '200') {
            echo "<div class='success'>✅ Status: $statusCode</div>";
            $data = json_decode($result, true);
            if ($data) {
                echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>";
            }
        } else {
            echo "<div class='error'>❌ Status: $statusCode</div>";
            echo "<pre>" . htmlspecialchars($result) . "</pre>";
        }
    }
}
echo "</div>";

?>
</body>
</html>
