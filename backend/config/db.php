<?php
$host = '127.0.0.1';
$dbname = 'my_avid4032050';  // Usa il nome ESATTO del database
$user = 'root';           // Il tuo username Altervista
$pass = 'ciaociao';         // La password che hai impostato

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}
?>