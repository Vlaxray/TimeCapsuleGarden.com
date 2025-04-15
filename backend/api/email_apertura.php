<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require __DIR__ . '/vendor/autoload.php'; // Ensure the path is correct and PHPMailer is installed via Composer

$conn = new mysqli("localhost", "user", "password", "tuo_database");

$sql = "SELECT s.id, s.contenuto, s.data_apertura, u.email, u.nome
        FROM semi s
        JOIN utenti u ON s.utente_id = u.id
        WHERE s.aperto = 0 AND s.data_apertura <= NOW()";

$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    // Invia email
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.tuoserver.com'; // es. smtp.gmail.com
        $mail->SMTPAuth   = true;
        $mail->Username   = 'tuaemail@example.com';
        $mail->Password   = 'tuapassword';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('tuaemail@example.com', 'TimeCapsule Garden');
        $mail->addAddress($row['email'], $row['nome']);

        $mail->isHTML(true);
        $mail->Subject = '🌸 Il tuo seme è sbocciato!';
        $mail->Body    = "
            <h2>Ciao {$row['nome']}!</h2>
            <p>È arrivato il momento di scoprire il tuo messaggio dal passato.</p>
            <blockquote>{$row['contenuto']}</blockquote>
            <p>Grazie per aver piantato un pensiero nel tempo.</p>
        ";

        $mail->send();
        echo "Email inviata a {$row['email']}<br>";

        // Aggiorna il seme come aperto
        $update = $conn->prepare("UPDATE semi SET aperto = 1 WHERE id = ?");
        $update->bind_param("i", $row['id']);
        $update->execute();

    } catch (Exception $e) {
        echo "Errore nell'invio a {$row['email']}: {$mail->ErrorInfo}";
    }
}
?>
