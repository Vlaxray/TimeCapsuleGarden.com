<?php
session_start();
require_once '/Ampps/www/mystuff/TimeCapsuleGarden/vite-timecapsule/backend/config/db.php';

// Se non loggato, reindirizza al login
//if (!isset($_SESSION["user_id"])) {
//   header("Location: register.php");
//    exit;
//

$user_id = $_SESSION["user_id"];
$display_name = $_SESSION["display_name"];

// Recupera i semi dal DB
$stmt = $pdo->prepare("SELECT * FROM seeds WHERE user_id = ? ORDER BY germination_date ASC");
$stmt->execute([$user_id]);
$seeds = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html>
<head>
    <title>La Tua Serra 🌱</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial; padding: 20px; background-color: #f3fbe5; }
        h1 { color: #4CAF50; }
        .seed { background: white; border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 8px; box-shadow: 0 0 5px #ccc; }
        .top { display: flex; justify-content: space-between; align-items: center; }
        .btn { text-decoration: none; background: #4CAF50; color: white; padding: 8px 12px; border-radius: 5px; }
    </style>
</head>
<body>

<div class="top">
    <h1>Ciao, <?= htmlspecialchars($display_name) ?> 👋</h1>
    <a href="logout.php" class="btn">Logout</a>
</div>

<p><a class="btn" href="seed_create.php">🌱 Pianta un nuovo seme</a></p>
<h2>📔 Il tuo Diario dei Semi</h2>
<?php foreach ($user_seeds as $seed): ?>
    <div class="seed">
        <div class="date">Data di germinazione: <?= htmlspecialchars($seed["germination_date"]) ?></div>
        <div class="message"><?= nl2br(htmlspecialchars($seed["message"])) ?></div>
        <?php if (!empty($seed["category"])): ?>
            <div class="category">Categoria: <?= htmlspecialchars($seed["category"]) ?></div>
        <?php endif; ?>
    </div>
<?php endforeach; ?>

<p><a href="garden.php" class="btn">🌼 Vai al Giardino Pubblico</a></p>


<?php if (empty($seeds)): ?>
    <p>Non hai ancora piantato alcun seme. Inizia subito a scrivere il tuo primo pensiero!</p>
<?php else: ?>
    <h2>I tuoi semi in attesa di sbocciare 🌼</h2>
    <?php foreach ($seeds as $seed): ?>
        <div class="seed">
            <p><strong>Data di germoglio:</strong> <?= htmlspecialchars($seed["germination_date"]) ?></p>
            <p><strong>Messaggio:</strong> <?= htmlspecialchars($seed["message"]) ?></p>
        </div>
    <?php endforeach; ?>
<?php endif; ?>

</body>
</html>
