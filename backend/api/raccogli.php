<?php

require_once '/Ampps/www/mystuff/TimeCapsuleGarden/vite-timecapsule/backend/config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validazione e pulizia degli input
    $message = trim($_POST['message'] ?? '');
    $emotion = trim($_POST['emotion'] ?? '');
    $category = isset($_POST['category']) ? trim($_POST['category']) : null;
    $germination_date = date('Y-m-d'); // Oppure $_POST['germination_date'] se vuoi che sia impostabile
    $is_anonymous = isset($_POST['anonymous']) ? 1 : 0;
    
    // Gestione user_id
    $user_id = $is_anonymous ? null : ($_SESSION['user_id'] ?? null);
    
    try {
        // Preparazione della query con tutti i campi richiesti
        $stmt = $pdo->prepare("INSERT INTO seeds 
                              (message, emotion, category, germination_date, user_id, is_anonymous, email_sent) 
                              VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        // Esecuzione con tutti i parametri
        $stmt->execute([
            $message, 
            $emotion, 
            $category, 
            $germination_date, 
            $user_id, 
            $is_anonymous,
            0 // email_sent impostato a 0 di default
        ]);
        
        header('Location: garden.php');
        exit;
    } catch (PDOException $e) {
        // Gestione degli errori
        error_log("Database error: " . $e->getMessage());
        // Puoi reindirizzare a una pagina di errore o mostrare un messaggio
        header('Location: error.php');
        exit;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Piantare un Seme</title>
</head>
<body>
    <h1>🌱 Pianta un nuovo seme</h1>
    <form method="post">
        <label for="message">Messaggio:</label><br>
        <textarea name="message" id="message" required rows="4" cols="50"></textarea><br><br>

        <label for="emotion">Emozione (scrivila tu):</label><br>
        <input type="text" name="emotion" id="emotion" required><br><br>

        <label><input type="checkbox" name="anonymous" value="1"> Pubblica in modalità anonima</label><br><br>

        <button type="submit">Pianta il seme</button>
    </form>
</body>
</html>
