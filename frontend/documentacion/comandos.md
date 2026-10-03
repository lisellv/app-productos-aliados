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

## Iniciar el frontend junto al backend

En una terminal, levanta PostgreSQL y backend desde la raíz del repositorio:

```powershell
docker compose -f nivel2-db-backend.yml up -d --build
```

En otra terminal, desde `frontend/`, inicia el servidor Vite. El proxy configurado en Vite enviará `/api` al backend en `localhost:8080`:

```powershell
cd frontend
npm run dev
```

Abre `http://localhost:5173`. Para detener el backend, desde la raíz ejecuta:

```powershell
docker compose -f nivel2-db-backend.yml down
```

> La imagen Docker del frontend todavía no se puede construir: su Dockerfile copia `nginx/default.conf.template`, pero ese archivo no existe. Usa Vite con los comandos anteriores hasta que la configuración del Dockerfile y Nginx esté alineada.
