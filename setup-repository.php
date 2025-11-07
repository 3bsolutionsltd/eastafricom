<?php
// One-time setup script to properly clone the repository
echo "<h1>East Africom Repository Setup</h1>";

$repo_url = 'https://github.com/3bsolutionsltd/eastafricom.git';

// Function to execute commands safely
function runCommand($cmd) {
    echo "<p><strong>Running:</strong> $cmd</p>";
    exec($cmd . ' 2>&1', $output, $return_code);
    echo "<pre>" . implode("\n", $output) . "</pre>";
    return ['output' => $output, 'code' => $return_code];
}

echo "<h2>Step 1: Clean current directory (keeping deployment files)</h2>";

// Remove everything except deployment files and logs
$files_to_keep = ['setup-repository.php', 'debug.php', 'deploy.php', 'webhook.php', 'deployment.log', 'webhook.log', 'backups', 'fix_permissions.php'];
$current_files = scandir('.');
foreach($current_files as $file) {
    if($file != '.' && $file != '..' && !in_array($file, $files_to_keep)) {
        if(is_dir($file)) {
            runCommand("rm -rf '$file'");
        } else {
            unlink($file);
            echo "<p>Removed file: $file</p>";
        }
    }
}

echo "<h2>Step 2: Clone repository</h2>";
$result = runCommand("git clone $repo_url temp_clone");

if($result['code'] === 0) {
    echo "<h2>Step 3: Move files to current directory</h2>";
    
    // Move all files from temp_clone to current directory
    runCommand("mv temp_clone/* .");
    runCommand("mv temp_clone/.* . 2>/dev/null || true");  // Move hidden files, ignore errors
    runCommand("rmdir temp_clone");
    
    echo "<h2>Step 4: Set proper permissions</h2>";
    runCommand("chmod 755 .");
    runCommand("chmod 644 *.html *.php *.css *.js 2>/dev/null || true");
    runCommand("chmod 755 admin backend css images js pages 2>/dev/null || true");
    
    echo "<h2> Repository Setup Complete!</h2>";
    echo "<p><strong>Files now in directory:</strong></p>";
    echo "<pre>";
    print_r(scandir('.'));
    echo "</pre>";
    
    echo "<p><a href='index.html' style='background: #28a745; color: white; padding: 10px 20px; text-decoration: none;'> Visit Your Website</a></p>";
    echo "<p><a href='admin/' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none;'> Admin Panel</a></p>";
    
} else {
    echo "<h2> Clone Failed</h2>";
    echo "<p>Error: Could not clone repository. Check the repository URL and access permissions.</p>";
}
?>
