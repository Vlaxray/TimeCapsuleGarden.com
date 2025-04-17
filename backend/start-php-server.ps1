# Percorso completo a PHP e php.ini di AMPPS
$phpPath = "C:\Ampps\php82\php.exe"
$phpIni = "C:\Ampps\php82\php.ini"

# Directory del progetto (dove si trova signup.php ecc.)
$projectDir = "C:\Users\valer\OneDrive\Desktop\timecapAI\backend\api"

# Porta dove vuoi eseguire il server
$port = 8000

# Avvia il server PHP
Write-Host "Avvio server PHP su http://localhost:$port..."
& $phpPath -c $phpIni -S "localhost:$port" -t $projectDir

