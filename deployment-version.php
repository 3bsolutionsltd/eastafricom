<?php
/**
 * Deployment Version Check
 * Returns the current deployment timestamp and git commit
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$version = [
    'timestamp' => date('Y-m-d H:i:s'),
    'file_modified' => date('Y-m-d H:i:s', filemtime(__FILE__)),
    'git_commit' => trim(shell_exec('git rev-parse --short HEAD 2>&1') ?? 'unknown'),
    'git_branch' => trim(shell_exec('git rev-parse --abbrev-ref HEAD 2>&1') ?? 'unknown'),
    'server_time' => time(),
    'php_version' => PHP_VERSION,
    'opcache_enabled' => function_exists('opcache_get_status') && opcache_get_status() !== false,
    'deployment_log' => file_exists('simple-deploy.log') ? filemtime('simple-deploy.log') : null,
    'files' => [
        'admin/section-manager.js' => file_exists('admin/section-manager.js') ? [
            'modified' => date('Y-m-d H:i:s', filemtime('admin/section-manager.js')),
            'size' => filesize('admin/section-manager.js')
        ] : 'not found',
        'js/section-manager.js' => file_exists('js/section-manager.js') ? [
            'modified' => date('Y-m-d H:i:s', filemtime('js/section-manager.js')),
            'size' => filesize('js/section-manager.js')
        ] : 'not found'
    ]
];

echo json_encode($version, JSON_PRETTY_PRINT);
?>
