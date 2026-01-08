<?php
/**
 * Clear All Caches - Admin Tool
 * Clears PHP OPcache and sends cache-busting headers
 */

// Require authentication
session_start();
require_once __DIR__ . '/../backend/auth/auth.php';

$auth = new Auth();
if (!$auth->isAuthenticated()) {
    die('Unauthorized');
}

$results = [];

// 1. Clear PHP OPcache
if (function_exists('opcache_reset')) {
    opcache_reset();
    $results[] = '✅ OPcache cleared';
} else {
    $results[] = '⚠️ OPcache not available';
}

// 2. Clear realpath cache
clearstatcache(true);
$results[] = '✅ Realpath cache cleared';

// 3. Send cache-busting headers
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');

// 4. Generate new version timestamp
$versionFile = __DIR__ . '/cache-version.txt';
$newVersion = time();
file_put_contents($versionFile, $newVersion);
$results[] = '✅ New cache version: ' . $newVersion;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cache Cleared</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #2d3748; margin-top: 0; }
        .result {
            padding: 10px;
            margin: 10px 0;
            background: #e6ffed;
            border-left: 4px solid #22c55e;
            border-radius: 4px;
        }
        .warning {
            background: #fff3cd;
            border-left-color: #ffc107;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
        .button:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧹 Cache Cleared Successfully</h1>
        
        <?php foreach ($results as $result): ?>
            <div class="result <?php echo strpos($result, '⚠️') !== false ? 'warning' : ''; ?>">
                <?php echo htmlspecialchars($result); ?>
            </div>
        <?php endforeach; ?>
        
        <p><strong>Next steps:</strong></p>
        <ol>
            <li>Close all browser tabs for this site</li>
            <li>Clear your browser cache (Ctrl+Shift+Delete)</li>
            <li>Open admin panel in a new incognito/private window</li>
        </ol>
        
        <a href="index.html?v=<?php echo $newVersion; ?>" class="button">Back to Admin Panel</a>
    </div>
</body>
</html>
