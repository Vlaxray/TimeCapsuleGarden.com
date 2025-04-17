<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Leggi lo stream **una sola volta**
$json = file_get_contents('php://input');

// Log per debug
file_put_contents(__DIR__."/log_signup.txt",
    "===\nRAW JSON:\n".$json."\nDECODED:\n".print_r(json_decode($json, true), true)."\n===\n",
    FILE_APPEND
);

// Poi gestisci CORS ed headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Connessione, preflight, ecc...
require_once __DIR__ . '/../db_connection.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success'=>false,'message'=>'Metodo non consentito']);
    exit;
}

// Decodifica da $json già popolato
$data = json_decode($json, true);

// Validazione
if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Dati mancanti','data'=>$data]);
    exit;
}



try {
    $conn = getDbConnection();
    
    // Verifica se l'email esiste già
    $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $emailExists = $stmt->fetchColumn();
    
    if ($emailExists > 0) {
        // Se l'email esiste già, restituisci un errore
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'L\'email è già registrata']);
        exit;
    }
    
    // Inserisci il nuovo utente
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([
        $data['name'],
        $data['email'],
        password_hash($data['password'], PASSWORD_BCRYPT)
    ]);

    $userId = $conn->lastInsertId();

    $response = [
        'success' => true,
        'message' => 'Registrazione completata',
        'user' => [
            'id' => $userId,
            'name' => $data['name']
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Errore del server',
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}

?>