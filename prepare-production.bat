@echo off
echo ========================================
echo East Africom - Production Preparation
echo ========================================
echo.

echo Creating archive directory...
mkdir setup_archive 2>nul

echo.
echo Moving setup files to archive...
move setup-*.php setup_archive\ 2>nul
move test-*.* setup_archive\ 2>nul
move fix-*.html setup_archive\ 2>nul
move debug.php setup_archive\ 2>nul
move simple-*.* setup_archive\ 2>nul
move deployment-status.php setup_archive\ 2>nul
move copy-js.html setup_archive\ 2>nul

echo.
echo ✅ Cleanup complete!
echo.
echo Files moved to setup_archive directory
echo.
echo Next steps:
echo 1. Change admin password
echo 2. Remove console.log from JS files
echo 3. Enable HTTPS in .htaccess
echo 4. Test everything before deployment
echo.
pause
