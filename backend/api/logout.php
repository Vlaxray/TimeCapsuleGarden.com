<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin: http://localhost:5173/");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

// Recupera il token dall'header
$headers = getallheaders();
$token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');

if (!empty($token)) {
    // Invalida il token nel database
    $stmt = $conn->prepare("UPDATE users SET token = NULL, token_expires = NULL WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
}

echo json_encode(['success' => true]);
?>