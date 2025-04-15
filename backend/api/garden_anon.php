<?php
require_once '/Ampps/www/mystuff/TimeCapsuleGarden/vite-timecapsule/backend/config/db.php';

$today = date('Y-m-d');
$filter = $_GET['filter'] ?? null;

// Filtro con categoria/hashtag
if ($filter) {
    $stmt = $pdo->prepare("SELECT * FROM seeds WHERE germination_date <= ? AND category LIKE ? ORDER BY germination_date DESC");
    $stmt->execute([$today, "%$filter%"]);
} else {
    $stmt = $pdo->prepare("SELECT * FROM seeds WHERE germination_date <= ? ORDER BY germination_date DESC");
    $stmt->execute([$today]);
}
$public_seeds = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Seme del giorno
$stmt = $pdo->prepare("SELECT id, message, emotion, germination_date, is_anonymous FROM seeds WHERE germination_date <= ? ORDER BY RAND() LIMIT 1");
$stmt->execute([$today]);
$daily_seed = $stmt->fetch(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html>
<head>
    <title>🌼 Giardino Pubblico</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial; background: #fdfbe8; padding: 30px; color: #333; }
        h1 { color: #d49f00; }
        .seed {
            background: white; padding: 15px; border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-bottom: 15px;
        }
        .reactions {
            margin-top: 10px; font-size: 1.1em;
        }
        .reactions button {
            background: none; border: none; cursor: pointer;
            font-size: 1.2em; margin-left: 5px;
        }
        .reactions button:hover { transform: scale(1.2); }

        .date { font-size: 0.9em; color: #888; margin-bottom: 5px; }
        .message { font-size: 1.2em; white-space: pre-line; }
        .btn {
            margin-top: 20px; display: inline-block; text-decoration: none;
            background: #d49f00; color: white; padding: 10px 15px; border-radius: 6px;
        }

        .promo, .exchange {
            margin-top: 30px; background: #fff3cd; padding: 20px;
            border-left: 5px solid #ffa500; border-radius: 10px;
        }
        .promo h2, .exchange h2 { margin-top: 0; }
    </style>
</head>
<body>

<h1>🌼 Giardino Pubblico</h1>

<!-- Seme del Giorno -->
<?php if ($daily_seed): ?>
    <div style="background:#fff8dc;padding:20px;border-left:5px solid #ffc107;margin-bottom:30px;border-radius:10px;">
        <h2>🌞 Seme del Giorno</h2>
        <p class="date">Sbocciato il <?= htmlspecialchars($daily_seed["germination_date"]) ?></p>
        <p class="message"><?= htmlspecialchars($daily_seed["message"]) ?></p>
    </div>
<?php endif; ?>

<!-- Filtro -->
<form method="get" style="margin-bottom:30px;">
    <label for="filter">🔍 Filtra per categoria o hashtag:</label>
    <input type="text" name="filter" id="filter" value="<?= htmlspecialchars($filter ?? '') ?>">
    <button type="submit">Filtra</button>
</form>

<!-- Lista dei Semi -->
<?php if ($public_seeds): ?>
    <?php foreach ($public_seeds as $seed): ?>
        <div class="seed">
            <div class="date">Sbocciato il <?= htmlspecialchars($seed["germination_date"]) ?></div>
            <div class="message"><?= htmlspecialchars($seed["message"]) ?></div>

            <?php
            $reaction_stmt = $pdo->prepare("SELECT reaction_type, COUNT(*) as count FROM reactions WHERE seed_id = ? GROUP BY reaction_type");
            $reaction_stmt->execute([$seed["id"]]);
            $reactions = $reaction_stmt->fetchAll(PDO::FETCH_KEY_PAIR);
            ?>
            <div class="reactions">
                ❤️ <?= $reactions['heart'] ?? 0 ?> 
                🌸 <?= $reactions['flower'] ?? 0 ?> 
                🌧 <?= $reactions['rain'] ?? 0 ?> 
                <form action="react.php" method="post" style="display:inline;">
                    <input type="hidden" name="seed_id" value="<?= $seed["id"] ?>">
                    <button type="submit" name="reaction" value="heart">❤️</button>
                    <button type="submit" name="reaction" value="flower">🌸</button>
                    <button type="submit" name="reaction" value="rain">🌧</button>
                </form>
            </div>
        </div>
    <?php endforeach; ?>
<?php else: ?>
    <p>🌱 Nessun seme è ancora sbocciato pubblicamente.</p>
<?php endif; ?>

<!-- Sezione Pubblicità -->
<div class="promo">
    <h2>📢 Spazio Sponsorizzato</h2>
    <p>Vuoi che il tuo messaggio fiorisca qui? Sponsorizza un “Seme del Giorno” e raggiungi migliaia di menti curiose.</p>
    <p><a href="sponsorizza.php" class="btn">Scopri come</a></p>
</div>

<!-- Scambio alla cieca -->
<div class="exchange">
    <h2>🎁 Seme a Sorpresa</h2>
    <p>Lascia un pensiero o un seme anonimo per qualcun altro, e ricevine uno casuale in cambio!</p>
    <p><a href="scambio.php" class="btn">Partecipa allo Scambio</a></p>
</div>

<!-- Ritorno alla serra -->
<p><a href="dashboard.php" class="btn">🌱 Torna alla tua serra</a></p>

</body>
</html>
