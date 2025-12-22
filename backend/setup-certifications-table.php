<?php
require_once 'config/database.php';

try {
    $db = getDB();
    
    // Create certifications table
    $sql = "CREATE TABLE IF NOT EXISTS certifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_zh VARCHAR(255) NOT NULL,
        description_en TEXT NOT NULL,
        description_zh TEXT NOT NULL,
        badge1 VARCHAR(100),
        badge2 VARCHAR(100),
        badge3 VARCHAR(100),
        chinese_specific BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_active (active),
        INDEX idx_order (display_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($sql);
    echo "✓ Certifications table created successfully<br>";
    
    // Check if we already have data
    $stmt = $db->query("SELECT COUNT(*) FROM certifications");
    $count = $stmt->fetchColumn();
    
    if ($count == 0) {
        echo "Inserting certification data...<br>";
        
        $certifications = [
            [
                'icon' => 'fas fa-trophy',
                'title_en' => 'ISO 9001:2015',
                'title_zh' => 'ISO 9001:2015认证',
                'description_en' => 'International Standard Quality Management System',
                'description_zh' => '国际标准质量管理体系',
                'badge1' => 'ISO 9001',
                'badge2' => 'Verified',
                'badge3' => 'Current',
                'chinese_specific' => 0,
                'display_order' => 1
            ],
            [
                'icon' => 'fas fa-shield-alt',
                'title_en' => 'HACCP Certified',
                'title_zh' => 'HACCP认证',
                'description_en' => 'Food Safety Management System',
                'description_zh' => '食品安全管理体系',
                'badge1' => 'HACCP',
                'badge2' => 'Food Safety',
                'badge3' => 'Verified',
                'chinese_specific' => 0,
                'display_order' => 2
            ],
            [
                'icon' => 'fas fa-leaf',
                'title_en' => 'Organic Certified',
                'title_zh' => '有机认证',
                'description_en' => 'Organic Agriculture Compliance',
                'description_zh' => '有机农业合规认证',
                'badge1' => 'Organic',
                'badge2' => 'Eco-Friendly',
                'badge3' => 'Verified',
                'chinese_specific' => 0,
                'display_order' => 3
            ],
            [
                'icon' => 'fas fa-handshake',
                'title_en' => 'Fair Trade Certified',
                'title_zh' => '公平贸易认证',
                'description_en' => 'Ethical Trading Standards',
                'description_zh' => '道德贸易标准',
                'badge1' => 'Fair Trade',
                'badge2' => 'Social Impact',
                'badge3' => 'Verified',
                'chinese_specific' => 0,
                'display_order' => 4
            ],
            [
                'icon' => 'fas fa-flag',
                'title_en' => 'Uganda Export Certified',
                'title_zh' => '乌干达出口认证',
                'description_en' => 'Government Export License',
                'description_zh' => '政府出口许可证',
                'badge1' => 'Uganda',
                'badge2' => 'Legal',
                'badge3' => 'Verified',
                'chinese_specific' => 0,
                'display_order' => 5
            ],
            [
                'icon' => 'fas fa-globe',
                'title_en' => 'International Trade Certified',
                'title_zh' => '国际贸易认证',
                'description_en' => 'Global Trade Standards',
                'description_zh' => '全球贸易标准',
                'badge1' => 'International',
                'badge2' => 'Worldwide',
                'badge3' => 'Verified',
                'chinese_specific' => 0,
                'display_order' => 6
            ]
        ];
        
        $stmt = $db->prepare("
            INSERT INTO certifications (icon, title_en, title_zh, description_en, description_zh, badge1, badge2, badge3, chinese_specific, display_order)
            VALUES (:icon, :title_en, :title_zh, :description_en, :description_zh, :badge1, :badge2, :badge3, :chinese_specific, :display_order)
        ");
        
        foreach ($certifications as $cert) {
            $stmt->execute($cert);
        }
        
        echo "✓ Inserted " . count($certifications) . " sample certifications<br>";
    } else {
        echo "✓ Certifications table already has data ($count records)<br>";
    }
    
    echo "<br><strong>Setup complete!</strong><br>";
    echo "API endpoint: <a href='api/certifications.php'>backend/api/certifications.php</a><br>";
    echo "Admin panel: <a href='../admin/'>Go to Admin Panel</a>";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
