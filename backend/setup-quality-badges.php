<?php
/**
 * Setup Quality Badges Table
 * Run this once to create the quality_badges table and populate with default data
 */

require_once 'config/database.php';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Quality Badges Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; padding: 10px; background: #d4edda; border: 1px solid #c3e6cb; margin: 10px 0; }
        .error { color: red; padding: 10px; background: #f8d7da; border: 1px solid #f5c6cb; margin: 10px 0; }
        .info { color: blue; padding: 10px; background: #d1ecf1; border: 1px solid #bee5eb; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Quality Badges Table Setup</h1>
    
<?php
try {
    $pdo = getDB();
    
    // Create quality_badges table
    $sql = "CREATE TABLE IF NOT EXISTS quality_badges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_zh VARCHAR(255) NOT NULL,
        description_en TEXT NOT NULL,
        description_zh TEXT NOT NULL,
        badge_text VARCHAR(50) NOT NULL,
        position INT DEFAULT 0,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($sql);
    echo "<div class='success'>✓ Created table: quality_badges</div>";
    
    // Check if we need to populate with default data
    $checkBadges = $pdo->query("SELECT COUNT(*) FROM quality_badges")->fetchColumn();
    
    if ($checkBadges == 0) {
        $badgesData = [
            [
                'icon' => 'fa-shield-alt',
                'title_en' => '100% Defect-Free',
                'title_zh' => '100%无缺陷',
                'description_en' => 'Rigorous quality control at every stage ensures zero defects in final products',
                'description_zh' => '每个阶段的严格质量控制确保最终产品零缺陷',
                'badge_text' => 'Guaranteed',
                'position' => 1
            ],
            [
                'icon' => 'fa-microscope',
                'title_en' => 'Lab Tested Quality',
                'title_zh' => '实验室测试质量',
                'description_en' => 'Independent laboratory testing confirms grade, moisture content, and purity standards',
                'description_zh' => '独立实验室测试确认等级、水分含量和纯度标准',
                'badge_text' => 'Verified',
                'position' => 2
            ],
            [
                'icon' => 'fa-award',
                'title_en' => 'International Standards',
                'title_zh' => '国际标准',
                'description_en' => 'Compliance with ICO, FLO, and EU organic standards for global market acceptance',
                'description_zh' => '符合ICO、FLO和欧盟有机标准，获得全球市场认可',
                'badge_text' => 'Compliant',
                'position' => 3
            ]
        ];
        
        $stmt = $pdo->prepare("
            INSERT INTO quality_badges 
            (icon, title_en, title_zh, description_en, description_zh, badge_text, position) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        foreach ($badgesData as $badge) {
            $stmt->execute([
                $badge['icon'],
                $badge['title_en'],
                $badge['title_zh'],
                $badge['description_en'],
                $badge['description_zh'],
                $badge['badge_text'],
                $badge['position']
            ]);
        }
        
        echo "<div class='success'>✓ Inserted " . count($badgesData) . " default quality badges</div>";
    } else {
        echo "<div class='info'>ℹ Quality badges already exist (found $checkBadges badges)</div>";
    }
    
    echo "<div class='success'><strong>✓ Setup completed successfully!</strong></div>";
    echo "<p><a href='../admin/'>Go to Admin Panel</a> to manage quality badges.</p>";
    
} catch (PDOException $e) {
    echo "<div class='error'>❌ Database Error: " . $e->getMessage() . "</div>";
}
?>

</body>
</html>
