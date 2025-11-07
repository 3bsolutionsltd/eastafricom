<?php
/**
 * East Africom Automated Deployment Script
 * Pulls from Git repository and deploys to live server
 * 
 * Usage: https://live.eastafricom.com/deploy.php?secret=YOUR_SECRET_KEY
 */

// Deployment configuration
$config = [
    'secret_key' => 'EAC_Deploy_2025_5d7c8a7b9c2e4f6a1b3c8d9e2f4a6b8c',
    'git_repo' => 'https://github.com/3bsolutionsltd/eastafricom.git',
    'branch' => 'main',
    'deploy_path' => __DIR__,
    'backup_path' => __DIR__ . '/backups',
    'log_file' => __DIR__ . '/deployment.log'
];

// Security check
$provided_secret = $_GET['secret'] ?? '';
if ($provided_secret !== $config['secret_key']) {
    http_response_code(403);
    die(json_encode(['success' => false, 'message' => 'Unauthorized access']));
}

function logDeployment($message) {
    global $config;
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $message\n";
    file_put_contents($config['log_file'], $log_entry, FILE_APPEND | LOCK_EX);
    echo "LOG: $message\n";
    flush();
}

function executeCommand($command) {
    $output = [];
    $return_code = 0;
    exec($command . ' 2>&1', $output, $return_code);
    return ['output' => $output, 'code' => $return_code];
}

// Set content type for real-time output
header('Content-Type: text/plain');

logDeployment("=== DEPLOYMENT STARTED ===");

try {
    // Create backup directory
    if (!is_dir($config['backup_path'])) {
        mkdir($config['backup_path'], 0755, true);
        logDeployment("Created backup directory");
    }

    // Create backup
    $backup_name = 'backup_' . date('Y-m-d_H-i-s');
    $backup_full_path = $config['backup_path'] . '/' . $backup_name;
    mkdir($backup_full_path, 0755, true);

    // Backup important files
    $files_to_backup = ['index.html', 'admin/', 'backend/', 'css/', 'js/', 'images/', 'pages/'];
    
    foreach ($files_to_backup as $file) {
        if (file_exists($file)) {
            if (is_dir($file)) {
                executeCommand("cp -r $file $backup_full_path/");
            } else {
                copy($file, "$backup_full_path/$file");
            }
        }
    }
    
    logDeployment("Backup created: $backup_name");

    // Initialize or update Git
    if (!is_dir('.git')) {
        logDeployment("Initializing Git repository");
        executeCommand('git init');
        executeCommand("git remote add origin {$config['git_repo']}");
    }

    // Fetch and reset to latest
    logDeployment("Fetching latest changes");
    $result = executeCommand("git fetch origin {$config['branch']}");
    if ($result['code'] !== 0) {
        throw new Exception("Failed to fetch: " . implode("\n", $result['output']));
    }

    logDeployment("Updating to latest version");
    $result = executeCommand("git reset --hard origin/{$config['branch']}");
    if ($result['code'] !== 0) {
        throw new Exception("Failed to reset: " . implode("\n", $result['output']));
    }

    // Clear cache
    $cache_files = glob('*.log');
    foreach ($cache_files as $file) {
        if ($file !== $config['log_file'] && is_file($file)) {
            unlink($file);
        }
    }

    // Fix file permissions after deployment
    logDeployment("Fixing file permissions");
    
    // Set directory permissions to 755
    $directories = ['.', 'admin', 'backend', 'css', 'images', 'js', 'pages'];
    foreach ($directories as $dir) {
        if (is_dir($dir)) {
            chmod($dir, 0755);
        }
    }
    
    // Set common file permissions to 644
    $file_patterns = ['*.html', '*.php', '*.css', '*.js', '*.md'];
    foreach ($file_patterns as $pattern) {
        foreach (glob($pattern) as $file) {
            if (is_file($file)) {
                chmod($file, 0644);
            }
        }
    }

    logDeployment("Cache cleared");

    // Verification
    $checks = ['index.html', 'admin/index.html', 'backend/api/products.php'];
    $all_good = true;
    
    foreach ($checks as $file) {
        if (file_exists($file)) {
            logDeployment(" Verified: $file");
        } else {
            logDeployment(" Missing: $file");
            $all_good = false;
        }
    }

    if ($all_good) {
        logDeployment("=== DEPLOYMENT COMPLETED SUCCESSFULLY ===");
        echo "\n" . json_encode([
            'success' => true,
            'message' => 'Deployment completed successfully',
            'timestamp' => date('Y-m-d H:i:s'),
            'backup' => $backup_name
        ]);
    } else {
        throw new Exception("Deployment verification failed");
    }

} catch (Exception $e) {
    logDeployment("DEPLOYMENT FAILED: " . $e->getMessage());
    
    // Restore backup if available
    if (isset($backup_full_path) && is_dir($backup_full_path)) {
        logDeployment("Restoring from backup");
        executeCommand("cp -r $backup_full_path/* ./");
    }
    
    http_response_code(500);
    echo "\n" . json_encode([
        'success' => false,
        'message' => 'Deployment failed: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

logDeployment("=== DEPLOYMENT ENDED ===");
?>
