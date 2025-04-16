<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://tudominio.com"); // Restringi a dominio specifico
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_connection.php';

// Funzione per generare token sicuri
function generateSecureToken($userId) {
    $secretKey = file_get_contents('/path/to/secret_key.txt'); // Chiave esterna
    $data = $userId . microtime(true) . bin2hex(random_bytes(16));
    return hash_hmac('sha3-256', $data, $secretKey);
}

// Verifica metodo HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metodo non consentito']);
    exit;
}

// Leggi e valida input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' =>false, 'message' => 'JSON non valido']);
    exit;
}

// Validazione input
if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email non valida']);
    exit;
}

if (empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password richiesta']);
    exit;
}

try {
    $pdo = getDbConnection();
    
    // Aggiunta di prepared statement con named parameters
    $stmt = $pdo->prepare("SELECT id, name, password, salt FROM users WHERE email = :email LIMIT 1");
    $stmt->bindParam(':email', $data['email'], PDO::PARAM_STR);
    $stmt->execute();
    
    if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Verifica password con Argon2id (consigliato)
        if (password_verify($data['password'], $user['password'])) {
            // Rigenera l'hash se necessario
            if (password_needs_rehash($user['password'], PASSWORD_ARGON2ID)) {
                $newHash = password_hash($data['password'], PASSWORD_ARGON2ID);
                // Aggiorna hash nel database
                $updateStmt = $pdo->prepare("UPDATE users SET password = :password WHERE id = :id");
                $updateStmt->execute([':password' => $newHash, ':id' => $user['id']]);
            }
            
            // Genera token JWT-like
            $token = generateSecureToken($user['id']);
            
            // Salva token nel database con expiry
            $expiry = (new DateTime())->add(new DateInterval('PT1H'))->format('Y-m-d H:i:s');
            $tokenStmt = $pdo->prepare("INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)");
            $tokenStmt->execute([
                ':user_id' => $user['id'],
                ':token' => password_hash($token, PASSWORD_DEFAULT),
                ':expires_at' => $expiry
            ]);
            
            // Risposta sicura
            echo json_encode([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name']
                ],
                'expires' => $expiry
            ]);
            exit;
        }
    }
    
    // Risposta generica per evitare user enumeration
    sleep(1); // Aggiunge ritardo per mitigare timing attacks
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Credenziali non valide']);
    
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Errore del server']);
} catch (Exception $e) {
    error_log('System error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Errore del sistema']);
}
?>