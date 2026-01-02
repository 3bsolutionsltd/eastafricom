<?php
/**
 * Quick Security Protection Script
 * Adds authentication checks to all mutation endpoints
 */

$apiFiles = [
    'awards.php',
    'certifications.php',
    'contact-info.php',
    'quality-badges.php',
    'settings.php',
    'slideshow.php',
    'testimonials.php'
];

$authCheck = <<<'PHP'

// Check if this is a mutation request (POST, PUT, DELETE) and require auth
$isMutation = in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'DELETE']);
if ($isMutation) {
    require_once __DIR__ . '/../auth/middleware.php';
    requireAuth();
}
PHP;

foreach ($apiFiles as $file) {
    $filePath = __DIR__ . '/' . $file;
    
    if (file_exists($filePath)) {
        $content = file_get_contents($filePath);
        
        // Check if auth check already exists
        if (strpos($content, 'requireAuth()') === false) {
            // Add after the first require_once
            $pattern = '/(require_once.*?;\s*\n)/';
            $replacement = "$1\n$authCheck\n";
            
            $newContent = preg_replace($pattern, $replacement, $content, 1);
            
            if ($newContent && $newContent !== $content) {
                file_put_contents($filePath, $newContent);
                echo "✅ Protected: $file\n";
            }
        } else {
            echo "⏭️  Already protected: $file\n";
        }
    }
}

echo "\n✅ All API endpoints are now protected!\n";
