<?php
// Fix file permissions after deployment
echo "Fixing file permissions...\n";

// Set directory permissions to 755
$directories = ['.', 'admin', 'backend', 'css', 'images', 'js', 'pages'];
foreach ($directories as $dir) {
    if (is_dir($dir)) {
        chmod($dir, 0755);
        echo "Set directory permissions for: $dir\n";
    }
}

// Set file permissions to 644
$files = glob('*.{html,php,css,js}', GLOB_BRACE);
foreach ($files as $file) {
    if (is_file($file)) {
        chmod($file, 0644);
        echo "Set file permissions for: $file\n";
    }
}

// Recursively fix subdirectories
function fixSubdirectories($path) {
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($path)
    );
    
    foreach ($iterator as $file) {
        if ($file->isDir()) {
            chmod($file->getPathname(), 0755);
        } else {
            chmod($file->getPathname(), 0644);
        }
    }
}

fixSubdirectories('.');
echo "File permissions fixed!\n";
?>