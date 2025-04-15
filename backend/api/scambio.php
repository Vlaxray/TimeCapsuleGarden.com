<?php
require_once '/Ampps/www/mystuff/TimeCapsuleGarden/vite-timecapsule/backend/config/db.php';

$received_seed = null;
$errore = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $messaggio = trim($_POST['messaggio']);
    $emozione = trim($_POST['emozione']);

    if ($messaggio && $emozione) {
        // Salva il seme dell’utente
        $stmt = $pdo->prepare("INSERT INTO scambi (messaggio, emozione) VALUES (?, ?)");
        $stmt->execute([$messaggio, $emozione]);
        $my_id = $pdo->lastInsertId();

        // Cerca un altro seme diverso dal proprio
        $stmt = $pdo->prepare("SELECT * FROM scambi WHERE id != ? ORDER BY RAND() LIMIT 1");
        $stmt->execute([$my_id]);
        $altro = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($altro) {
            // Elimina entrambi dallo scambio (come se venissero "consumati")
            $pdo->prepare("DELETE FROM scambi WHERE id IN (?, ?)")->execute([$my_id, $altro['id']]);
            $received_seed = $altro;
        } else {
            $errore = "Grazie! Il tuo seme è stato inviato. Ti invieremo un altro seme non appena qualcuno parteciperà allo scambio. 🌱";
        }
    } else {
        $errore = "Per favore, scrivi un messaggio e un'emozione.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>🌱 Criptoscambio di Semi</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; background: #fef9f0; padding: 40px; color: #333; }
        textarea, input[type=text] {
            width: 100%; padding: 10px; margin-bottom: 10px;
            border: 1px solid #ccc; border-radius: 8px;
        }
        button {
            background: #4caf50; color: white; padding: 10px 20px;
            border: none; border-radius: 8px; cursor: pointer;
        }
        button:hover { background: #45a049; }
        .seed {
            background: white; padding: 15px; margin-top: 30px;
            border-left: 5px solid #4caf50; border-radius: 10px;
        }
    </style>
</head>
<body>

<h1>🤝 Criptoscambio di Semi</h1>
<p>Lascia un tuo pensiero 🌿 e riceverai un messaggio misterioso germogliato da qualcun altro.</p>

<form method="post">
    <label for="messaggio">✨ Il tuo messaggio</label>
    <textarea name="messaggio" id="messaggio" rows="4" required></textarea>

    <label for="emozione">❤️ Emozione che lo accompagna (scrivila a parole)</label>
    <input type="text" name="emozione" id="emozione" required>

    <button type="submit">Invia & Ricevi un Seme</button>
</form>

<?php if ($errore): ?>
    <p><?= htmlspecialchars($errore) ?></p>
<?php endif; ?>

<?php if ($received_seed): ?>
    <div class="seed">
        <h3>🌼 Hai ricevuto un seme!</h3>
        <p><strong>Emozione:</strong> <?= htmlspecialchars($received_seed['emozione']) ?></p>
        <p><strong>Messaggio:</strong><br><?= nl2br(htmlspecialchars($received_seed['messaggio'])) ?></p>
    </div>
<?php endif; ?>

<p style="margin-top:50px;"><a href="index.php">⬅️ Torna al Giardino</a></p>

</body>
</html>
