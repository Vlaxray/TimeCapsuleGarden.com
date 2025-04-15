<?php
// Imposta la tua chiave API di OpenAI
$apiKey = 'YOUR_OPENAI_API_KEY';

// Percorso del file JSON contenente il prompt
$promptFile = 'tmp/seed_prompt.json';

// Verifica l'esistenza del file
if (!file_exists($promptFile)) {
    die("❌ Prompt non trovato. Assicurati di aver inviato il messaggio e l'emozione.");
}

// Leggi e decodifica il contenuto del file JSON
$data = json_decode(file_get_contents($promptFile), true);
$prompt = $data['prompt'] ?? '';
$message = $data['message'] ?? '';
$emotion = $data['emotion'] ?? '';

// Verifica che il prompt non sia vuoto
if (!$prompt) {
    die("❌ Prompt vuoto. Impossibile generare l'immagine.");
}

// Imposta l'endpoint dell'API di OpenAI
$apiUrl = 'https://api.openai.com/v1/images/generations';

// Prepara i dati per la richiesta
$postData = [
    'prompt' => $prompt,
    'n' => 1,
    'size' => '512x512'
];

// Inizializza cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

// Esegui la richiesta
$response = curl_exec($ch);

// Gestisci eventuali errori cURL
if (curl_errno($ch)) {
    die("❌ Errore cURL: " . curl_error($ch));
}

// Chiudi la sessione cURL
curl_close($ch);

// Decodifica la risposta JSON
$responseData = json_decode($response, true);

// Verifica la presenza dell'URL dell'immagine
if (!isset($responseData['data'][0]['url'])) {
    die("❌ Errore nella generazione dell'immagine.");
}

// Ottieni l'URL dell'immagine generata
$imageUrl = $responseData['data'][0]['url'];

// Scarica l'immagine
$imageContent = file_get_contents($imageUrl);

// Verifica che il contenuto dell'immagine sia stato ottenuto
if (!$imageContent) {
    die("❌ Impossibile scaricare l'immagine generata.");
}

// Crea un nome univoco per il file immagine
$imageName = 'seed_' . time() . '.png';
$imagePath = 'generated_images/' . $imageName;

// Salva l'immagine localmente
file_put_contents($imagePath, $imageContent);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🌸 Immagine NFT Generata</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #fdfbe8;
            padding: 40px;
            text-align: center;
        }
        img {
            border: 5px solid #d49f00;
            border-radius: 10px;
            max-width: 100%;
            height: auto;
        }
        .details {
            margin-top: 20px;
            font-size: 1.1em;
            color: #333;
        }
        .details strong {
            color: #d49f00;
        }
    </style>
</head>
<body>
    <h1>🌸 Immagine NFT Generata</h1>
    <img src="<?= htmlspecialchars($imagePath) ?>" alt="Immagine Generata">
    <div class="details">
        <p><strong>Messaggio:</strong> <?= htmlspecialchars($message) ?></p>
        <p><strong>Emozione:</strong> <?= htmlspecialchars($emotion) ?></p>
        <p><strong>Prompt:</strong> <?= htmlspecialchars($prompt) ?></p>
    </div>
</body>
</html>
