<?php
// admin.php - Simple subscriber management
// IMPORTANT: Add proper authentication in production!

// Database connection
$db_host = 'localhost';
$db_name = 'creatnprocess';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get all subscribers
    $stmt = $pdo->query("SELECT * FROM subscribers ORDER BY subscribe_date DESC");
    $subscribers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $total = count($subscribers);
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin - Subscribers</title>
    <style>
        body { font-family: Arial; background: #060816; color: #f8fafc; padding: 40px; }
        table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.03); border-radius: 12px; overflow: hidden; }
        th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); }
        th { background: rgba(139,92,246,0.2); color: #8b5cf6; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        .active { background: rgba(34,197,94,0.2); color: #22c55e; }
        .inactive { background: rgba(239,68,68,0.2); color: #ef4444; }
        .stats { display: flex; gap: 30px; margin-bottom: 30px; }
        .stat-box { background: rgba(255,255,255,0.03); padding: 20px 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); }
        .stat-box h3 { margin: 0; color: #8b5cf6; font-size: 28px; }
        .stat-box p { margin: 4px 0 0; color: #94a3b8; }
        .export-btn { background: linear-gradient(90deg, #8b5cf6, #06b6d4); color: white; padding: 10px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    </style>
</head>
<body>
    <h1>📧 Subscriber Management</h1>
    
    <div class="stats">
        <div class="stat-box">
            <h3><?php echo $total; ?></h3>
            <p>Total Subscribers</p>
        </div>
        <div class="stat-box">
            <h3><?php echo date('Y-m-d'); ?></h3>
            <p>Last Updated</p>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
                <th>IP Address</th>
                <th>Subscribe Date</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($subscribers as $sub): ?>
            <tr>
                <td><?php echo $sub['id']; ?></td>
                <td><?php echo htmlspecialchars($sub['email']); ?></td>
                <td><?php echo htmlspecialchars($sub['ip_address']); ?></td>
                <td><?php echo $sub['subscribe_date']; ?></td>
                <td><span class="badge <?php echo $sub['status']; ?>"><?php echo ucfirst($sub['status']); ?></span></td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($subscribers)): ?>
            <tr><td colspan="5" style="text-align:center; color: #94a3b8; padding: 40px;">No subscribers yet.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</body>
</html>
