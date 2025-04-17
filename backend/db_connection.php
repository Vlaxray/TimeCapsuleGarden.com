<?php
function getDbConnection() {
    $host = 'localhost';      // Host di phpMyAdmin
    $db   = 'my_avid4032050';    // Nome del database
    $user = 'root';           // Utente MySQL
    $password = '';               // Password (vuota per XAMPP)
    $charset = 'utf8mb4';

    try {
        // Connessione PDO
        $conn = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        echo 'Errore DB: ' . $e->getMessage();
        exit;
    }
}
?>    