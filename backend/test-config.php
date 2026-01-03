<?php
/**
 * Test Configuration - Shows first 50 lines of setup_complete.php
 */
header('Content-Type: text/plain');

echo "=== Checking setup_complete.php content ===\n\n";

$file = __DIR__ . '/setup_complete.php';
if (file_exists($file)) {
    $lines = file($file);
    echo "First 20 lines:\n";
    echo "==================\n";
    for ($i = 0; $i < min(20, count($lines)); $i++) {
        echo ($i + 1) . ": " . $lines[$i];
    }
    echo "\n==================\n";
    echo "Total lines: " . count($lines) . "\n";
} else {
    echo "File not found!\n";
}

echo "\n\n=== Checking if database.php exists ===\n";
$dbConfig = __DIR__ . '/config/database.php';
echo "Path: $dbConfig\n";
echo "Exists: " . (file_exists($dbConfig) ? 'YES' : 'NO') . "\n";
