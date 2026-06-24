<?php
// ============================================
// EMAIL SUBSCRIPTION - BACKEND PROCESSOR
// ============================================

// Enable error reporting (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ============================================
// DATABASE CONFIGURATION
// ============================================
$db_host = 'localhost';
$db_name = 'creatnprocess';
$db_user = 'root';        // Change this to your database username
$db_pass = '';            // Change this to your database password

// ============================================
// EMAIL CONFIGURATION (for sending confirmation)
// ============================================
$admin_email = 'hello@creatnprocess.com';
$site_name = 'Creatnprocess';

// ============================================
// PROCESS THE SUBSCRIPTION
// ============================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'])) {
    
    $email = trim($_POST['email']);
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $subscribe_date = date('Y-m-d H:i:s');
    $status = 'active';
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please enter a valid email address.'
        ]);
        exit;
    }
    
    try {
        // ============================================
        // CONNECT TO DATABASE
        // ============================================
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // ============================================
        // CHECK IF EMAIL ALREADY EXISTS
        // ============================================
        $check_stmt = $pdo->prepare("SELECT id, status FROM subscribers WHERE email = ?");
        $check_stmt->execute([$email]);
        $existing = $check_stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existing) {
            if ($existing['status'] === 'active') {
                echo json_encode([
                    'success' => false,
                    'message' => 'This email is already subscribed!'
                ]);
                exit;
            } else {
                // Reactivate inactive subscriber
                $update_stmt = $pdo->prepare("UPDATE subscribers SET status = 'active', updated_at = NOW() WHERE email = ?");
                $update_stmt->execute([$email]);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Welcome back! You have been resubscribed.'
                ]);
                exit;
            }
        }
        
        // ============================================
        // INSERT NEW SUBSCRIBER
        // ============================================
        $insert_stmt = $pdo->prepare("
            INSERT INTO subscribers (email, ip_address, subscribe_date, status) 
            VALUES (?, ?, ?, ?)
        ");
        $insert_stmt->execute([$email, $ip_address, $subscribe_date, $status]);
        
        // ============================================
        // SEND CONFIRMATION EMAIL
        // ============================================
        $subject = "Welcome to Creatnprocess! 🎨";
        $message = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background: #060816; color: #f8fafc; padding: 40px; }
                .container { max-width: 600px; margin: 0 auto; background: #0f0f0f; padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.06); }
                h1 { color: #8b5cf6; }
                .btn { display: inline-block; padding: 14px 30px; background: linear-gradient(90deg, #8b5cf6, #06b6d4); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; }
                .footer { margin-top: 30px; color: #94a3b8; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>Welcome to Creatnprocess! 🎨</h1>
                <p>Thank you for subscribing! You'll now receive:</p>
                <ul>
                    <li>🎓 Exclusive tutorials</li>
                    <li>📦 Free design resources</li>
                    <li>💡 Pro tips and workflows</li>
                    <li>🎯 Early access to courses</li>
                </ul>
                <br>
                <a href='https://youtube.com/@creatnprocess' class='btn'>Watch Our Latest Tutorial</a>
                <p class='footer'>You can unsubscribe anytime. © 2026 Creatnprocess</p>
            </div>
        </body>
        </html>
        ";
        
        // Headers for HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: " . $site_name . " <" . $admin_email . ">" . "\r\n";
        
        mail($email, $subject, $message, $headers);
        
        // ============================================
        // RETURN SUCCESS RESPONSE
        // ============================================
        echo json_encode([
            'success' => true,
            'message' => '🎉 Thank you for subscribing! Check your email for confirmation.'
        ]);
        
    } catch (PDOException $e) {
        // Log error (in production, log to file instead of showing)
        error_log("Subscription error: " . $e->getMessage());
        
        echo json_encode([
            'success' => false,
            'message' => 'Oops! Something went wrong. Please try again later.'
        ]);
    }
    
} else {
    // If accessed directly without POST
    header('Location: index.html');
    exit;
}
?>