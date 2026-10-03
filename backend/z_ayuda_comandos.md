# Compilar y ejecutar el backend

Ejecuta estos comandos desde la raiz del repositorio, donde estan las carpetas `backend/` y `frontend/`.

## Requisitos

- Java 21.
- Docker Compose, para iniciar PostgreSQL con la configuracion local del proyecto.
- Configuracion local predeterminada: `localhost:5432`, base `app_productos_aliados_local`, usuario `postgres` y contrasena `admin`.
- Usa una base vacia para este proyecto. No reutilices `workshop` ni una base que ya contenga tipos o migraciones de otro intento; no ejecutes `flyway repair` para solucionar este conflicto.

El backend lee `DB_URL`, `DB_USER` y `DB_PASSWORD` del entorno. El puerto predeterminado es `8080`; se puede cambiar con `PORT`.

## Iniciar PostgreSQL local

Desde la raiz del repositorio, inicia solo el servicio de base de datos:

```powershell
docker compose -f backend/docker-compose.yml up -d db
```

Comprueba que este saludable:

```powershell
docker compose -f backend/docker-compose.yml ps
```

Para detener PostgreSQL sin borrar los datos:

```powershell
docker compose -f backend/docker-compose.yml down
```

## Windows (PowerShell)

Compilar y ejecutar las pruebas:

```powershell
.\backend\gradlew.bat -p backend clean build
```

Iniciar PostgreSQL local y el backend:

```powershell
docker compose -f backend/docker-compose.yml up -d db
.\backend\gradlew.bat -p backend bootRun
```

El backend estara disponible en `http://localhost:8080`. Verifica el estado con:

```powershell
Invoke-RestMethod http://localhost:8080/actuator/health
```

Debe mostrar `status: UP`. `bootRun` queda ejecutandose en esa terminal; presiona `Ctrl+C` para detener el backend.

Para compilar sin ejecutar las pruebas:

```powershell
.\backend\gradlew.bat -p backend clean build -x test
```

Para ejecutar el JAR compilado:

```powershell
java -jar .\backend\build\libs\app-productos-aliados-back-end-0.0.1-SNAPSHOT.jar
```

## Linux o macOS

Compilar y ejecutar las pruebas:

```bash
./backend/gradlew -p backend clean build
```

Iniciar PostgreSQL local y el backend:

```bash
docker compose -f backend/docker-compose.yml up -d db
./backend/gradlew -p backend bootRun
```

El backend estara disponible en `http://localhost:8080`. Verifica el estado con:

```bash
curl http://localhost:8080/actuator/health
```

Debe responder `{"status":"UP"}`. `bootRun` queda ejecutandose en esa terminal; presiona `Ctrl+C` para detener el backend.

Para compilar sin ejecutar las pruebas:

```bash
./backend/gradlew -p backend clean build -x test
```

Para ejecutar el JAR compilado:

```bash
java -jar backend/build/libs/app-productos-aliados-back-end-0.0.1-SNAPSHOT.jar
```

## Conectar a PostgreSQL de Render (opcional)

No guardes la URL completa ni la contrasena de Render en este archivo ni en Git. Usa la URL JDBC con el host y la base de Render, y configura usuario y contrasena por separado. `sslmode=require` habilita TLS para la conexion externa.

PowerShell:

```powershell
$env:DB_URL = "jdbc:postgresql://HOST_RENDER:5432/NOMBRE_BASE?sslmode=require"
$env:DB_USER = "USUARIO_RENDER"
$securePassword = Read-Host "Contrasena de PostgreSQL" -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", $securePassword).Password
$env:PORT = "8080"
.\backend\gradlew.bat -p backend bootRun
```

Linux o macOS:

```bash
export DB_URL="jdbc:postgresql://HOST_RENDER:5432/NOMBRE_BASE?sslmode=require"
export DB_USER="USUARIO_RENDER"
read -rsp "Contrasena de PostgreSQL: " DB_PASSWORD; printf '\n'
export DB_PASSWORD
export PORT="8080"
./backend/gradlew -p backend bootRun
unset DB_PASSWORD
```

Reemplaza `HOST_RENDER`, `NOMBRE_BASE` y `USUARIO_RENDER` con los valores de Render. No pegues la URL original con credenciales en comandos, archivos versionados ni capturas.
