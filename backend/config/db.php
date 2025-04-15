<?php
$host = 'localhost';
$dbname = 'my_avid4032050';  // Usa il nome ESATTO del database
$user = 'root';           // Il tuo username Altervista
$pass = '';         // La password che hai impostato

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname", 
        $user, 
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "Connesso a $dbname!";
} catch (PDOException $e) {
    die("ERRORE: " . $e->getMessage());
}
?>