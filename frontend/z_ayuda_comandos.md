# Frontend: desarrollo, build y ejecución

Ejecuta los comandos desde la raíz del repositorio. El despliegue integrado usa `nivel3-full.yml`: PostgreSQL, backend y frontend. La web queda en `http://localhost:3000`; el backend también se publica en `http://localhost:8080`.

## Requisitos

- Docker Desktop iniciado y funcional.
- Node.js 22 o posterior para desarrollo y build del frontend.
- Java 21 si ejecutas el backend fuera de Docker.

## Levantar todo el proyecto con Docker

En PowerShell, crea una clave local de JWT para este proceso y levanta los tres servicios. No guardes esta clave en el repositorio. Mantén la misma terminal abierta mientras uses el stack para que la clave siga disponible:

```powershell
$jwtBytes = [byte[]]::new(32)
$random = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$random.GetBytes($jwtBytes)
$random.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($jwtBytes)

docker compose -f nivel3-full.yml up -d --build
```

La primera compilación del backend puede tardar varios minutos. Comprueba los tres servicios:

```powershell
docker compose -f nivel3-full.yml ps
```

Comprueba que el backend y la base respondan:

```powershell
Invoke-RestMethod http://localhost:8080/actuator/health
Invoke-WebRequest http://localhost:3000/home.html -UseBasicParsing
Invoke-WebRequest http://localhost:3000/api/productos -UseBasicParsing
```

El health endpoint debe indicar `UP`; las dos solicitudes HTTP deben responder `200`. Para revisar el inicio y las migraciones de Flyway:

```powershell
docker compose -f nivel3-full.yml logs --tail 100 backend
```

Detén los servicios conservando los datos de PostgreSQL:

```powershell
docker compose -f nivel3-full.yml down
```

No agregues `-v` a `down`, porque eliminaría el volumen local de la base de datos. Para iniciar otra vez desde la misma terminal, vuelve a ejecutar `docker compose -f nivel3-full.yml up -d` sin cambiar `JWT_SECRET`.

## Desarrollo local

Instala las dependencias (usa `npm ci` después de clonar o cuando cambie `package-lock.json`):

```powershell
cd frontend
npm ci
```

Inicia Vite en `http://localhost:5173`. El proxy de desarrollo envía `/api` a `http://localhost:8080`, así que el backend debe estar levantado:

```powershell
npm run dev
```

## Empaquetar

Genera el sitio de producción en `frontend/dist/`:

```powershell
npm run build
```

Para revisar el build localmente en `http://localhost:4173`:

```powershell
npm run preview
```

## Ejecutar solo el frontend con Vite

Para desarrollo visual sin Docker, inicia primero el backend y PostgreSQL según `backend/z_ayuda_comandos.md`. Después, desde `frontend/`:

```powershell
npm ci
npm run dev
```

Abre `http://localhost:5173`. El proxy de Vite envía `/api` a `http://localhost:8080`.
