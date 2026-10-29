$ErrorActionPreference = "Stop"

foreach ($herramienta in @("pg_dump", "pg_restore", "psql")) {
    if (-not (Get-Command $herramienta -ErrorAction SilentlyContinue)) {
        throw "No se encontro '$herramienta'. Instala las herramientas cliente de PostgreSQL 16 o posterior."
    }
}

function Read-RequiredValue([string]$prompt) {
    $value = Read-Host $prompt
    if ([string]::IsNullOrWhiteSpace($value)) {
        throw "El valor '$prompt' es obligatorio."
    }
    return $value.Trim()
}

function Read-Port([string]$prompt) {
    $value = Read-Host $prompt
    if ([string]::IsNullOrWhiteSpace($value)) {
        return 5432
    }
    $port = 0
    if (-not [int]::TryParse($value, [ref]$port) -or $port -lt 1 -or $port -gt 65535) {
        throw "El puerto '$value' no es valido."
    }
    return $port
}

$hostOrigen = Read-RequiredValue "Host externo de Render"
$puertoOrigen = Read-Port "Puerto de Render [5432]"
$baseOrigen = Read-RequiredValue "Nombre de la base de Render"
$usuarioOrigen = Read-RequiredValue "Usuario de Render"
$contrasenaOrigenSegura = Read-Host "Contrasena de Render" -AsSecureString

$hostDestino = Read-RequiredValue "Host de Aiven"
$puertoDestino = Read-Port "Puerto de Aiven [5432]"
$baseDestino = Read-RequiredValue "Nombre de la base de Aiven"
$usuarioDestino = Read-RequiredValue "Usuario de Aiven"
$contrasenaDestinoSegura = Read-Host "Contrasena de Aiven" -AsSecureString

$confirmacion = Read-Host "Confirma que Aiven es una base vacia escribiendo MIGRAR"
if ($confirmacion -cne "MIGRAR") {
    throw "Operacion cancelada."
}

$contrasenaAnterior = $env:PGPASSWORD
$sslAnterior = $env:PGSSLMODE
$conservarRespaldo = $false
$restauracionCompletada = $false
$archivoRespaldo = Join-Path ([System.IO.Path]::GetTempPath()) "render-aiven-$([guid]::NewGuid().ToString('N')).dump"
$contrasenaOrigen = [System.Net.NetworkCredential]::new("", $contrasenaOrigenSegura).Password
$contrasenaDestino = [System.Net.NetworkCredential]::new("", $contrasenaDestinoSegura).Password

try {
    $env:PGSSLMODE = "require"
    $env:PGPASSWORD = $contrasenaOrigen

    $consultaChecksumOrigen = "SELECT checksum::text FROM public.flyway_schema_history WHERE version = '27' AND success = true;"
    $checksumOrigen = & psql -X -v ON_ERROR_STOP=1 -A -t `
        --host $hostOrigen --port $puertoOrigen --username $usuarioOrigen `
        --dbname $baseOrigen --command $consultaChecksumOrigen
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo comprobar el historial Flyway de Render. Aiven no fue modificado."
    }
    $checksumOrigen = $checksumOrigen.Trim()
    if ($checksumOrigen -and $checksumOrigen -notin @("-825257792", "-1194001402")) {
        throw "Checksum V27 inesperado en Render ($checksumOrigen). Aiven no fue modificado."
    }
    $consultaChecksum28 = "SELECT checksum::text FROM public.flyway_schema_history WHERE version = '28' AND success = true;"
    $checksum28Origen = & psql -X -v ON_ERROR_STOP=1 -A -t `
        --host $hostOrigen --port $puertoOrigen --username $usuarioOrigen `
        --dbname $baseOrigen --command $consultaChecksum28
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo comprobar el checksum de Flyway V28 en Render. Aiven no fue modificado."
    }
    $checksum28Origen = $checksum28Origen.Trim()
    if ($checksum28Origen -and $checksum28Origen -ne "-2117547871") {
        throw "Checksum V28 inesperado en Render ($checksum28Origen). Aiven no fue modificado."
    }

    & pg_dump --format=custom --no-owner --no-acl --file $archivoRespaldo `
        --host $hostOrigen --port $puertoOrigen --username $usuarioOrigen $baseOrigen
    if ($LASTEXITCODE -ne 0) {
        throw "pg_dump fallo con codigo $LASTEXITCODE. Aiven no fue modificado."
    }

    $env:PGPASSWORD = $contrasenaDestino
    $consultaObjetos = "SELECT COUNT(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind IN ('r','p','v','m','S','f');"
    $cantidadObjetos = & psql -X -v ON_ERROR_STOP=1 -A -t `
        --host $hostDestino --port $puertoDestino --username $usuarioDestino `
        --dbname $baseDestino --command $consultaObjetos
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo comprobar la base Aiven. No se restauraron datos."
    }
    if ([int]$cantidadObjetos.Trim() -ne 0) {
        throw "La base Aiven contiene objetos en public; no se modifico para evitar sobrescribir datos."
    }

    & pg_restore --exit-on-error --single-transaction --no-owner --no-acl `
        --host $hostDestino --port $puertoDestino --username $usuarioDestino `
        --dbname $baseDestino $archivoRespaldo
    if ($LASTEXITCODE -ne 0) {
        throw "pg_restore fallo con codigo $LASTEXITCODE. La transaccion de restauracion fue revertida."
    }

    $consultaChecksum = "SELECT checksum::text FROM public.flyway_schema_history WHERE version = '27' AND success = true;"
    $checksumV27 = & psql -X -v ON_ERROR_STOP=1 -A -t `
        --host $hostDestino --port $puertoDestino --username $usuarioDestino `
        --dbname $baseDestino --command $consultaChecksum
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo comprobar el historial de Flyway en Aiven."
    }
    $checksumV27 = $checksumV27.Trim()

    if ($checksumV27 -eq "-825257792") {
        $consultaAjuste = "UPDATE public.flyway_schema_history SET checksum = -1194001402 WHERE version = '27' AND checksum = -825257792 AND success = true;"
        & psql -X -v ON_ERROR_STOP=1 -A -t `
            --host $hostDestino --port $puertoDestino --username $usuarioDestino `
            --dbname $baseDestino --command $consultaAjuste
        if ($LASTEXITCODE -ne 0) {
            throw "No se pudo alinear el checksum conocido de Flyway V27."
        }
        $checksumV27 = "-1194001402"
    }

    if ($checksumV27 -and $checksumV27 -ne "-1194001402") {
        throw "Checksum V27 inesperado ($checksumV27). No inicies el backend hasta revisar flyway_schema_history."
    }
    $checksum28Destino = & psql -X -v ON_ERROR_STOP=1 -A -t `
        --host $hostDestino --port $puertoDestino --username $usuarioDestino `
        --dbname $baseDestino --command $consultaChecksum28
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo comprobar el checksum de Flyway V28 en Aiven."
    }
    $checksum28Destino = $checksum28Destino.Trim()
    if ($checksum28Destino -and $checksum28Destino -ne "-2117547871") {
        throw "Checksum V28 inesperado en Aiven ($checksum28Destino). No inicies el backend hasta revisar flyway_schema_history."
    }

    $restauracionCompletada = $true
    $conservarRespaldo = (Read-Host "Conservar el respaldo temporal en $archivoRespaldo? (s/N)") -match "^[sS]$"
    Write-Output "Restauracion completada. Configura DB_URL, DB_USER y DB_PASSWORD de Aiven en Render y despliega el backend para que Flyway aplique las migraciones pendientes."
}
finally {
    $env:PGPASSWORD = $contrasenaAnterior
    $env:PGSSLMODE = $sslAnterior
    if ($restauracionCompletada -and -not $conservarRespaldo -and (Test-Path $archivoRespaldo)) {
        Remove-Item $archivoRespaldo -Force
    }
    elseif (-not $restauracionCompletada -and (Test-Path $archivoRespaldo)) {
        Write-Warning "La restauracion no termino. El respaldo se conserva para reintentar: $archivoRespaldo"
    }
    $contrasenaOrigen = $null
    $contrasenaDestino = $null
    $contrasenaOrigenSegura = $null
    $contrasenaDestinoSegura = $null
}
