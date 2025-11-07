<?php
echo "<h1>Fixing File Permissions</h1>";

// Fix directory permissions
$dirs = ['.', 'admin', 'backend', 'css', 'images', 'js', 'pages'];
foreach($dirs as $dir) {
    if(is_dir($dir)) {
        if(chmod($dir, 0755)) {
            echo " Fixed permissions for directory: $dir<br>";
        } else {
            echo " Failed to fix directory: $dir<br>";
        }
    }
}

// Fix file permissions
$files = ['index.html', 'debug.php'];
foreach($files as $file) {
    if(file_exists($file)) {
        if(chmod($file, 0644)) {
            echo " Fixed permissions for file: $file<br>";
        } else {
            echo " Failed to fix file: $file<br>";
        }
    }
}

echo "<br><a href='index.html'>Try visiting index.html</a><br>";
echo "<a href='debug.php'>Check debug info</a><br>";
?>
