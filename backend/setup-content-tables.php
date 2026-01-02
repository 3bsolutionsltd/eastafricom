<!DOCTYPE html>
<html>
<head>
    <title>Setup Content Tables - EastAfricom</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 50px auto; padding: 20px; }
        .success { color: green; background: #d4edda; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #f8d7da; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .info { color: #004085; background: #cce5ff; padding: 15px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Setup Content Management Tables</h1>
    
    <?php
    require_once 'config/database.php';

    try {
        $pdo = getDB();
        
        if (!$pdo) {
            throw new Exception("Failed to connect to database");
        }
        
        echo "<div class='info'>✓ Database connection established</div>";
        
        // Create slideshow_slides table
        $sql1 = "CREATE TABLE IF NOT EXISTS slideshow_slides (
            id INT AUTO_INCREMENT PRIMARY KEY,
            chapter VARCHAR(50) NOT NULL,
            title_en VARCHAR(255) NOT NULL,
            title_zh VARCHAR(255) NOT NULL,
            subtitle_en TEXT NOT NULL,
            subtitle_zh TEXT NOT NULL,
            image_url VARCHAR(500) NOT NULL DEFAULT 'images/coffee_bag_beans.jpg',
            button_text_en VARCHAR(100) NOT NULL,
            button_text_zh VARCHAR(100) NOT NULL,
            button_link VARCHAR(255) NOT NULL,
            position INT NOT NULL DEFAULT 0,
            autoplay_duration INT NOT NULL DEFAULT 6000,
            active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_position (position),
            INDEX idx_active (active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $pdo->exec($sql1);
        echo "<div class='success'>✓ Created table: slideshow_slides</div>";
        
        // Create awards table
        $sql2 = "CREATE TABLE IF NOT EXISTS awards (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            organization VARCHAR(255) NOT NULL,
            year INT NOT NULL,
            description TEXT,
            icon VARCHAR(100) DEFAULT 'fa-award',
            image_url VARCHAR(500),
            category VARCHAR(100),
            active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_year (year),
            INDEX idx_active (active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $pdo->exec($sql2);
        echo "<div class='success'>✓ Created table: awards</div>";
        
        // Insert sample slideshow data
        $checkSlides = $pdo->query("SELECT COUNT(*) FROM slideshow_slides")->fetchColumn();
        if ($checkSlides == 0) {
            $slidesData = [
                [
                    'chapter' => 'Chapter 1',
                    'title_en' => 'Highland Farm Sourcing',
                    'title_zh' => '高原农场采购',
                    'subtitle_en' => "Our journey begins in Uganda's fertile highlands (1,800-2,200m), where volcanic soil and perfect climate create exceptional coffee conditions",
                    'subtitle_zh' => '我们的旅程始于乌干达肥沃的高原（1800-2200米），火山土壤和完美气候创造了卓越的咖啡条件',
                    'image_url' => 'images/coffee_bag_beans.jpg',
                    'button_text_en' => 'READ MORE',
                    'button_text_zh' => '阅读更多',
                    'button_link' => '#about',
                    'position' => 1
                ],
                [
                    'chapter' => 'Chapter 2',
                    'title_en' => 'Hand-Picking Harvest',
                    'title_zh' => '手工采摘收获',
                    'subtitle_en' => 'Skilled farmers carefully select only the ripest red cherries, ensuring premium quality from the very first step of our coffee journey',
                    'subtitle_zh' => '经验丰富的农民仔细挑选最成熟的红色咖啡果，从咖啡之旅的第一步就确保优质品质',
                    'image_url' => 'images/top-view-coffee-cup-coffee-beans-dark-table-scaled.jpg',
                    'button_text_en' => 'VIEW PRODUCTS',
                    'button_text_zh' => '查看产品',
                    'button_link' => '#products',
                    'position' => 2
                ],
                [
                    'chapter' => 'Chapter 3',
                    'title_en' => 'Traditional Processing',
                    'title_zh' => '传统加工',
                    'subtitle_en' => 'Time-honored washing and drying methods preserve the unique flavor profiles, while modern quality control ensures consistency',
                    'subtitle_zh' => '历史悠久的水洗和干燥方法保持独特的风味谱，现代质量控制确保一致性',
                    'image_url' => 'images/coffee_bag_beans.jpeg',
                    'button_text_en' => 'OUR PROCESS',
                    'button_text_zh' => '我们的流程',
                    'button_link' => '#certifications',
                    'position' => 3
                ]
            ];
            
            $stmt = $pdo->prepare("
                INSERT INTO slideshow_slides 
                (chapter, title_en, title_zh, subtitle_en, subtitle_zh, image_url, button_text_en, button_text_zh, button_link, position) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            foreach ($slidesData as $slide) {
                $stmt->execute([
                    $slide['chapter'],
                    $slide['title_en'],
                    $slide['title_zh'],
                    $slide['subtitle_en'],
                    $slide['subtitle_zh'],
                    $slide['image_url'],
                    $slide['button_text_en'],
                    $slide['button_text_zh'],
                    $slide['button_link'],
                    $slide['position']
                ]);
            }
            
            echo "<div class='success'>✓ Inserted " . count($slidesData) . " sample slideshow slides</div>";
        } else {
            echo "<div class='info'>ℹ Slideshow slides already exist (found $checkSlides slides)</div>";
        }
        
        // Insert sample awards data
        $checkAwards = $pdo->query("SELECT COUNT(*) FROM awards")->fetchColumn();
        if ($checkAwards == 0) {
            $awardsData = [
                [
                    'title' => 'Best Coffee Exporter',
                    'organization' => 'Uganda Coffee Development Authority',
                    'year' => 2024,
                    'description' => 'Recognized for excellence in coffee export quality and volume',
                    'icon' => 'fa-trophy',
                    'category' => 'Export Excellence'
                ],
                [
                    'title' => 'Organic Certification',
                    'organization' => 'EU Organic Standards',
                    'year' => 2023,
                    'description' => 'Certified organic coffee production meeting EU standards',
                    'icon' => 'fa-leaf',
                    'category' => 'Certification'
                ],
                [
                    'title' => 'Fair Trade Verified',
                    'organization' => 'Fair Trade International',
                    'year' => 2023,
                    'description' => 'Verified fair trade practices ensuring farmer welfare',
                    'icon' => 'fa-handshake',
                    'category' => 'Fair Trade'
                ],
                [
                    'title' => 'Quality Excellence Award',
                    'organization' => 'East African Coffee Association',
                    'year' => 2024,
                    'description' => 'Outstanding quality consistency across all shipments',
                    'icon' => 'fa-award',
                    'category' => 'Quality'
                ]
            ];
            
            $stmt = $pdo->prepare("
                INSERT INTO awards 
                (title, organization, year, description, icon, category) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            foreach ($awardsData as $award) {
                $stmt->execute([
                    $award['title'],
                    $award['organization'],
                    $award['year'],
                    $award['description'],
                    $award['icon'],
                    $award['category']
                ]);
            }
            
            echo "<div class='success'>✓ Inserted " . count($awardsData) . " sample awards</div>";
        } else {
            echo "<div class='info'>ℹ Awards already exist (found $checkAwards awards)</div>";
        }
        
        echo "<div class='success'><strong>✓ Setup Complete!</strong></div>";
        echo "<div class='info'>";
        echo "<h3>API Endpoints Available:</h3>";
        echo "<ul>";
        echo "<li><strong>Slideshow:</strong> <a href='api/slideshow.php' target='_blank'>backend/api/slideshow.php</a></li>";
        echo "<li><strong>Awards:</strong> <a href='api/awards.php' target='_blank'>backend/api/awards.php</a></li>";
        echo "<li><strong>Testimonials:</strong> backend/api/testimonials.php (already exists)</li>";
        echo "</ul>";
        echo "</div>";
        
    } catch (PDOException $e) {
        echo "<div class='error'><strong>Error:</strong> " . $e->getMessage() . "</div>";
    }
    ?>
</body>
</html>
