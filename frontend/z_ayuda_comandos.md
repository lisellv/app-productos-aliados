# Frontend: desarrollo, build y ejecución

Ejecuta los comandos desde la raíz del repositorio.

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

## Construir y ejecutar con Docker

Primero levanta PostgreSQL y backend desde la raíz del repositorio:

```powershell
docker compose -f nivel2-db-backend.yml up -d --build
```

En otra terminal, construye la imagen del frontend:

```powershell
docker build -t proyecto-final-frontend ./frontend
```

Ejecuta Nginx en `http://localhost:3000`. El proxy del frontend enviará `/api` al backend publicado en el puerto `8080` del host:

```powershell
docker run -d --name proyecto-final-frontend -p 3000:8080 -e BACKEND_URL=http://host.docker.internal:8080 proyecto-final-frontend
```

Comprueba que Nginx entregue la página:

```powershell
Invoke-WebRequest http://localhost:3000/home.html -UseBasicParsing
```

Detén el frontend y el stack del backend cuando termines:

```powershell
docker rm -f proyecto-final-frontend
docker compose -f nivel2-db-backend.yml down
```
