<?php
require_once '/Ampps/www/mystuff/TimeCapsuleGarden/vite-timecapsule/backend/config/db.php';

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
<!DOCTYPE html>
<html>
<head>
    <title>Registrazione</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial; padding: 20px; background-color: #f0f8ff; }
        form { max-width: 400px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px #ccc; }
        input[type="text"], input[type="email"], input[type="password"] {
            width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 5px;
        }
        input[type="submit"] {
            background-color: #4CAF50; color: white; padding: 12px; border: none; border-radius: 5px; cursor: pointer;
        }
        .error { color: red; }
    </style>
</head>
<body>

<h2>Registrati</h2>

<?php
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

    <label>Nome visibile:</label>
    <input type="text" name="display_name" required>

    <label>Password:</label>
    <input type="password" name="password" required>

    <label>Conferma Password:</label>
    <input type="password" name="confirm_password" required>

    <input type="submit" value="Registrati">
</form>

</body>
</html>

