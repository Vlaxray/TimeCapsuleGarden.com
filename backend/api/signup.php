<?php
require_once '/Ampps/www/mystuff/TimeCapsuleGarden/vite-timecapsule/backend/config/db.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");


$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $display_name = trim($_POST["display_name"]);
    $password = $_POST["password"];
    $confirm_password = $_POST["confirm_password"];




    //Validazione display_name
    if(empty($display_name) || (strlen($display_name) < 3)) {
        $errors[$display_name] = "Inserire un nome di almeno 3 lettere";
    }
        
    // Validazione email
    if (empty($email)) {
        $errors['email'] = "Il campo email è obbligatorio.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Email non valida.";
    } elseif ($email !== $email_confirm) {
        $errors['email_confirm'] = "Le email non corrispondono.";
    }
    // Validazione password
    if (empty($password)) {
        $errors['password'] = "La password è obbligatoria.";
    } elseif (strlen($password) < 8) {
        $errors['password'] = "La password deve essere di almeno 8 caratteri.";
    } elseif (!preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
        $errors['password'] = "La password deve contenere almeno una lettera maiuscola e un numero.";
    } elseif ($password !== $password_confirm) {
        $errors['password_confirm'] = "Le password non corrispondono.";
    }
    // Validazione termini privacy
    if (!$privacy_terms) {
        $errors['privacy_terms'] = "Devi accettare i termini della privacy.";
    }
    if (empty($errors)) {
        // Verifica se l'email è già registrata
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            $errors[] = "Email già registrata.";
        }
    
        // Verifica se il display_name esiste già
        $stmt = $pdo->prepare("SELECT id FROM users WHERE display_name = ?");
        $stmt->execute([$display_name]);
        if ($stmt->rowCount() > 0) {
            $errors[] = "Nome utente già in uso. Scegline un altro.";
        }
    
        // Se non ci sono errori, procedi con la registrazione
        if (empty($errors)) {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)");
            $stmt->execute([$email, $hashed_password, $display_name]);
    
            header("Location: login.php");
            exit;
        }
    }
}
?>

