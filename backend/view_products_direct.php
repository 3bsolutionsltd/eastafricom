<?php
/**
 * Direct Database Product Viewer
 * Bypasses API to directly show database contents
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config/database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    // Get all products
    $stmt = $pdo->query("SELECT * FROM products ORDER BY featured DESC, category, name");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate statistics
    $stats = [
        'total' => count($products),
        'coffee' => count(array_filter($products, fn($p) => $p['category'] === 'coffee')),
        'cocoa' => count(array_filter($products, fn($p) => $p['category'] === 'cocoa')),
        'arabica' => count(array_filter($products, fn($p) => stripos($p['name'], 'arabica') !== false)),
        'robusta' => count(array_filter($products, fn($p) => stripos($p['name'], 'robusta') !== false)),
        'featured' => count(array_filter($products, fn($p) => $p['featured'] == 1))
    ];
    
} catch (Exception $e) {
    $error = $e->getMessage();
    $products = [];
    $stats = ['total' => 0, 'coffee' => 0, 'cocoa' => 0, 'arabica' => 0, 'robusta' => 0, 'featured' => 0];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uganda Coffee Varieties - Direct Database View</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2rem; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #fff; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #fff; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2.5rem; font-weight: bold; color: #8B4513; }
        .stat-label { color: #666; margin-top: 0.5rem; font-size: 0.9rem; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .product-card { background: #fff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; }
        .product-name { font-size: 1.2rem; font-weight: bold; color: #8B4513; margin-bottom: 0.5rem; }
        .product-grade { background: #e8f5e8; color: #2d5a2d; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; display: inline-block; margin-right: 0.5rem; }
        .product-price { font-size: 1.4rem; font-weight: bold; color: #d2691e; margin: 0.8rem 0; }
        .product-stock { color: #666; margin-bottom: 0.5rem; font-size: 0.95rem; }
        .product-description { color: #555; font-size: 0.9rem; line-height: 1.4; }
        .featured-badge { background: #ffd700; color: #b8860b; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.75rem; position: absolute; top: 1rem; right: 1rem; }
        .category-tag { background: #8B4513; color: white; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
        .error { background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
        .success { background: #d4edda; color: #155724; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
        .empty-state { text-align: center; padding: 3rem; color: #666; }
        .refresh-btn { background: #28a745; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 5px; cursor: pointer; margin-left: 1rem; }
        .refresh-btn:hover { background: #218838; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🇺🇬 Uganda Coffee Varieties Database</h1>
            <p>Direct database query from: <strong>eastafricom_cms.products</strong></p>
            <p>Last updated: <strong><?php echo date('Y-m-d H:i:s'); ?></strong></p>
            <button onclick="window.location.reload()" class="refresh-btn">🔄 Refresh Data</button>
            <a href="populate_varieties.html" style="background: #007bff; color: white; text-decoration: none; padding: 0.8rem 1.5rem; border-radius: 5px; margin-left: 0.5rem;">📊 Populate Database</a>
        </div>

        <?php if (isset($error)): ?>
            <div class="error">
                <strong>Database Error:</strong> <?php echo htmlspecialchars($error); ?>
                <br><small>Make sure WAMP is running and the database is properly configured.</small>
            </div>
        <?php elseif ($stats['total'] == 0): ?>
            <div class="error">
                <strong>No Products Found:</strong> The products table is empty.
                <br><a href="populate_varieties.html">Click here to populate with Uganda coffee varieties</a>
            </div>
        <?php else: ?>
            <div class="success">
                <strong>✅ Database Connected Successfully!</strong> 
                Found <?php echo $stats['total']; ?> products in the database.
            </div>
        <?php endif; ?>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['total']; ?></div>
                <div class="stat-label">Total Products</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['coffee']; ?></div>
                <div class="stat-label">Coffee Varieties</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['arabica']; ?></div>
                <div class="stat-label">Arabica Varieties</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['robusta']; ?></div>
                <div class="stat-label">Robusta Varieties</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['cocoa']; ?></div>
                <div class="stat-label">Cocoa Varieties</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['featured']; ?></div>
                <div class="stat-label">Featured Products</div>
            </div>
        </div>

        <?php if (!empty($products)): ?>
            <div class="products-grid">
                <?php foreach ($products as $product): ?>
                    <div class="product-card">
                        <?php if ($product['featured']): ?>
                            <div class="featured-badge">⭐ Featured</div>
                        <?php endif; ?>
                        
                        <div class="product-name"><?php echo htmlspecialchars($product['name']); ?></div>
                        
                        <div style="margin-bottom: 0.8rem;">
                            <?php if ($product['grade']): ?>
                                <span class="product-grade"><?php echo htmlspecialchars($product['grade']); ?></span>
                            <?php endif; ?>
                            <span class="category-tag"><?php echo ucfirst($product['category']); ?></span>
                        </div>
                        
                        <div class="product-price">$<?php echo number_format($product['price'], 2); ?> USD/MT</div>
                        <div class="product-stock">📦 Stock: <?php echo number_format($product['stock_quantity']); ?> MT</div>
                        
                        <?php if ($product['description']): ?>
                            <div class="product-description">
                                <?php echo htmlspecialchars($product['description']); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php elseif (!isset($error)): ?>
            <div class="empty-state">
                <h3>No Products Found</h3>
                <p>The database is connected but no products are available.</p>
                <a href="populate_varieties.html" style="background: #007bff; color: white; text-decoration: none; padding: 1rem 2rem; border-radius: 5px;">
                    📊 Populate with Uganda Coffee Varieties
                </a>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>