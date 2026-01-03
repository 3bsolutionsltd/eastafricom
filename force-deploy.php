<?php
/**
 * Force Fresh Deployment - No Cache Version
 * This script ensures fresh deployment by sending cache-busting headers
 */

// Send aggressive no-cache headers
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');
header('Content-Type: text/html; charset=utf-8');

echo "<h1>East Africom - Force Fresh Deployment</h1>";

// Configuration
$github_api_url = 'https://api.github.com/repos/3bsolutionsltd/eastafricom/zipball/main';
$temp_dir = 'temp_deploy_' . time(); // Unique temp dir
$secret_key = 'EAC_Deploy_2025_5d7c8a7b9c2e4f6a1b3c8d9e2f4a6b8c';

// Check authentication
if (!isset($_GET['secret']) || $_GET['secret'] !== $secret_key) {
    die('Unauthorized access');
}

function logMessage($message) {
    $timestamp = date('Y-m-d H:i:s');
    $micro = microtime(true);
    echo "<p>[$timestamp.$micro] $message</p>";
    flush();
    ob_flush();
}

// Start output buffering to prevent early cache
ob_start();

logMessage("Starting FRESH deployment with timestamp: " . time());

try {
    // Clear opcache first
    if (function_exists('opcache_reset')) {
        opcache_reset();
        logMessage("Opcache cleared");
    }
    
    // Step 1: Download repository as ZIP
    logMessage("Downloading repository from GitHub...");
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $github_api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'EastAfricom-Deploy/2.0');
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $zip_content = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    if ($zip_content === false || $http_code !== 200) {
        throw new Exception("Failed to download repository (HTTP $http_code): $curl_error");
    }
    
    logMessage("Repository downloaded: " . strlen($zip_content) . " bytes");
    
    // Step 2: Save and extract ZIP
    $zip_file = 'repo_' . time() . '.zip';
    file_put_contents($zip_file, $zip_content);
    logMessage("ZIP saved: $zip_file");
    
    // Step 3: Extract ZIP
    $zip = new ZipArchive;
    if ($zip->open($zip_file) === TRUE) {
        $zip->extractTo($temp_dir);
        $extracted_files = $zip->numFiles;
        $zip->close();
        logMessage("Extracted $extracted_files files to $temp_dir");
    } else {
        throw new Exception("Failed to extract ZIP file");
    }
    
    // Step 4: Find the extracted folder
    $extracted_folders = glob($temp_dir . '/*', GLOB_ONLYDIR);
    if (empty($extracted_folders)) {
        throw new Exception("No extracted folder found");
    }
    $source_folder = $extracted_folders[0];
    logMessage("Source folder: $source_folder");
    
    // Step 5: Copy files
    logMessage("Copying website files...");
    
    $files_to_skip = [
        'simple-deploy.php', 
        'deploy.php', 
        'webhook.php', 
        'deployment.log', 
        'webhook.log',
        'force-deploy.php', // Don't overwrite this file
        'clear-cache.php',
        'deployment-version.php'
    ];
    
    $copied_count = 0;
    $skipped_count = 0;
    
    function copyFiles($source, $dest, $skip_files, &$copied, &$skipped) {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($iterator as $item) {
            $relative_path = $iterator->getSubPathName();
            
            // Skip deployment scripts and logs
            $should_skip = false;
            foreach ($skip_files as $skip_file) {
                if (strpos($relative_path, $skip_file) !== false) {
                    $should_skip = true;
                    $skipped++;
                    break;
                }
            }
            
            if ($should_skip) continue;
            
            $target = $dest . DIRECTORY_SEPARATOR . $relative_path;
            
            if ($item->isDir()) {
                if (!is_dir($target)) {
                    mkdir($target, 0755, true);
                }
            } else {
                copy($item, $target);
                chmod($target, 0644);
                $copied++;
            }
        }
    }
    
    copyFiles($source_folder, '.', $files_to_skip, $copied_count, $skipped_count);
    logMessage("Copied $copied_count files, skipped $skipped_count files");
    
    // Step 6: Set permissions
    logMessage("Setting file permissions...");
    chmod('.', 0755);
    
    $directories = ['admin', 'backend', 'css', 'images', 'js', 'pages'];
    foreach ($directories as $dir) {
        if (is_dir($dir)) {
            chmod($dir, 0755);
        }
    }
    
    // Step 7: Clear all caches
    logMessage("Clearing caches...");
    if (function_exists('opcache_reset')) {
        opcache_reset();
        logMessage("Opcache cleared again after deployment");
    }
    clearstatcache(true);
    
    // Step 8: Verify specific files
    logMessage("Verifying deployed files...");
    $verify_files = [
        'admin/section-manager.js',
        'js/section-manager.js',
        'index.html'
    ];
    foreach ($verify_files as $file) {
        if (file_exists($file)) {
            $size = filesize($file);
            $modified = date('Y-m-d H:i:s', filemtime($file));
            logMessage("✓ $file: $size bytes, modified $modified");
        } else {
            logMessage("✗ $file: NOT FOUND");
        }
    }
    
    // Step 9: Clean up temporary files
    logMessage("Cleaning up temporary files...");
    
    function deleteDirectory($dir) {
        if (!is_dir($dir)) return;
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . DIRECTORY_SEPARATOR . $file;
            if (is_dir($path)) {
                deleteDirectory($path);
            } else {
                unlink($path);
            }
        }
        rmdir($dir);
    }
    
    deleteDirectory($temp_dir);
    unlink($zip_file);
    logMessage("Cleanup complete");
    
    logMessage("✅ DEPLOYMENT COMPLETED SUCCESSFULLY!");
    
    echo "<hr>";
    echo "<h2>🎉 Deployment Successful!</h2>";
    echo "<p><strong>Timestamp:</strong> " . date('Y-m-d H:i:s') . "</p>";
    echo "<p><strong>Files copied:</strong> $copied_count</p>";
    echo "<p><a href='index.html?v=" . time() . "' style='background: #28a745; color: white; padding: 10px 20px; text-decoration: none; margin-right: 10px;'>🚀 Visit Website</a>";
    echo "<a href='admin/?v=" . time() . "' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none;'>🔧 Admin Panel</a></p>";
    
    // Log deployment
    $log_entry = date('Y-m-d H:i:s') . " - Force deployment completed: $copied_count files copied\n";
    file_put_contents('force-deploy.log', $log_entry, FILE_APPEND);
    
} catch (Exception $e) {
    logMessage("❌ Deployment failed: " . $e->getMessage());
    
    // Log error
    $log_entry = date('Y-m-d H:i:s') . " - Force deployment failed: " . $e->getMessage() . "\n";
    file_put_contents('force-deploy.log', $log_entry, FILE_APPEND);
}

ob_end_flush();
?>
