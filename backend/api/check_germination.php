<?php
require_once '/Ampps/www/mystuff/TimeCapsuleGarden/vite-timecapsule/backend/config/db.php';

$today = date("Y-m-d");

// Trova i semi che germinano oggi e non hanno ancora ricevuto l'email
$stmt = $pdo->prepare("SELECT seeds.id, users.email, seeds.message 
    FROM seeds 
    JOIN users ON seeds.user_id = users.id 
    WHERE seeds.germination_date = ? AND seeds.email_sent = 0");
$stmt->execute([$today]);
$seeds_to_notify = $stmt->fetchAll();

foreach ($seeds_to_notify as $seed) {
    $to = $seed['email'];
    $subject = "🌱 Il tuo seme è sbocciato oggi!";
    $message = "Ciao! Uno dei tuoi semi è sbocciato oggi nel giardino pubblico:\n\n" . $seed['message'] . "\n\nVai a vederlo!";
    $headers = "From: giardino@tuodominio.it";

    // Invia email
    mail($to, $subject, $message, $headers);

    // Segna come notificato
    $update = $pdo->prepare("UPDATE seeds SET email_sent = 1 WHERE id = ?");
    $update->execute([$seed['id']]);
}
?>
