<?php
/**
 * Force update section settings
 */

$settingsFile = __DIR__ . '/backend/section_settings.json';

$settings = [
    'hero' => true,
    'trustWidget' => true,
    'about' => true,
    'greenProcess' => true,
    'greenServices' => false,
    'products' => false,  // FORCE OFF
    'awards' => false,     // FORCE OFF
    'testimonials' => false,
    'contact' => true
];

// Write to file
file_put_contents($settingsFile, json_encode($settings, JSON_PRETTY_PRINT));

// Clear all caches
if (function_exists('opcache_reset')) {
    opcache_reset();
}
clearstatcache(true, $settingsFile);

// Read back to verify
$readBack = json_decode(file_get_contents($settingsFile), true);

echo "<h1>Settings Force Updated</h1>";
echo "<p>Written to: " . $settingsFile . "</p>";
echo "<pre>" . json_encode($readBack, JSON_PRETTY_PRINT) . "</pre>";
echo "<p>Products value: " . ($readBack['products'] ? 'TRUE' : 'FALSE') . "</p>";
echo "<p>Awards value: " . ($readBack['awards'] ? 'TRUE' : 'FALSE') . "</p>";
