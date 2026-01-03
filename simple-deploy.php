<?php
// Simple FTP-based deployment script
echo "<h1>East Africom - Simple Deployment</h1>";

// Configuration
$github_api_url = 'https://api.github.com/repos/3bsolutionsltd/eastafricom/zipball/main';
$temp_dir = 'temp_download';
$secret_key = 'EAC_Deploy_2025_5d7c8a7b9c2e4f6a1b3c8d9e2f4a6b8c';

// Check authentication
if (!isset($_GET['secret']) || $_GET['secret'] !== $secret_key) {
    die('Unauthorized access');
}

function logMessage($message) {
    $timestamp = date('Y-m-d H:i:s');
    echo "<p>[$timestamp] $message</p>";
    flush();
}

logMessage("Starting simple deployment...");

try {
    // Step 1: Download repository as ZIP
    logMessage("Downloading repository from GitHub...");
    
    // Use curl for better reliability with GitHub API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $github_api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'EastAfricom-Deploy/1.0');
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $zip_content = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    if ($zip_content === false || $http_code !== 200) {
        throw new Exception("Failed to download repository (HTTP $http_code): $curl_error");
    }
    
    // Step 2: Save and extract ZIP
    $zip_file = 'repo.zip';
    file_put_contents($zip_file, $zip_content);
    logMessage("Repository downloaded successfully");
    
    // Step 3: Extract ZIP
    $zip = new ZipArchive;
    if ($zip->open($zip_file) === TRUE) {
        $zip->extractTo($temp_dir);
        $zip->close();
        logMessage("Repository extracted successfully");
    } else {
        throw new Exception("Failed to extract ZIP file");
    }
    
    // Step 4: Find the extracted folder (GitHub creates a folder with commit hash)
    $extracted_folders = glob($temp_dir . '/*', GLOB_ONLYDIR);
    if (empty($extracted_folders)) {
        throw new Exception("No extracted folder found");
    }
    $source_folder = $extracted_folders[0];
    
    // Step 5: Copy files (excluding deployment scripts to avoid overwriting)
    logMessage("Copying website files...");
    
    $files_to_skip = ['simple-deploy.php', 'deploy.php', 'webhook.php', 'deployment.log', 'webhook.log'];
    
    function copyFiles($source, $dest, $skip_files = []) {
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
            }
        }
    }
    
    copyFiles($source_folder, '.', $files_to_skip);
    
    // Step 6: Set proper permissions
    logMessage("Setting file permissions...");
    chmod('.', 0755);
    
    $directories = ['admin', 'backend', 'css', 'images', 'js', 'pages'];
    foreach ($directories as $dir) {
        if (is_dir($dir)) {
            chmod($dir, 0755);
        }
    }
    
    // Step 6.5: Clear PHP opcache to ensure new files are loaded
    logMessage("Clearing PHP opcache...");
    if (function_exists('opcache_reset')) {
        opcache_reset();
        logMessage("Opcache cleared successfully");
    } else {
        logMessage("Opcache not available - skipping");
    }
    
    // Step 7: Clean up temporary files
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
    
    logMessage("✅ Deployment completed successfully!");
    
    echo "<hr>";
    echo "<h2>🎉 Deployment Successful!</h2>";
    echo "<p><strong>Your website is now live!</strong></p>";
    echo "<p><a href='index.html' style='background: #28a745; color: white; padding: 10px 20px; text-decoration: none; margin-right: 10px;'>🚀 Visit Website</a>";
    echo "<a href='admin/' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none;'>🔧 Admin Panel</a></p>";
    
    // Log deployment
    $log_entry = date('Y-m-d H:i:s') . " - Simple deployment completed successfully\n";
    file_put_contents('simple-deploy.log', $log_entry, FILE_APPEND);
    
} catch (Exception $e) {
    logMessage("❌ Deployment failed: " . $e->getMessage());
    
    // Log error
    $log_entry = date('Y-m-d H:i:s') . " - Deployment failed: " . $e->getMessage() . "\n";
    file_put_contents('simple-deploy.log', $log_entry, FILE_APPEND);
}
?>