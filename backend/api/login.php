<?php
session_start();
require_once '/Ampps/www/mystuff/TimeCapsuleGarden/vite-timecapsule/backend/config/db.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); // Sostituisci con il tuo URL frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ottieni i dati JSON dal body della richiesta
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? '');
$password = $data["password"] ?? '';

$errors = [];

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Inserisci email e password."]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, password_hash, display_name FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->rowCount() === 1) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (password_verify($password, $user['password_hash'])) {
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["display_name"] = $user["display_name"];
        
        echo json_encode(["success" => true, "displayName" => $user["display_name"]]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Password errata."]);
        exit;
    }
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Utente non trovato."]);
    exit;
}


if (!empty($errors)) {
    echo "<div class='error'><ul>";
    foreach ($errors as $e) {
        echo "<li>$e</li>";
    }
    echo "</ul></div>";
}
?>

<form method="post">
    <label>Email:</label>
    <input type="email" name="email" required>

    <label>Password:</label>
    <input type="password" name="password" required>

    <input type="submit" value="Accedi">
</form>

</body>
</html>
