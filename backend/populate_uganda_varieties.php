<?php
// Uganda Coffee Varieties Database Population Script
// Execute this script to populate the database with Ugandan coffee varieties

require_once 'config/database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    // Enable buffered queries to avoid the unbuffered query error
    $pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
    
    echo "Connected to database successfully.\n";
    
    // Read the SQL file content
    $sqlFile = __DIR__ . '/uganda_coffee_varieties.sql';
    $sql = file_get_contents($sqlFile);
    
    if ($sql === false) {
        throw new Exception("Could not read SQL file: $sqlFile");
    }
    
    echo "SQL file loaded successfully.\n";
    
    // Split the SQL into individual statements and clean them
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($statements as $statement) {
        // Skip empty statements, comments, and USE statements
        if (empty($statement) || 
            strpos($statement, '--') === 0 || 
            stripos($statement, 'USE ') === 0 ||
            strlen(trim($statement)) < 10) {
            continue;
        }
        
        try {
            $stmt = $pdo->prepare($statement);
            $stmt->execute();
            $stmt->closeCursor(); // Important: close cursor to free up resources
            $successCount++;
            
            // Show more detail for INSERT statements
            if (stripos($statement, 'INSERT INTO products') === 0) {
                // Extract product name from INSERT statement for better feedback
                preg_match("/VALUES\s*\(\s*'([^']+)'/i", $statement, $matches);
                $productName = isset($matches[1]) ? $matches[1] : 'Unknown';
                echo "✓ Added coffee variety: $productName\n";
            } else {
                echo "✓ Executed statement successfully\n";
            }
        } catch (PDOException $e) {
            $errorCount++;
            echo "✗ Error executing statement: " . $e->getMessage() . "\n";
            // Only show first 100 characters of failed statement for debugging
            echo "Statement preview: " . substr($statement, 0, 100) . "...\n";
        }
    }
    
    echo "\n=== EXECUTION SUMMARY ===\n";
    echo "Successful statements: $successCount\n";
    echo "Failed statements: $errorCount\n";
    
    // Verify the data with proper cursor management
    echo "\n=== VERIFICATION ===\n";
    
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM products WHERE category = 'coffee'");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        echo "Total coffee varieties: " . $result['total'] . "\n";
        
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM products WHERE featured = 1");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        echo "Featured products: " . $result['total'] . "\n";
        
        $stmt = $pdo->prepare("SELECT name, price, grade FROM products WHERE category = 'coffee' ORDER BY price DESC LIMIT 5");
        $stmt->execute();
        echo "\nTop 5 most expensive coffee varieties:\n";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "- {$row['name']} ({$row['grade']}): $" . number_format($row['price'], 2) . "\n";
        }
        $stmt->closeCursor();
        
        // Additional verification
        $stmt = $pdo->prepare("SELECT COUNT(*) as arabica_count FROM products WHERE name LIKE '%Arabica%'");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        echo "\nArabica varieties: " . $result['arabica_count'] . "\n";
        
        $stmt = $pdo->prepare("SELECT COUNT(*) as robusta_count FROM products WHERE name LIKE '%Robusta%'");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        echo "Robusta varieties: " . $result['robusta_count'] . "\n";
        
        $stmt = $pdo->prepare("SELECT COUNT(*) as cocoa_count FROM products WHERE category = 'cocoa'");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        echo "Cocoa varieties: " . $result['cocoa_count'] . "\n";
        
    } catch (PDOException $e) {
        echo "❌ Error during verification: " . $e->getMessage() . "\n";
    }
    
    echo "\n✅ Uganda coffee varieties population completed!\n";
    echo "📊 Database now contains authentic Uganda coffee and cocoa varieties\n";
    echo "🌍 Covering all major growing regions: Mt. Elgon, Rwenzori, Lake Victoria, etc.\n";
    echo "🎯 Ready for use in admin dashboard and website!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>