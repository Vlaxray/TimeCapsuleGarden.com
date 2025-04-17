<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $host = 'localhost';      // Host di phpMyAdmin
    $db   = 'my_avid4032050';    // Nome del database
    $user = 'root';           // Utente MySQL
    $password = '';               // Password (vuota per XAMPP)
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);

    echo "✅ Connessione riuscita al database!";
} catch (PDOException $e) {
    echo "❌ Errore di connessione: " . $e->getMessage();
}
?>
