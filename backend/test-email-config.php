<?php
/**
 * Email Configuration Diagnostic Tool
 * Test email sending to identify issues
 */

// Test email addresses
$testRecipient = 'frank.asiimwe@eastafricom.com'; // Company email
$testSender = 'noreply@eastafricom.com';

// Get current PHP mail settings
echo "<h1>📧 Email Configuration Diagnostic</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f7fa; }
    .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .success { color: #10b981; font-weight: bold; }
    .error { color: #dc2626; font-weight: bold; }
    .warning { color: #f59e0b; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f8f9fa; }
    code { background: #1f2937; color: #10b981; padding: 2px 6px; border-radius: 4px; }
</style>";

echo "<div class='section'>";
echo "<h2>1. PHP Mail Configuration</h2>";
echo "<table>";
echo "<tr><th>Setting</th><th>Current Value</th></tr>";
echo "<tr><td>SMTP Server</td><td>" . ini_get('SMTP') . "</td></tr>";
echo "<tr><td>SMTP Port</td><td>" . ini_get('smtp_port') . "</td></tr>";
echo "<tr><td>Sendmail From</td><td>" . ini_get('sendmail_from') . "</td></tr>";
echo "<tr><td>Sendmail Path</td><td>" . ini_get('sendmail_path') . "</td></tr>";
echo "</table>";
echo "</div>";

// Test 1: Send to company email
echo "<div class='section'>";
echo "<h2>2. Test Email to Company (Frank)</h2>";

$subject = "Test Email - East Africom Quotation System";
$message = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>✅ Email Test Successful</h2>
        </div>
        <p>This is a test email from the East Africom quotation system.</p>
        <p>If you receive this email, the system is working correctly!</p>
        <p><strong>Time:</strong> " . date('Y-m-d H:i:s') . "</p>
    </div>
</body>
</html>
";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: East Africom System <$testSender>\r\n";
$headers .= "Reply-To: $testSender\r\n";

try {
    $result = mail($testRecipient, $subject, $message, $headers);
    
    if ($result) {
        echo "<p class='success'>✅ Email sent successfully to $testRecipient</p>";
        echo "<p>Please check your inbox and spam folder.</p>";
    } else {
        echo "<p class='error'>❌ Failed to send email to $testRecipient</p>";
        echo "<p class='warning'>⚠️ This usually means:</p>";
        echo "<ul>";
        echo "<li>SMTP server is not configured in php.ini</li>";
        echo "<li>Port 25 is blocked by firewall/antivirus</li>";
        echo "<li>Mail server is not running (use Test Mail Server Tool for local testing)</li>";
        echo "<li>Email address is being rejected by server</li>";
        echo "</ul>";
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Exception: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Check error log
echo "<div class='section'>";
echo "<h2>3. Recent Error Log Entries</h2>";
$errorLog = ini_get('error_log');
echo "<p>Error log location: <code>" . ($errorLog ? $errorLog : 'php_error.log') . "</code></p>";

// Try to read last few lines of error log
if (function_exists('error_get_last')) {
    $lastError = error_get_last();
    if ($lastError) {
        echo "<p>Last PHP Error:</p>";
        echo "<pre style='background: #1f2937; color: #10b981; padding: 15px; border-radius: 6px; overflow-x: auto;'>";
        print_r($lastError);
        echo "</pre>";
    }
}
echo "</div>";

// Recommendations
echo "<div class='section'>";
echo "<h2>4. Troubleshooting Recommendations</h2>";

$smtp = ini_get('SMTP');
$port = ini_get('smtp_port');

if (empty($smtp) || $smtp === 'localhost') {
    echo "<div style='background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 10px 0;'>";
    echo "<strong>⚠️ Local SMTP Configuration Detected</strong>";
    echo "<p>You are using localhost as SMTP server. For local development:</p>";
    echo "<ol>";
    echo "<li><strong>Download Test Mail Server Tool</strong> (free SMTP server for Windows)</li>";
    echo "<li>Start the application (it will listen on localhost:25)</li>";
    echo "<li>Try sending a test quotation from your website</li>";
    echo "<li>Check Test Mail Server Tool interface to see the email</li>";
    echo "</ol>";
    echo "</div>";
}

echo "<div style='background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 10px 0;'>";
echo "<strong>✅ Recommended Solutions:</strong>";
echo "<ol>";
echo "<li><strong>For Local Development (WAMP):</strong>";
echo "<ul>";
echo "<li>Use Test Mail Server Tool to capture emails locally</li>";
echo "<li>Or configure PHPMailer with Gmail SMTP</li>";
echo "</ul>";
echo "</li>";
echo "<li><strong>For Production (Hostinger):</strong>";
echo "<ul>";
echo "<li>Use Hostinger's mail() function (usually works automatically)</li>";
echo "<li>Or use Hostinger's SMTP settings</li>";
echo "<li>Verify domain's SPF and DKIM records</li>";
echo "</ul>";
echo "</li>";
echo "<li><strong>Alternative: Use PHPMailer Library</strong>";
echo "<ul>";
echo "<li>More reliable than PHP's mail() function</li>";
echo "<li>Better error reporting</li>";
echo "<li>Can use SMTP authentication</li>";
echo "</ul>";
echo "</li>";
echo "</ol>";
echo "</div>";

echo "<div style='background: #e0e7ff; padding: 15px; border-left: 4px solid #6366f1; margin: 10px 0;'>";
echo "<strong>📝 Quick Fix for Local Testing:</strong>";
echo "<ol>";
echo "<li>Download: <a href='https://www.toolheap.com/test-mail-server-tool/' target='_blank'>Test Mail Server Tool</a></li>";
echo "<li>Run the application</li>";
echo "<li>Keep it running in the background</li>";
echo "<li>All emails will appear in its interface</li>";
echo "<li>This lets you test without configuring real SMTP</li>";
echo "</ol>";
echo "</div>";

echo "</div>";

// System Info
echo "<div class='section'>";
echo "<h2>5. System Information</h2>";
echo "<table>";
echo "<tr><th>Property</th><th>Value</th></tr>";
echo "<tr><td>PHP Version</td><td>" . phpversion() . "</td></tr>";
echo "<tr><td>Server Software</td><td>" . $_SERVER['SERVER_SOFTWARE'] . "</td></tr>";
echo "<tr><td>Operating System</td><td>" . PHP_OS . "</td></tr>";
echo "<tr><td>Mail Function Available</td><td>" . (function_exists('mail') ? 'Yes ✅' : 'No ❌') . "</td></tr>";
echo "</table>";
echo "</div>";

echo "<div style='text-align: center; padding: 20px; color: #666;'>";
echo "<p>After fixing the configuration, test again by submitting a quotation from your website.</p>";
echo "<p><a href='view-quotations.php' style='background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;'>View Quotations Admin</a></p>";
echo "</div>";
?>
