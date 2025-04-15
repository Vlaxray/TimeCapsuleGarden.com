<?php
session_start();
session_unset();     // Rimuove tutte le variabili di sessione
session_destroy();   // Distrugge la sessione attiva

// Redirect al login
header("Location: login.php");  
header("Access-Control-Allow-Origin: http://localhost:3000"); // Sostituisci con il tuo URL frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}    //rimanderà alla home
exit;
?>
