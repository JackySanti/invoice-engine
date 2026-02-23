# Invoice Engine

Monorepo para generación de facturas en PDF. El usuario completa un formulario interactivo en el frontend; el backend calcula los totales, genera el documento con Chromium headless y lo almacena en AWS S3.

- **Frontend**: [`invoice-frontend/`](./invoice-frontend/README.md) — Next.js 16, React 19, Tailwind CSS 4
- **Backend**: [`invoice-backend/`](./invoice-backend/README.md) — NestJS 11, Puppeteer 24, AWS S3

---

## Estructura del repositorio

```
invoice-engine/
├── invoice-frontend/          # Aplicación Next.js
│   ├── app/
│   │   ├── api/               # Cliente HTTP (axios)
│   │   ├── components/        # Componentes de la factura
│   │   ├── hooks/             # useInvoice — estado y llamadas a la API
│   │   └── interfaces/        # Tipos TypeScript
│   ├── Dockerfile
│   └── README.md
│
├── invoice-backend/           # API NestJS
│   ├── src/
│   │   ├── invoice/
│   │   │   ├── domain/        # DTOs, enums, lógica de cálculo, use-cases
│   │   │   ├── infrastructure/# Puppeteer (PDF) + AWS S3
│   │   │   └── presentation/  # Controllers y módulo NestJS
│   │   └── main.ts            # Bootstrap: puerto, CORS, ValidationPipe
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml
├── .env                       # Variables activas (no commitear)
├── .env.example               # Plantilla de variables de entorno
└── README.md
```

---

## Arquitectura

```
  Navegador
     │
     │  POST /api/v1/invoice/calculation-summary
     │  POST /api/v1/invoice/generate-invoice
     ▼
┌─────────────────┐         ┌──────────────────────────────────────┐
│   invoice-      │ ──────► │           invoice-backend            │
│   frontend      │         │                                      │
│  (Next.js 16)   │         │  Presentation  →  Domain  →  Infra  │
│   :3000         │         │                      │          │    │
└─────────────────┘         │                  Cálculo    Puppeteer│
                            │                  totales    + S3     │
                            └──────────────────────────────────────┘
                                                              │
                                                              ▼
                                                        AWS S3 Bucket
                                                       (PDF generado)
```

**Flujo principal:**

1. El usuario llena el formulario en el frontend.
2. En cada cambio de ítems o ajustes, el frontend llama a `calculation-summary` y actualiza el total en pantalla.
3. Al confirmar, el frontend llama a `generate-invoice` con los datos completos (incluyendo el logo en base64 si se subió).
4. El backend renderiza el HTML de la factura con Puppeteer (logo incluido), genera el PDF y lo sube a S3.
5. El backend retorna la URL del PDF; el frontend la abre en una nueva pestaña. Si hay errores de validación, se muestran al usuario en un alert.

---

## Quick start con Docker

**Requisitos:** Docker Desktop con Compose V2 (`docker compose`).

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd invoice-engine

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env — al menos NEXT_PUBLIC_API_URL y las credenciales AWS si se necesitan

# 3. Levantar todos los servicios
docker compose up --build
```

| Servicio | URL local |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000/api/v1 |

Para detener:

```bash
docker compose down
```

Para reconstruir un solo servicio tras un cambio:

```bash
docker compose up --build backend
docker compose up --build frontend
```

---

## Desarrollo local sin Docker

Requiere Node.js 20+ en cada servicio.

**Backend:**

```bash
cd invoice-backend
npm install
cp ../.env.example .env   # ajustar PORT, ALLOWED_ORIGINS y AWS si aplica
npm run start:dev
```

**Frontend** (en otra terminal):

```bash
cd invoice-frontend
npm install
# Crear .env.local con:
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

---

## Puertos por defecto

| Servicio | Puerto en el host | Puerto interno | Configurable en |
|---|---|---|---|
| Frontend | `3000` | `3000` | `FRONTEND_PORT` en `.env` |
| Backend | `5000` | `5000` | `PORT` en `.env` / `BACKEND_PORT` en `.env` |

---

## Variables de entorno

La referencia completa está en [`.env.example`](./.env.example). A continuación las variables esenciales para arrancar:

```env
# Puertos expuestos (docker-compose)
FRONTEND_PORT=3000
BACKEND_PORT=5000

# URL del backend — se baka en el bundle del frontend al hacer build
NEXT_PUBLIC_API_URL=http://localhost:5000

# Configuración del backend
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
METHODS=GET,HEAD,PUT,PATCH,POST,DELETE

# AWS S3 — opcionales en desarrollo local
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
AWS_S3_VERSION=v4
```

> `NEXT_PUBLIC_API_URL` debe apuntar a la URL **pública** del backend en producción (dominio de Railway, etc.). Cambiarla requiere reconstruir la imagen del frontend.

---

## Deploy en producción

### Frontend → Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com).
2. Configurar **Root Directory**: `invoice-frontend`.
3. Añadir la variable de entorno en el dashboard:
   - `NEXT_PUBLIC_API_URL` → `https://tu-backend.railway.app`
4. Vercel detecta Next.js automáticamente y realiza el build.

### Backend → Railway

1. Crear un nuevo proyecto en [railway.app](https://railway.app) y conectar el repositorio.
2. Configurar **Root Directory**: `invoice-backend`.
3. Railway detecta el `Dockerfile` automáticamente.
4. Añadir todas las variables del bloque backend en el panel de Railway.
5. Actualizar `ALLOWED_ORIGINS` con el dominio de producción del frontend:
   ```
   ALLOWED_ORIGINS=https://tu-frontend.vercel.app
   ```

---

## CI/CD

El proyecto no incluye un pipeline de CI/CD predefinido. A continuación, una configuración mínima recomendada para GitHub Actions:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: invoice-backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: invoice-backend/package-lock.json
      - run: npm ci
      - run: npm run build
      - run: npm run test

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: invoice-frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: invoice-frontend/package-lock.json
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_API_URL: http://localhost:5000
```

Vercel y Railway pueden configurarse para hacer deploy automático en cada push a `main` desde sus respectivos dashboards, sin necesidad de un paso adicional en el pipeline.

---

## Documentación por servicio

| Servicio | README |
|---|---|
| Frontend | [invoice-frontend/README.md](./invoice-frontend/README.md) |
| Backend | [invoice-backend/README.md](./invoice-backend/README.md) |
