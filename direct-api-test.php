<?php
/**
 * Direct Testimonials API Test
 * Shows raw output without any JavaScript caching
 */

// Show all errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<!DOCTYPE html>
<html>
<head>
    <title>Direct API Test</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .section { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .success { border-left: 4px solid #28a745; }
        .error { border-left: 4px solid #dc3545; }
        pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 5px; overflow-x: auto; }
        h2 { margin-top: 0; }
    </style>
</head>
<body>
    <h1>🔍 Direct API Test (No Cache)</h1>
";

// Test 1: Check if files exist
echo "<div class='section'>";
echo "<h2>1. File Existence Check</h2>";

$filesToCheck = [
    'testimonials.php' => '../backend/api/testimonials.php',
    'database.php' => '../backend/config/database.php',
    'middleware.php' => '../backend/auth/middleware.php'
];

foreach ($filesToCheck as $name => $path) {
    $exists = file_exists($path);
    $color = $exists ? 'green' : 'red';
    $status = $exists ? '✓ EXISTS' : '✗ MISSING';
    echo "<div style='color: $color;'><strong>$name:</strong> $status</div>";
}
echo "</div>";

// Test 2: Include and test database connection
echo "<div class='section'>";
echo "<h2>2. Database Connection Test</h2>";

try {
    require_once '../backend/config/database.php';
    
    $database = new Database();
    echo "<div style='color: green;'>✓ Database class loaded</div>";
    echo "<div>Environment: " . $database->getEnvironment() . "</div>";
    
    $db = getDB();
    if ($db) {
        echo "<div style='color: green;'>✓ Database connection successful</div>";
        
        // Test query
        $result = $db->query("SELECT 1 as test");
        if ($result) {
            echo "<div style='color: green;'>✓ Test query successful</div>";
        }
    } else {
        echo "<div style='color: red;'>✗ Database connection failed</div>";
    }
    
} catch (Exception $e) {
    echo "<div style='color: red;'>✗ Error: " . htmlspecialchars($e->getMessage()) . "</div>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
echo "</div>";

// Test 3: Check testimonials table
echo "<div class='section'>";
echo "<h2>3. Testimonials Table Check</h2>";

try {
    $tableCheck = $db->query("SHOW TABLES LIKE 'testimonials'");
    $tableExists = $tableCheck->rowCount() > 0;
    
    if ($tableExists) {
        echo "<div style='color: green;'>✓ Testimonials table EXISTS</div>";
        
        // Get counts
        $totalCount = $db->query("SELECT COUNT(*) as count FROM testimonials")->fetch();
        $activeCount = $db->query("SELECT COUNT(*) as count FROM testimonials WHERE active = 1")->fetch();
        $featuredCount = $db->query("SELECT COUNT(*) as count FROM testimonials WHERE active = 1 AND featured = 1")->fetch();
        
        echo "<div>Total records: " . $totalCount['count'] . "</div>";
        echo "<div>Active records: " . $activeCount['count'] . "</div>";
        echo "<div>Featured records: " . $featuredCount['count'] . "</div>";
        
        // Get sample
        $sample = $db->query("SELECT * FROM testimonials LIMIT 1")->fetch();
        if ($sample) {
            echo "<div style='color: green;'>✓ Sample record found</div>";
            echo "<pre>" . htmlspecialchars(json_encode($sample, JSON_PRETTY_PRINT)) . "</pre>";
        }
    } else {
        echo "<div style='color: red;'>✗ Testimonials table DOES NOT EXIST</div>";
        echo "<div style='color: orange;'>⚠ You need to run: backend/database/create-testimonials-table.sql</div>";
    }
    
} catch (Exception $e) {
    echo "<div style='color: red;'>✗ Error checking table: " . htmlspecialchars($e->getMessage()) . "</div>";
}
echo "</div>";

// Test 4: Direct API call simulation
echo "<div class='section'>";
echo "<h2>4. API Call Simulation</h2>";

try {
    // Simulate what the API does
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_GET['featured'] = 'true';
    $_GET['limit'] = '10';
    
    echo "<div>Simulating: GET testimonials.php?featured=true&limit=10</div>";
    
    if ($tableExists) {
        // Build query
        $sql = "SELECT * FROM testimonials WHERE active = 1 AND featured = :featured ORDER BY featured DESC, display_order ASC, created_at DESC LIMIT :limit";
        
        $stmt = $db->prepare($sql);
        $stmt->bindValue(':featured', 1, PDO::PARAM_INT);
        $stmt->bindValue(':limit', 10, PDO::PARAM_INT);
        $stmt->execute();
        $testimonials = $stmt->fetchAll();
        
        echo "<div style='color: green;'>✓ Query executed successfully</div>";
        echo "<div>Found " . count($testimonials) . " testimonials</div>";
        
        if (count($testimonials) > 0) {
            echo "<pre>" . htmlspecialchars(json_encode($testimonials, JSON_PRETTY_PRINT)) . "</pre>";
        }
    } else {
        echo "<div style='color: red;'>✗ Cannot run query - table doesn't exist</div>";
    }
    
} catch (Exception $e) {
    echo "<div style='color: red;'>✗ Query error: " . htmlspecialchars($e->getMessage()) . "</div>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
echo "</div>";

// Test 5: Call actual API endpoint
echo "<div class='section'>";
echo "<h2>5. Actual API Endpoint Test</h2>";
echo "<p>Open these URLs in a new tab to test the actual endpoints:</p>";
echo "<ul>";
echo "<li><a href='/backend/api/diagnostics.php' target='_blank'>/backend/api/diagnostics.php</a></li>";
echo "<li><a href='/backend/api/testimonials.php?featured=true&limit=10&t=" . time() . "' target='_blank'>/backend/api/testimonials.php?featured=true&limit=10&t=" . time() . "</a></li>";
echo "</ul>";
echo "</div>";

echo "
    <div class='section success'>
        <h2>✅ Next Steps</h2>
        <ol>
            <li>If table is missing, run <code>backend/database/create-testimonials-table.sql</code></li>
            <li>Upload updated files to production:
                <ul>
                    <li>backend/api/testimonials.php</li>
                    <li>backend/config/database.php</li>
                    <li>js/dynamic-content.js</li>
                </ul>
            </li>
            <li>Clear browser cache completely</li>
            <li>Hard refresh with Ctrl+Shift+R</li>
        </ol>
    </div>
    
    <div class='section'>
        <h2>📱 Clear Cache Now</h2>
        <button onclick=\"clearAndRefresh()\" style=\"padding: 15px 30px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;\">
            Clear Cache & Reload
        </button>
    </div>
    
    <script>
        function clearAndRefresh() {
            localStorage.clear();
            sessionStorage.clear();
            
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => {
                        caches.delete(name);
                    });
                });
            }
            
            alert('Cache cleared! The page will now reload...');
            location.reload(true);
        }
    </script>
</body>
</html>";
?>
