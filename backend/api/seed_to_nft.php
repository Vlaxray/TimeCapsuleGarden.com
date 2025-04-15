<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $message = trim($_POST['message'] ?? '');
    $emotion = trim($_POST['emotion'] ?? '');

    if (!$message || !$emotion) {
        die("💡 Scrivi sia un messaggio che un'emozione.");
    }

    // Prompt AI dinamico
    $prompt = "Generate an artistic NFT-style image based on the following message and emotional tone.\n\nMessage: \"$message\"\nEmotion: \"$emotion\"";

    // Salva prompt
    file_put_contents('tmp/seed_prompt.json', json_encode([
        'message' => $message,
        'emotion' => $emotion,
        'prompt' => $prompt
    ]));

    // Vai allo script che genera l’immagine
    header("Location: generate_image.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🌱 NFT Seme AI</title>
    <style>
        body { font-family: sans-serif; background: #fdfbe8; padding: 40px; }
        textarea, input[type="text"] { width: 100%; padding: 10px; font-size: 1.1em; }
        label { font-weight: bold; margin-top: 20px; display: block; }
        button { background: #d49f00; color: white; padding: 12px 20px; font-size: 1.1em; border: none; margin-top: 20px; border-radius: 8px; cursor: pointer; }
        button:hover { background: #b38a00; }
    </style>
</head>
<body>

<h1>🌿 Crea il tuo Seme NFT</h1>

<form method="post">
    <label for="message">🌱 Scrivi il messaggio del tuo seme:</label>
    <textarea name="message" id="message" rows="4" required placeholder="Es: Nella terra del silenzio ho trovato la mia voce."></textarea>

    <label for="emotion">💫 Descrivi l’emozione (a parole tue):</label>
    <input type="text" name="emotion" id="emotion" required placeholder="Es: nostalgia di un futuro mai vissuto">

    <button type="submit">🌸 Genera NFT AI</button>
</form>

</body>
</html>
