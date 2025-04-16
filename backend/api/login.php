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

// Ottieni i dati JSON dal body della richiesta
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data["email"] ?? '');
$password = $data["password"] ?? '';
$errors = [];

require_once '../config/db.php';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Inserisci email e password."]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    if (password_verify($password, $user['password'])) {
        // 4. Genera token (esempio semplice)
        $token = bin2hex(random_bytes(32));
        $expires = time() + 3600; // 1 ora
        
        // 5. Salva token nel database
        $stmt = $conn->prepare("UPDATE users SET token = ?, token_expires = ? WHERE id = ?");
        $stmt->bind_param("sii", $token, $expires, $user['id']);
        $stmt->execute();
        
        // 6. Risposta
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Credenziali non valide'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Utente non trovato'
    ]);
}
?>