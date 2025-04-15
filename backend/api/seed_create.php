<?php
session_start();
require_once '/Ampps/www/mystuff/TimeCapsuleGarden/vite-timecapsule/backend/config/db.php';

//if (!isset($_SESSION["user_id"])) {
//    header("Location: login.php");
//    exit;
//}

$errors = [];
$message = '';
$germination_date = date('Y-m-d');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $message = trim($_POST["message"]);
    $germination_date = $_POST["germination_date"];

    if (empty($message)) {
        $errors[] = "Scrivi un messaggio.";
    }

    if (empty($germination_date) || $germination_date < date('Y-m-d')) {
        $errors[] = "Inserisci una data valida nel futuro.";
    }

    if (empty($errors)) {
        $stmt = $pdo->prepare("INSERT INTO seeds (user_id, message, germination_date) VALUES (?, ?, ?)");
        $stmt->execute([$_SESSION["user_id"], $message, $germination_date]);

        header("Location: dashboard.php");
        exit;
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Pianta un Seme 🌱</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial; padding: 20px; background-color: #e6fff2; }
        form { max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px #ccc; }
        textarea, input[type="date"] {
            width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;
        }
        input[type="submit"] {
            background-color: #28a745; color: white; padding: 12px; border: none; border-radius: 5px; cursor: pointer;
        }
        .error { color: red; margin-bottom: 10px; }
        .btn { text-decoration: none; color: #28a745; display: inline-block; margin-top: 10px; }
    </style>
</head>
<body>

<h2>🌱 Pianta un nuovo seme</h2>

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
<label>Categoria (es. #speranza):</label>
<input type="text" name="category" placeholder="#motivazione, #gratitudine, ecc." value="<?= htmlspecialchars($_POST['category'] ?? '') ?>">

    <label>Messaggio:</label>
    <textarea name="message" rows="5" placeholder="Scrivi un pensiero, un desiderio, un'idea..."><?= htmlspecialchars($message) ?></textarea>

    <label>Data di germoglio:</label>
    <input type="date" name="germination_date" value="<?= htmlspecialchars($germination_date) ?>">
    <label><input type="checkbox" name="anonymous" value="1"> Pubblica in modalità anonima</label>

    <input type="submit" value="Piantalo! 🌱">
</form>

<p><a href="dashboard.php" class="btn">← Torna alla dashboard</a></p>

</body>
</html>
