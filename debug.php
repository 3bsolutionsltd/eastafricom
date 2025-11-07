<?php
// Simple debug to check deployment status
echo "<h1>East Africom Debug</h1>";
echo "<h2>Files in Root Directory:</h2>";
echo "<pre>";
$files = scandir('.');
foreach($files as $file) {
    if($file != '.' && $file != '..') {
        echo $file;
        if(is_dir($file)) echo " [DIR]";
        echo "\n";
    }
}
echo "</pre>";

echo "<h2>Index.html Status:</h2>";
if(file_exists('index.html')) {
    echo " Found index.html<br>";
    echo "Size: " . filesize('index.html') . " bytes<br>";
    echo "Permissions: " . substr(sprintf('%o', fileperms('index.html')), -4) . "<br>";
} else {
    echo " index.html missing<br>";
}

echo "<h2>Current Directory:</h2>";
echo getcwd() . "<br>";
echo "Permissions: " . substr(sprintf('%o', fileperms('.')), -4) . "<br>";
?>
