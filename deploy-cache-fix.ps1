# East Africom - Deploy Cache Fix
# This script prepares files for deployment to production

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   East Africom - Cache Fix Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Define workspace path
$workspacePath = "c:\wamp64\www\eastafricom"

# Files that were modified (MUST be deployed)
$modifiedFiles = @(
    "backend\api\testimonials.php",
    "backend\config\database.php",
    "js\dynamic-content.js"
)

# New diagnostic/testing files created
$newFiles = @(
    "backend\api\diagnostics.php",
    "test-testimonials-api.html",
    "api-health-check.html",
    "cache-buster.html",
    "direct-api-test.php"
)

Write-Host "CRITICAL FILES TO DEPLOY (Required):" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Red
foreach ($file in $modifiedFiles) {
    $fullPath = Join-Path $workspacePath $file
    if (Test-Path $fullPath) {
        $lastModified = (Get-Item $fullPath).LastWriteTime
        Write-Host "  [OK] $file" -ForegroundColor Green
        Write-Host "       Modified: $lastModified" -ForegroundColor Gray
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "NEW DIAGNOSTIC FILES (Recommended):" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow
foreach ($file in $newFiles) {
    $fullPath = Join-Path $workspacePath $file
    if (Test-Path $fullPath) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   DEPLOYMENT OPTIONS" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Choose deployment method:" -ForegroundColor Yellow
Write-Host "1. Copy files to another directory (for FTP upload)" -ForegroundColor White
Write-Host "2. Create deployment package (ZIP file)" -ForegroundColor White
Write-Host "3. Show file contents for manual copy" -ForegroundColor White
Write-Host "4. Test locally before deploying" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        $destPath = Read-Host "Enter destination path (e.g., C:\Deployments\eastafricom)"
        
        if (-not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath -Force | Out-Null
        }
        
        Write-Host ""
        Write-Host "Copying files..." -ForegroundColor Yellow
        
        # Copy modified files
        foreach ($file in $modifiedFiles) {
            $source = Join-Path $workspacePath $file
            $dest = Join-Path $destPath $file
            $destDir = Split-Path $dest -Parent
            
            if (-not (Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            
            if (Test-Path $source) {
                Copy-Item $source $dest -Force
                Write-Host "  [COPIED] $file" -ForegroundColor Green
            }
        }
        
        # Copy new files
        foreach ($file in $newFiles) {
            $source = Join-Path $workspacePath $file
            $dest = Join-Path $destPath $file
            $destDir = Split-Path $dest -Parent
            
            if (-not (Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            
            if (Test-Path $source) {
                Copy-Item $source $dest -Force
                Write-Host "  [COPIED] $file" -ForegroundColor Green
            }
        }
        
        Write-Host ""
        Write-Host "Files copied to: $destPath" -ForegroundColor Green
        Write-Host "Now upload these files to your production server via FTP/cPanel" -ForegroundColor Yellow
    }
    
    "2" {
        Write-Host ""
        $zipName = "eastafricom-cache-fix-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
        $zipPath = Join-Path $workspacePath $zipName
        
        Write-Host "Creating deployment package..." -ForegroundColor Yellow
        
        # Create temp directory
        $tempDir = Join-Path $env:TEMP "eastafricom-deploy"
        if (Test-Path $tempDir) {
            Remove-Item $tempDir -Recurse -Force
        }
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
        
        # Copy all files to temp
        $allFiles = $modifiedFiles + $newFiles
        foreach ($file in $allFiles) {
            $source = Join-Path $workspacePath $file
            $dest = Join-Path $tempDir $file
            $destDir = Split-Path $dest -Parent
            
            if (-not (Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            
            if (Test-Path $source) {
                Copy-Item $source $dest -Force
            }
        }
        
        # Create ZIP
        Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
        
        # Cleanup
        Remove-Item $tempDir -Recurse -Force
        
        Write-Host ""
        Write-Host "Deployment package created:" -ForegroundColor Green
        Write-Host "  $zipPath" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Extract this ZIP and upload to your production server" -ForegroundColor Yellow
    }
    
    "3" {
        Write-Host ""
        Write-Host "Modified Files Locations:" -ForegroundColor Yellow
        Write-Host "=========================" -ForegroundColor Yellow
        foreach ($file in $modifiedFiles) {
            $fullPath = Join-Path $workspacePath $file
            Write-Host ""
            Write-Host "File: $file" -ForegroundColor Cyan
            Write-Host "Path: $fullPath" -ForegroundColor Gray
            
            if (Test-Path $fullPath) {
                Write-Host "Size: $((Get-Item $fullPath).Length) bytes" -ForegroundColor Gray
                Write-Host "Modified: $((Get-Item $fullPath).LastWriteTime)" -ForegroundColor Gray
            }
        }
        
        Write-Host ""
        Write-Host "You can open these files and manually copy their contents" -ForegroundColor Yellow
    }
    
    "4" {
        Write-Host ""
        Write-Host "Opening local test pages..." -ForegroundColor Yellow
        Write-Host ""
        
        # Open test pages in browser
        $testPages = @(
            "direct-api-test.php",
            "cache-buster.html",
            "api-health-check.html"
        )
        
        foreach ($page in $testPages) {
            $url = "http://localhost/eastafricom/$page"
            Write-Host "Opening: $url" -ForegroundColor Cyan
            Start-Process $url
            Start-Sleep -Seconds 1
        }
        
        Write-Host ""
        Write-Host "Test pages opened in your browser!" -ForegroundColor Green
        Write-Host "Check each page to ensure everything works locally" -ForegroundColor Yellow
    }
    
    "5" {
        Write-Host ""
        Write-Host "Deployment cancelled" -ForegroundColor Yellow
    }
    
    default {
        Write-Host ""
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   POST-DEPLOYMENT CHECKLIST" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After uploading files to production:" -ForegroundColor Yellow
Write-Host "1. [ ] Check testimonials table exists" -ForegroundColor White
Write-Host "       Visit: https://live.eastafricom.com/direct-api-test.php" -ForegroundColor Gray
Write-Host ""
Write-Host "2. [ ] Clear CDN cache (if using Cloudflare)" -ForegroundColor White
Write-Host "       Purge all cache and wait 2-3 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "3. [ ] Clear browser cache" -ForegroundColor White
Write-Host "       Press Ctrl+Shift+R for hard refresh" -ForegroundColor Gray
Write-Host ""
Write-Host "4. [ ] Test API endpoint" -ForegroundColor White
Write-Host "       Visit: https://live.eastafricom.com/backend/api/testimonials.php?featured=true&limit=10" -ForegroundColor Gray
Write-Host ""
Write-Host "5. [ ] Verify main site loads testimonials" -ForegroundColor White
Write-Host "       Check browser console for errors" -ForegroundColor Gray
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
