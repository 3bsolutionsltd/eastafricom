<?php
// Debug script to check what's happening
echo "<h1>Debug Information</h1>";
echo "<h2>Current Directory: " . getcwd() . "</h2>";
echo "<h2>Files in Current Directory:</h2>";
echo "<pre>";
print_r(scandir('.'));
echo "</pre>";

echo "<h2>Looking for index.html:</h2>";
if (file_exists('index.html')) {
    echo "✅ index.html found!<br>";
    echo "File size: " . filesize('index.html') . " bytes<br>";
    echo "Permissions: " . substr(sprintf('%o', fileperms('index.html')), -4) . "<br>";
} else {
    echo "❌ index.html NOT found!<br>";
}

echo "<h2>Server Environment:</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";

echo "<h2>Directory Permissions:</h2>";
echo "Current dir permissions: " . substr(sprintf('%o', fileperms('.')), -4) . "<br>";
?>