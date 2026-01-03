<?php
/**
 * Test Configuration - Clear cache and check files
 */

// Clear opcache if available
if (function_exists('opcache_reset')) {
    opcache_reset();
    echo "OPcache cleared!\n\n";
}

echo "=== Checking setup_complete.php ===\n";
$file = __DIR__ . '/setup_complete.php';
echo "File exists: " . (file_exists($file) ? 'YES' : 'NO') . "\n";
echo "File modified: " . date('Y-m-d H:i:s', filemtime($file)) . "\n";
echo "File size: " . filesize($file) . " bytes\n\n";

// Show first 30 lines
$content = file_get_contents($file);
$lines = explode("\n", $content);
echo "First 30 lines:\n";
echo str_repeat("=", 80) . "\n";
for ($i = 0; $i < min(30, count($lines)); $i++) {
    printf("%3d: %s\n", $i + 1, $lines[$i]);
}
echo str_repeat("=", 80) . "\n";

// Check for database.php
echo "\n=== Database config ===\n";
$dbFile = __DIR__ . '/config/database.php';
echo "Exists: " . (file_exists($dbFile) ? 'YES' : 'NO') . "\n";

// Look for 'root' or 'getDB' in first 30 lines
$hasRoot = false;
$hasGetDB = false;
for ($i = 0; $i < min(30, count($lines)); $i++) {
    if (stripos($lines[$i], 'root') !== false) $hasRoot = true;
    if (stripos($lines[$i], 'getDB') !== false) $hasGetDB = true;
}

echo "\n=== Analysis ===\n";
echo "Contains 'root': " . ($hasRoot ? 'YES - OLD VERSION' : 'NO - UPDATED') . "\n";
echo "Contains 'getDB': " . ($hasGetDB ? 'YES - UPDATED' : 'NO - OLD VERSION') . "\n";

