<?php
function getDbConnection() {
    $configPath = __DIR__ . '/db_config.ini';
    
    // Verifica che il file esista
    if (!file_exists($configPath)) {
        throw new RuntimeException("File di configurazione database non trovato in: $configPath");
    }

    $config = parse_ini_file($configPath, true);
    
    // Debug: visualizza il contenuto del config (rimuovi in produzione)
    error_log(print_r($config, true));

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $config['database']['host'],
        $config['database']['dbname']
    );

    try {
        $pdo = new PDO(
            $dsn,
            $config['database']['username'],
            $config['database']['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );

        // Test della connessione
        $pdo->query("SELECT 1");
        return $pdo;

    } catch (PDOException $e) {
        error_log("Errore connessione DB: " . $e->getMessage());
        throw new RuntimeException("Errore di connessione al database. Verifica i log per dettagli.");
    }
}
?>