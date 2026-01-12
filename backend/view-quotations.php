<?php
/**
 * Quotation Requests Management - Backend Admin Tool
 * East Africom CMS
 * 
 * SECURITY NOTICE: This file has been replaced by the integrated admin panel.
 * Please use the admin dashboard to manage quotations.
 */

// Redirect to admin panel
header("Location: ../admin/?tab=quotations");
exit;

// Legacy code below is disabled for security - use admin panel instead
die();

require_once __DIR__ . '/config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

// Handle status updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'update_status' && isset($_POST['id'], $_POST['status'])) {
        $stmt = $db->prepare("UPDATE quotation_requests SET status = ?, notes = ? WHERE id = ?");
        $stmt->execute([$_POST['status'], $_POST['notes'] ?? '', $_POST['id']]);
        header("Location: view-quotations.php?success=1");
        exit;
    }
    
    if ($_POST['action'] === 'update_quote' && isset($_POST['id'], $_POST['quoted_price'])) {
        $stmt = $db->prepare("UPDATE quotation_requests SET quoted_price = ?, quote_sent_date = NOW(), status = 'quoted' WHERE id = ?");
        $stmt->execute([$_POST['quoted_price'], $_POST['id']]);
        header("Location: view-quotations.php?success=1");
        exit;
    }
}

// Get filter parameters
$status_filter = $_GET['status'] ?? 'all';
$search = $_GET['search'] ?? '';

// Build query
$query = "SELECT * FROM quotation_requests WHERE 1=1";
$params = [];

if ($status_filter !== 'all') {
    $query .= " AND status = ?";
    $params[] = $status_filter;
}

if ($search !== '') {
    $query .= " AND (company LIKE ? OR contact_name LIKE ? OR email LIKE ? OR product LIKE ?)";
    $searchTerm = "%$search%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

$query .= " ORDER BY timestamp DESC";

$stmt = $db->prepare($query);
$stmt->execute($params);
$quotations = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get statistics
$stats_query = "SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN status = 'quoted' THEN 1 ELSE 0 END) as quoted,
    SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM quotation_requests";
$stats = $db->query($stats_query)->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation Requests - East Africom Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: #f5f7fa;
            color: #333;
            line-height: 1.6;
        }
        
        .header {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            opacity: 0.9;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: #10b981;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .filters {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            margin-bottom: 2rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .filters select,
        .filters input[type="text"] {
            padding: 0.6rem 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 0.95rem;
        }
        
        .filters input[type="text"] {
            flex: 1;
            min-width: 250px;
        }
        
        .btn {
            padding: 0.6rem 1.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: #10b981;
            color: white;
        }
        
        .btn-primary:hover {
            background: #059669;
        }
        
        .quotations-table {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            overflow: hidden;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        thead {
            background: #f8f9fa;
        }
        
        th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #555;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 1rem;
            border-top: 1px solid #e9ecef;
        }
        
        tbody tr:hover {
            background: #f8f9fa;
        }
        
        .status-badge {
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            display: inline-block;
        }
        
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status-quoted {
            background: #dbeafe;
            color: #1e3a8a;
        }
        
        .status-accepted {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-rejected {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .status-completed {
            background: #e0e7ff;
            color: #3730a3;
        }
        
        .action-link {
            color: #10b981;
            text-decoration: none;
            font-weight: 500;
            margin-right: 1rem;
        }
        
        .action-link:hover {
            text-decoration: underline;
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            overflow-y: auto;
        }
        
        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: white;
            border-radius: 10px;
            max-width: 700px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 2rem;
            position: relative;
        }
        
        .close-modal {
            position: absolute;
            top: 1rem;
            right: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #555;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.7rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 0.95rem;
        }
        
        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 0.8rem 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .detail-label {
            font-weight: 600;
            color: #555;
        }
        
        .detail-value {
            color: #333;
            text-align: right;
        }
        
        .success-message {
            background: #d1fae5;
            color: #065f46;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            border-left: 4px solid #10b981;
        }
        
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: #999;
        }
        
        .empty-state i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>📋 Quotation Requests Management</h1>
            <p>East Africom - Coffee & Cocoa Export</p>
        </div>
    </div>
    
    <div class="container">
        <?php if (isset($_GET['success'])): ?>
            <div class="success-message">
                ✓ Changes saved successfully!
            </div>
        <?php endif; ?>
        
        <!-- Statistics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number"><?= $stats['total'] ?></div>
                <div class="stat-label">Total Requests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['pending'] ?></div>
                <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['quoted'] ?></div>
                <div class="stat-label">Quoted</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['accepted'] ?></div>
                <div class="stat-label">Accepted</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['completed'] ?></div>
                <div class="stat-label">Completed</div>
            </div>
        </div>
        
        <!-- Filters -->
        <form class="filters" method="GET">
            <select name="status" onchange="this.form.submit()">
                <option value="all" <?= $status_filter === 'all' ? 'selected' : '' ?>>All Status</option>
                <option value="pending" <?= $status_filter === 'pending' ? 'selected' : '' ?>>Pending</option>
                <option value="quoted" <?= $status_filter === 'quoted' ? 'selected' : '' ?>>Quoted</option>
                <option value="accepted" <?= $status_filter === 'accepted' ? 'selected' : '' ?>>Accepted</option>
                <option value="rejected" <?= $status_filter === 'rejected' ? 'selected' : '' ?>>Rejected</option>
                <option value="completed" <?= $status_filter === 'completed' ? 'selected' : '' ?>>Completed</option>
            </select>
            
            <input 
                type="text" 
                name="search" 
                placeholder="Search by company, name, email, or product..." 
                value="<?= htmlspecialchars($search) ?>"
            >
            
            <button type="submit" class="btn btn-primary">Search</button>
            <?php if ($search || $status_filter !== 'all'): ?>
                <a href="view-quotations.php" class="btn" style="background: #ddd;">Clear Filters</a>
            <?php endif; ?>
        </form>
        
        <!-- Quotations Table -->
        <div class="quotations-table">
            <?php if (count($quotations) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($quotations as $quote): ?>
                            <tr>
                                <td>#<?= $quote['id'] ?></td>
                                <td><?= date('M d, Y', strtotime($quote['timestamp'])) ?><br>
                                    <small style="color: #999;"><?= date('H:i', strtotime($quote['timestamp'])) ?></small>
                                </td>
                                <td>
                                    <strong><?= htmlspecialchars($quote['company']) ?></strong><br>
                                    <small style="color: #999;"><?= htmlspecialchars($quote['country']) ?></small>
                                </td>
                                <td>
                                    <?= htmlspecialchars($quote['contact_name']) ?><br>
                                    <small style="color: #999;"><?= htmlspecialchars($quote['email']) ?></small><br>
                                    <small style="color: #999;"><?= htmlspecialchars($quote['phone']) ?></small>
                                </td>
                                <td><?= htmlspecialchars($quote['product']) ?></td>
                                <td>
                                    <strong><?= number_format($quote['quantity'], 2) ?> <?= htmlspecialchars($quote['unit']) ?></strong><br>
                                    <small style="color: #999;"><?= htmlspecialchars($quote['shipping']) ?></small>
                                </td>
                                <td>
                                    <span class="status-badge status-<?= $quote['status'] ?>">
                                        <?= $quote['status'] ?>
                                    </span>
                                </td>
                                <td>
                                    <a href="#" class="action-link" onclick="viewDetails(<?= $quote['id'] ?>); return false;">View</a>
                                    <a href="mailto:<?= htmlspecialchars($quote['email']) ?>?subject=Quotation for <?= urlencode($quote['product']) ?>" class="action-link">Email</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="empty-state">
                    <div style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;">📋</div>
                    <h3>No quotation requests found</h3>
                    <p>Quotation requests will appear here when customers submit them.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
    
    <!-- Detail Modal -->
    <div id="detailModal" class="modal">
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            <div id="modalBody"></div>
        </div>
    </div>
    
    <script>
        const quotations = <?= json_encode($quotations) ?>;
        
        function viewDetails(id) {
            const quote = quotations.find(q => q.id == id);
            if (!quote) return;
            
            const modal = document.getElementById('detailModal');
            const modalBody = document.getElementById('modalBody');
            
            modalBody.innerHTML = `
                <h2>Quotation Request #${quote.id}</h2>
                <p style="color: #999; margin-bottom: 2rem;">Received: ${new Date(quote.timestamp).toLocaleString()}</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #10b981;">Product Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Product:</span>
                    <span class="detail-value">${quote.product}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Quantity:</span>
                    <span class="detail-value">${parseFloat(quote.quantity).toFixed(2)} ${quote.unit}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Shipping Terms:</span>
                    <span class="detail-value">${quote.shipping}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Certifications:</span>
                    <span class="detail-value">${quote.certifications || 'None'}</span>
                </div>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #10b981;">Company Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Company:</span>
                    <span class="detail-value">${quote.company}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Country:</span>
                    <span class="detail-value">${quote.country}</span>
                </div>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #10b981;">Contact Person</h3>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${quote.contact_name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value"><a href="mailto:${quote.email}">${quote.email}</a></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value"><a href="tel:${quote.phone}">${quote.phone}</a></span>
                </div>
                
                ${quote.requirements ? `
                    <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #10b981;">Additional Requirements</h3>
                    <p style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">${quote.requirements}</p>
                ` : ''}
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #10b981;">Update Status</h3>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="update_status">
                    <input type="hidden" name="id" value="${quote.id}">
                    
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status" required>
                            <option value="pending" ${quote.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="quoted" ${quote.status === 'quoted' ? 'selected' : ''}>Quoted</option>
                            <option value="accepted" ${quote.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                            <option value="rejected" ${quote.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                            <option value="completed" ${quote.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Admin Notes</label>
                        <textarea name="notes" placeholder="Internal notes, follow-up details, etc.">${quote.notes || ''}</textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Update Status</button>
                </form>
                
                <form method="POST" action="" style="margin-top: 1rem;">
                    <input type="hidden" name="action" value="update_quote">
                    <input type="hidden" name="id" value="${quote.id}">
                    
                    <div class="form-group">
                        <label>Quoted Price (USD)</label>
                        <input type="number" name="quoted_price" step="0.01" value="${quote.quoted_price || ''}" placeholder="Enter total quoted price">
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save Quote & Mark as Quoted</button>
                </form>
            `;
            
            modal.classList.add('active');
        }
        
        function closeModal() {
            document.getElementById('detailModal').classList.remove('active');
        }
        
        // Close modal on background click
        document.getElementById('detailModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    </script>
</body>
</html>
