# Kit 2 · Entornos escalonados con Docker y Kubernetes

Tres niveles que se construyen uno sobre otro. Cada nivel incluye al anterior,
así que solo tienes que elegir **cuánto** de la aplicación quieres en contenedores.

| Nivel | Qué corre en contenedores | Qué corres en tu equipo | Para qué |
|---|---|---|---|
| 1 | PostgreSQL | Backend y frontend | Desarrollar y depurar el backend desde el IDE |
| 2 | PostgreSQL + backend | Frontend (opcional) | Probar la API con Postman / Swagger |
| 3 | PostgreSQL + backend + frontend | Nada | Pruebas completas, como en producción |

Los niveles 2 y 3 también vienen como manifiestos de **Kubernetes** (`k8s/`).

```
kit2/
├── .env.example            ← copiar como .env (opcional)
├── nivel1-db.yml
├── nivel2-db-backend.yml   ← incluye nivel1
├── nivel3-full.yml         ← incluye nivel2
├── docker/
│   ├── db/init/            ← scripts SQL de primer arranque
│   ├── backend/            ← Dockerfile (Gradle), Dockerfile.maven, .dockerignore
│   └── frontend/           ← Dockerfile, .dockerignore, nginx/
└── k8s/
    ├── nivel2/             ← db + backend
    └── nivel3/             ← db + backend + frontend (+ opcional/ingress.yaml)
```

## Elegir motor de base de datos (`bases-de-datos/`)

Además de los tres niveles (PostgreSQL), la carpeta `bases-de-datos/` trae un archivo
por motor y versión. Cada uno levanta la base y, si quieres, tu backend: descargado de
GitHub (`ghcr.io`) o construido desde tu código (`-f backend-local.yml`).

| Archivo | Motor | Dificultad |
|---|---|---|
| `postgres-17.yml`, `postgres-16.yml` | PostgreSQL | Básica |
| `mysql-8.4.yml`, `mysql-8.0.yml` | MySQL | Básica |
| `sqlserver-2022.yml`, `sqlserver-2019.yml` | SQL Server | Intermedia (no crea la base solo: lo hace `db-init`) |

```bash
cd bases-de-datos
cp .env.example .env                                   # BACKEND_IMAGE, BACKEND_DIR, JWT_SECRET
docker compose -f postgres-17.yml up -d db adminer     # solo la base (backend en tu IDE)
docker compose -f postgres-17.yml up -d                # + backend de GitHub
docker compose -f postgres-17.yml -f backend-local.yml up -d --build   # + backend local
```

Para Kubernetes, `k8s/motores/mysql/` y `k8s/motores/sqlserver/` reemplazan a
`01-secret.yaml`, `02-configmap.yaml` y `10-db.yaml` del nivel 2 o 3:

```bash
kubectl apply -f k8s/nivel2/00-namespace.yaml -f k8s/motores/mysql/ -f k8s/nivel2/20-backend.yaml
```

Las guías del alumno (`Guia-Kit2-1-Docker-Compose.docx` y `Guia-Kit2-2-Kubernetes.docx`)
explican cada parámetro paso a paso.

## Requisitos

- Docker Desktop (o Docker Engine) con **Compose v2.20 o superior** (`docker compose version`).
- Para Kubernetes: Docker Desktop con Kubernetes activado, minikube o kind, y `kubectl`.

## Preparación (una sola vez)

1. Ubica `kit2` al lado de tus repositorios:

   ```
   mis-proyectos/
   ├── kit2/
   ├── ServicesBackend/
   └── frontend/
   ```

   Si tus carpetas tienen otro nombre o están en otro lugar, cópialo como `.env`
   (`cp .env.example .env`) y edita `BACKEND_DIR` y `FRONTEND_DIR`.

2. Copia los Dockerfiles a la raíz de cada repositorio (el Dockerfile es parte del
   proyecto, no del kit):

   ```bash
   cp docker/backend/Dockerfile docker/backend/.dockerignore ../ServicesBackend/
   cp -r docker/frontend/Dockerfile docker/frontend/.dockerignore docker/frontend/nginx ../frontend/
   ```

   En Windows (PowerShell) usa `Copy-Item` o el explorador de archivos.
   Si tu backend usa Maven, copia `Dockerfile.maven` y renómbralo a `Dockerfile`.

3. Revisa el nombre de la variable del JWT. El kit envía `JWT_SECRET`, que Spring
   asocia a la propiedad `jwt.secret`. Si tu proyecto usa otra (por ejemplo
   `app.jwt.secret` → `APP_JWT_SECRET`), cambia el nombre en el compose y en
   `20-backend.yaml`.

## Nivel 1 · Solo base de datos

```bash
docker compose -f nivel1-db.yml up -d
```

Configura tu backend local (`application.properties`) para apuntar a Docker:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/servicetechdb
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Y ejecútalo como siempre (IntelliJ o `./gradlew bootRun`).

Para ver las tablas en el navegador, agrega Adminer:

```bash
docker compose -f nivel1-db.yml --profile herramientas up -d
# http://localhost:8081 · Servidor: db · Usuario: postgres · Clave: postgres
```

## Nivel 2 · Base de datos + backend

```bash
docker compose -f nivel2-db-backend.yml up -d --build
docker compose -f nivel2-db-backend.yml logs -f backend   # ver el arranque de Spring
```

- API: `http://localhost:8080/api/...`
- Swagger UI (si usas springdoc): `http://localhost:8080/swagger-ui.html`
- El frontend puede seguir local con `npm run dev`: el proxy de Vite apunta a `:8080`.

> Detén tu backend local antes: ambos usan el puerto 8080.

## Nivel 3 · Todo en contenedores

```bash
docker compose -f nivel3-full.yml up -d --build
```

Abre `http://localhost:3000`. Nginx sirve el frontend y reenvía `/api` al backend,
por lo que el navegador ve un solo origen y no hace falta configurar CORS.

## Comandos útiles (cualquier nivel)

```bash
docker compose -f nivel3-full.yml ps                 # estado de los servicios
docker compose -f nivel3-full.yml logs -f            # logs de todos
docker compose -f nivel3-full.yml up -d --build backend   # reconstruir solo el backend
docker compose -f nivel3-full.yml down               # detener (los datos se conservan)
docker compose -f nivel3-full.yml down -v            # detener y BORRAR los datos
```

Los tres niveles comparten el proyecto `kit2` y el volumen `pgdata`, así que los
datos se conservan al cambiar de nivel. Al bajar de nivel (3 → 1) agrega
`--remove-orphans` para detener los servicios que sobran.

## Kubernetes (niveles 2 y 3)

### 1. Construir y cargar las imágenes

Kubernetes no compila código: usa imágenes ya construidas. Constrúyelas con el compose:

```bash
docker compose -f nivel3-full.yml build     # crea kit2/backend:1.0 y kit2/frontend:1.0
```

Luego hazlas visibles para el clúster según cuál uses:

| Clúster | Comando |
|---|---|
| Docker Desktop | Nada, comparte las imágenes locales |
| minikube | `minikube image load kit2/backend:1.0` y `minikube image load kit2/frontend:1.0` |
| kind | `kind load docker-image kit2/backend:1.0 kit2/frontend:1.0` |

### 2. Desplegar

```bash
kubectl apply -f k8s/nivel2/     # db + backend
# o
kubectl apply -f k8s/nivel3/     # db + backend + frontend

kubectl get pods -n kit2 -w      # esperar a que estén Running y READY 1/1
```

Los archivos van numerados para que se apliquen en orden (namespace → secret →
configmap → db → backend → frontend).

### 3. Acceder

| Nivel | Docker Desktop / kind con puertos mapeados | minikube |
|---|---|---|
| 2 (backend) | `http://localhost:30080` | `minikube service backend -n kit2 --url` |
| 3 (frontend) | `http://localhost:30000` | `minikube service frontend -n kit2 --url` |

> Docker Desktop reciente crea el clúster con **kind** (nodos `desktop-control-plane`,
> `desktop-worker`). En ese modo los NodePort **no** quedan en `localhost`: usa `port-forward`.

Alternativa que funciona en cualquier clúster:

```bash
kubectl port-forward -n kit2 svc/backend 8080:8080     # nivel 2
kubectl port-forward -n kit2 svc/frontend 3000:80      # nivel 3
```

Ingress (opcional, nivel 3): ver instrucciones dentro de `k8s/nivel3/opcional/ingress.yaml`.

### 4. Actualizar y limpiar

```bash
# Tras cambiar código: reconstruir, recargar (minikube/kind) y reiniciar
docker compose -f nivel3-full.yml build backend
kubectl rollout restart deployment/backend -n kit2

kubectl delete namespace kit2    # borra todo, incluido el volumen de la base
```

### Equivalencias Compose → Kubernetes

| Docker Compose | Kubernetes |
|---|---|
| `services.db` + volumen `pgdata` | `StatefulSet` + `volumeClaimTemplates` (PVC) |
| `services.backend` | `Deployment` + `Service` |
| `environment` con claves | `Secret` |
| `environment` sin claves | `ConfigMap` |
| `depends_on: service_healthy` | `initContainer` que espera a la db + `readinessProbe` |
| `ports: "8080:8080"` | `Service` tipo `NodePort` (o `port-forward`) |
| Nombre del servicio como host (`db`) | Nombre del `Service` como host (`db`) |

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `port is already allocated` en 5432 | PostgreSQL instalado en tu equipo | `DB_PORT=5433` en `.env` (y en tu `application.properties`) |
| `include` no reconocido | Compose antiguo | Actualiza Docker Desktop (Compose ≥ 2.20) |
| `gradlew: not found` o `\r` | Saltos de línea de Windows | El Dockerfile ya lo corrige; verifica que `gradlew` y `gradle/` estén en el repo |
| Backend: `Connection refused` a la db | Usa `localhost` dentro del contenedor | Dentro de Docker/K8s la base se llama `db` |
| El build del frontend falla en `tsc` | Errores de tipos que Vite en modo dev ignora | Corrige los errores o compila igual que en local (`npm run build`) para verlos |
| Pod en `ErrImagePull` / `ImagePullBackOff` | El clúster no ve la imagen local | Paso 1 de Kubernetes (`minikube image load` / `kind load`) |
| Pod en `CrashLoopBackOff` | Error al arrancar Spring | `kubectl logs -n kit2 deploy/backend` |
| Cambié `DB_PASSWORD` y no conecta | La clave se fija al crear el volumen | `down -v` (compose) o borrar el PVC (K8s) para recrearlo |

> Las credenciales de este kit son de práctica. En un proyecto real no se suben
> secretos a git: se usan variables del pipeline, Sealed Secrets o un gestor de secretos.
