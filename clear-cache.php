<?php
/**
 * Cache Clearing Utility
 * Clears PHP opcache and other caches
 */

// Security
$secret_key = 'EAC_Deploy_2025_5d7c8a7b9c2e4f6a1b3c8d9e2f4a6b8c';
if (!isset($_GET['secret']) || $_GET['secret'] !== $secret_key) {
    die('Unauthorized access');
}

echo "<h1>East Africom - Cache Clearing</h1>";
echo "<p>Starting cache clearing process...</p>";

// Clear PHP opcache
if (function_exists('opcache_reset')) {
    if (opcache_reset()) {
        echo "<p>✅ PHP Opcache cleared successfully</p>";
    } else {
        echo "<p>⚠️ PHP Opcache clear failed</p>";
    }
    
    // Show opcache status
    if (function_exists('opcache_get_status')) {
        $status = opcache_get_status();
        echo "<p>Opcache Status:</p>";
        echo "<ul>";
        echo "<li>Enabled: " . ($status['opcache_enabled'] ? 'Yes' : 'No') . "</li>";
        echo "<li>Cache Full: " . ($status['cache_full'] ? 'Yes' : 'No') . "</li>";
        echo "<li>Scripts Cached: " . $status['opcache_statistics']['num_cached_scripts'] . "</li>";
        echo "</ul>";
    }
} else {
    echo "<p>ℹ️ PHP Opcache not available on this server</p>";
}

// Clear realpath cache
clearstatcache(true);
echo "<p>✅ Realpath cache cleared</p>";

// Check if APCu is available
if (function_exists('apcu_clear_cache')) {
    if (apcu_clear_cache()) {
        echo "<p>✅ APCu cache cleared successfully</p>";
    } else {
        echo "<p>⚠️ APCu cache clear failed</p>";
    }
} else {
    echo "<p>ℹ️ APCu not available on this server</p>";
}

// Create timestamp file for verification
$timestamp = date('Y-m-d H:i:s');
file_put_contents('cache-clear.log', "$timestamp - Cache cleared\n", FILE_APPEND);

echo "<hr>";
echo "<h2>✅ Cache Clearing Complete!</h2>";
echo "<p><strong>Timestamp:</strong> $timestamp</p>";
echo "<p><a href='.' style='background: #28a745; color: white; padding: 10px 20px; text-decoration: none;'>← Back to Site</a></p>";
?>
