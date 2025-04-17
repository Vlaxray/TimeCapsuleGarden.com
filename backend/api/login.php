<?php
// Mostra gli errori PHP
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Gestione preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit;
}

// Headers comuni
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../db_connection.php';

// Legge una sola volta l’input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Log di debug
file_put_contents(__DIR__ . "/log_login.txt", 
    "===\n" .
    date('c') . " LOGIN DEBUG\n" .
    "RAW JSON: $json\n" .
    "DECODED: " . print_r($data, true) . "\n", 
    FILE_APPEND
);

try {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    file_put_contents(__DIR__ . "/log_login.txt",
        "QUERY USER: " . print_r($user, true) . "\n",
        FILE_APPEND
    );

    if ($user) {
        $ok = password_verify($data['password'], $user['password']);
        file_put_contents(__DIR__ . "/log_login.txt",
            "PASSWORD_VERIFY: " . ($ok ? "OK" : "FAIL") . "\n" .
            "===\n",
            FILE_APPEND
        );

        if ($ok) {
            echo json_encode([
                'success' => true,
                'token'   => bin2hex(random_bytes(32)),
                'user'    => ['id' => $user['id'], 'name' => $user['name']]
            ]);
            exit;
        }
    }

    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Credenziali non valide']);

} catch (PDOException $e) {
    file_put_contents(__DIR__ . "/log_login.txt",
        "ERROR PDO: " . $e->getMessage() . "\n===\n",
        FILE_APPEND
    );
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Errore del server']);
}
