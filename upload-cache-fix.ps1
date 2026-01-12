# Quick FTP upload for cache fix
$ftpServer = "ftp.eastafricom.com"
$ftpUsername = "u266222025"
$ftpPassword = "n#V6E&+RMR2"

$files = @(
    @{Local="admin\admin.js"; Remote="/public_html/admin/admin.js"},
    @{Local="backend\config\database.php"; Remote="/public_html/backend/config/database.php"}
)

Write-Host "Uploading cache-busting fixes to production..." -ForegroundColor Cyan

foreach ($file in $files) {
    $localPath = Join-Path $PSScriptRoot $file.Local
    $ftpUri = "ftp://$ftpServer$($file.Remote)"
    
    Write-Host "Uploading $($file.Local)..." -ForegroundColor Yellow
    
    try {
        $webclient = New-Object System.Net.WebClient
        $webclient.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $webclient.UploadFile($ftpUri, $localPath)
        Write-Host "  Success" -ForegroundColor Green
    }
    catch {
        Write-Host "  Failed: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Deployment complete! Clear browser cache and refresh the admin page." -ForegroundColor Cyan
