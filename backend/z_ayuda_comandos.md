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

## Conectar a PostgreSQL administrado (Render o Aiven)

El backend usa PostgreSQL y Flyway ejecuta las migraciones versionadas al iniciar. Para conectar Render a Aiven, configura en el servicio web de Render las variables `DB_URL`, `DB_USER` y `DB_PASSWORD`. En `DB_URL`, usa el host, puerto y nombre de base de Aiven con `sslmode=require`, por ejemplo `jdbc:postgresql://HOST_AIVEN:PUERTO/BASE?sslmode=require`. No guardes la URI de servicio ni contrasenas en Git, archivos locales o capturas.

Para reemplazar la base de Render y conservar sus datos:

1. Crea una base PostgreSQL vacia en Aiven, compatible con PostgreSQL 16 o posterior.
2. Deten temporalmente las escrituras de la aplicacion para no perder operaciones nuevas durante la copia.
3. Instala las herramientas cliente de PostgreSQL (`pg_dump`, `pg_restore` y `psql`) en una maquina segura con acceso a ambas bases.
4. Ejecuta `./backend/scripts/migrar-render-a-aiven.ps1` desde la raiz del repositorio. El script solicita hosts, bases, usuarios y contrasenas; las contrasenas se solicitan como entrada segura y no deben pasarse como argumentos.
5. En Render, actualiza `DB_URL`, `DB_USER` y `DB_PASSWORD` con los datos de Aiven y despliega la ultima version del backend.
6. Revisa los logs del backend y confirma que Flyway aplico las migraciones pendientes. En Aiven, confirma la version con la consulta siguiente:

```sql
SELECT version, description, success
FROM public.flyway_schema_history
ORDER BY installed_rank DESC
LIMIT 1;
```

La version esperada en este codigo es `28` (`link profiles from unambiguous requests`). Si la restauracion se interrumpe, no apuntes Render a la base parcialmente restaurada; vuelve a crear una base destino vacia antes de repetirla. Mantén una copia de seguridad independiente antes de iniciar el cambio.

La migracion de copia ajusta el checksum de Flyway V27 unicamente cuando encuentra el valor anterior conocido (`-825257792`), necesario porque el archivo V27 fue normalizado despues de aplicarse. No cambia filas de negocio. Si encuentra otro checksum, se detiene para evitar una reparacion automatica inesperada.

PowerShell:

```powershell
$env:DB_URL = "jdbc:postgresql://HOST_AIVEN:PUERTO/BASE?sslmode=require"
$env:DB_USER = "USUARIO_AIVEN"
$securePassword = Read-Host "Contrasena de Aiven" -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", $securePassword).Password
$env:PORT = "8080"
.\backend\gradlew.bat -p backend bootRun
```

Linux o macOS:

```bash
export DB_URL="jdbc:postgresql://HOST_AIVEN:PUERTO/BASE?sslmode=require"
export DB_USER="USUARIO_AIVEN"
read -rsp "Contrasena de Aiven: " DB_PASSWORD; printf '\n'
export DB_PASSWORD
export PORT="8080"
./backend/gradlew -p backend bootRun
unset DB_PASSWORD
```

Reemplaza los valores de ejemplo con los datos de conexion de Aiven, pero no incluyas la contrasena dentro de `DB_URL`.

## Publicar frontend en Render

El archivo `render.yaml` define solo el Static Site del frontend. El backend y PostgreSQL existentes no se recrean. En Render, crea o sincroniza un Blueprint desde este repositorio y confirma el servicio `app-productos-aliados-frontend`.

En el servicio web backend existente, conserva las variables actuales de base de datos y agrega `CORS_ALLOWED_ORIGINS` con el origen exacto del Static Site, por ejemplo `https://app-productos-aliados-frontend.onrender.com`. No uses comodines para permitir cualquier origen. Guarda el cambio para que Render reinicie el backend.

El build del frontend usa `VITE_API_URL` para llamar al backend por HTTPS. Después del despliegue, comprueba `/`, `/cart` y `/requests/new` en el Static Site, además de `https://app-productos-aliados.onrender.com/actuator/health`. Para confirmar que la base existente se conservó y Flyway terminó, revisa los logs del backend y consulta `flyway_schema_history` en el dashboard PostgreSQL de Render.
