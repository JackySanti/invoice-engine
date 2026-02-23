# invoice-backend

API REST para cálculo de totales y generación de facturas en PDF. Construida con **NestJS 11** siguiendo una arquitectura de tres capas: Domain, Infrastructure y Presentation. Sin base de datos — el backend es completamente stateless.

## Stack

| | Versión |
|---|---|
| NestJS | 11 |
| TypeScript | 5 |
| Puppeteer | 24 |
| AWS SDK v3 (S3 + Presigner) | 3 |
| class-validator / class-transformer | 0.14 / 0.5 |
| @nestjs/config | 4 |

## Arquitectura

```
src/invoice/
├── domain/                       # Lógica de negocio pura, sin dependencias externas
│   ├── dto/                      # Contratos de entrada y salida (class-validator)
│   ├── enums/                    # AmountType, InvoiceItemType
│   ├── services/
│   │   └── invoice-summary.service.ts   # Cálculo de subtotal, tax, discount y total
│   └── use-case/
│       └── invoice.use-case.ts          # Orquestación: summary + generación PDF
│
├── infrastructure/               # Integraciones con servicios externos
│   ├── aws/
│   │   └── s3.service.ts         # Upload, signed URL y delete en S3
│   └── pdf/
│       ├── puppeteer-pdf.service.ts     # Render HTML → PDF con Chromium headless
│       └── templates/
│           └── invoice.template.html   # Plantilla HTML de la factura
│
└── presentation/                 # Capa HTTP
    ├── invoice.controller.ts     # Endpoints REST
    ├── invoice.service.ts        # Delegación al use-case
    └── invoice.module.ts         # Inyección de dependencias del módulo
```

## API

Prefijo global: `/api/v1`

---

### `POST /api/v1/invoice/calculation-summary`

Calcula subtotal, impuesto, descuento y total a partir de una lista de ítems.

El orden de aplicación depende del tipo de ítem:
- **Service**: descuento primero, luego impuesto
- **Product**: impuesto primero, luego descuento

**Request body**

```json
{
  "items": [
    {
      "itemNumber": "01",
      "description": "Diseño de interfaz",
      "quantity": 3,
      "price": 200.00,
      "type": "Service"
    }
  ],
  "totals": {
    "tax": 16,
    "type_tax": "Percent",
    "discount": 50,
    "type_discount": "Money"
  }
}
```

**Response** `201 Created`

```json
{
  "subtotal": 600.00,
  "tax": 16,
  "type_tax": "Percent",
  "discount": 50,
  "type_discount": "Money",
  "total": 461.00
}
```

**Validaciones**
- `items` no puede estar vacío
- No se pueden mezclar ítems de tipo `Service` y `Product` en la misma factura
- `quantity` ≥ 1, `price` ≥ 0
- `type_tax` y `type_discount`: `"Money"` | `"Percent"`

---

### `POST /api/v1/invoice/generate-invoice`

Recibe los datos completos de la factura, genera el PDF con Puppeteer y lo sube a AWS S3.


**Request body**

```json
{
  "invoiceNo": "INV-001",
  "invoiceDate": "2026-02-23",
  "dueDate": "2026-03-23",
  "notes": "Pago a 30 días.",
  "items": [
    {
      "itemNumber": "01",
      "description": "Diseño de interfaz",
      "quantity": 3,
      "price": 200.00,
      "type": "Service"
    }
  ],
  "billingInformation": [
    {
      "type": "Company",
      "company": "Mi Empresa S.A.",
      "firstName": "Juan",
      "lastName": "Pérez",
      "address": "Av. Principal 123",
      "phoneNumber": "5551234567",
      "cityStateZip": "CDMX, 06600",
      "country": "México",
      "email": "juan@miempresa.com",
      "website": "https://miempresa.com",
      "logo": ""
    },
    {
      "type": "Client",
      "company": "Cliente S.A.",
      "firstName": "María",
      "lastName": "García",
      "address": "Calle 456",
      "cityStateZip": "Monterrey, 64000",
      "country": "México"
    }
  ],
  "total": {
    "subtotal": 600.00,
    "tax": 16,
    "type_tax": "Percent",
    "discount": 50,
    "type_discount": "Money",
    "total": 461.00
  }
}
```

**Response** `201 Created`: URL del PDF en S3 (string)

---

## Modelos y enums

### `InvoiceItemType`
| Valor | Descripción |
|---|---|
| `Service` | Ítem de tipo servicio |
| `Product` | Ítem de tipo producto |

### `AmountType`
| Valor | Descripción |
|---|---|
| `Money` | Valor absoluto monetario |
| `Percent` | Porcentaje |

### `BillingInformationDto`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `type` | `string` | Sí | `"Company"` o `"Client"` |
| `company` | `string` | Sí | Nombre de la empresa |
| `firstName` | `string` | Sí | Nombre del contacto |
| `lastName` | `string` | Sí | Apellido del contacto |
| `address` | `string` | Sí | Dirección |
| `phoneNumber` | `string` | No | Teléfono (10–20 caracteres) |
| `cityStateZip` | `string` | No | Ciudad, estado y código postal |
| `country` | `string` | No | País |
| `email` | `string` | No | Email válido |
| `website` | `string` | No | URL válida |
| `logo` | `string` | No | Logo de la empresa en formato data URL base64 (`data:image/...;base64,...`). Solo aplica al tipo `"Company"`. Se renderiza en el encabezado del PDF. |

---

## Primeros pasos — local

**Requisitos:** Node.js 20+

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp ../.env.example .env
# Editar .env con los valores correctos

# 3. Servidor de desarrollo
npm run start:dev
```

El servidor queda disponible en `http://localhost:5000/api/v1`.

## Variables de entorno

Referencia completa en [`../.env.example`](../.env.example).

| Variable | Requerida | Descripción |
|---|---|---|
| `PORT` | Sí | Puerto de escucha del servidor |
| `ENV` | No | Entorno: `development` / `production` |
| `APP_NAME` | No | Nombre descriptivo de la aplicación |
| `ALLOWED_ORIGINS` | Sí | Orígenes CORS permitidos (separados por coma) |
| `METHODS` | Sí | Métodos HTTP habilitados en CORS |
| `JWT_SECRET` | No | Secreto para firma de tokens JWT |
| `JWT_ISSUER` | No | Claim `iss` del token JWT |
| `JWT_AUDIENCE` | No | Claim `aud` del token JWT |
| `API_KEY` | No | Clave API para endpoints internos |
| `AWS_ACCESS_KEY_ID` | No* | Access key del usuario IAM de AWS |
| `AWS_SECRET_ACCESS_KEY` | No* | Secret key del usuario IAM de AWS |
| `AWS_REGION` | No* | Región del bucket S3 |
| `AWS_S3_BUCKET` | No* | Nombre del bucket S3 |
| `AWS_S3_VERSION` | No* | Versión de firma S3 (`v4`) |

> \* Opcionales para desarrollo local. Sin credenciales AWS, el cliente S3 no se inicializa y se registra un warning en los logs. La generación de PDFs no se ve afectada.

## Scripts

```bash
npm run start:dev    # Servidor con watch mode
npm run start:prod   # Producción (node dist/main)
npm run build        # Compila TypeScript a dist/
npm run test         # Unit tests (Jest)
npm run test:e2e     # Tests end-to-end
npm run test:cov     # Cobertura de tests
npm run lint         # ESLint + Prettier
```

## Docker

El `Dockerfile` usa un build multi-etapa sobre `node:20-slim` (Debian). Chromium se instala desde el sistema operativo en lugar de descargarse con Puppeteer, lo que reduce el tamaño de imagen.

```bash
# Build manual
docker build -t invoice-backend .
docker run -p 5000:5000 --env-file .env invoice-backend
```

O desde la raíz del monorepo (recomendado):

```bash
docker compose up --build backend
```

## Deploy — Railway

1. Crear un nuevo proyecto en [Railway](https://railway.app) y conectar el repositorio.
2. Configurar *Root Directory* como `invoice-backend`.
3. Railway detecta el `Dockerfile` automáticamente.
4. Añadir las variables de entorno en el panel de Railway (equivalentes al `.env`).
5. Cambiar `ALLOWED_ORIGINS` para incluir el dominio del frontend en producción.

## Notas técnicas

- **Stateless**: no hay base de datos ni sesiones. Cada request es independiente.
- **PDF con Puppeteer**: `PuppeteerPdfService` lanza un browser Chromium headless, inyecta los datos del DTO en el template HTML (sustitución de placeholders `{{...}}`) y exporta a PDF formato A4. El logo se inyecta como `<img src="data:...">` directamente en el HTML para que Chromium lo renderice sin peticiones de red adicionales. Usa `--no-sandbox` y `--disable-setuid-sandbox` para compatibilidad con contenedores Linux.
- **Chromium en Docker**: `PUPPETEER_SKIP_DOWNLOAD=true` evita que npm descargue el Chrome bundled de Puppeteer (~300 MB). Se usa en su lugar el Chromium del sistema (`/usr/bin/chromium`), apuntado con `PUPPETEER_EXECUTABLE_PATH`.
- **AWS S3 opcional**: si `AWS_ACCESS_KEY_ID` o `AWS_SECRET_ACCESS_KEY` no están configuradas, `AwsS3Service` inicializa `s3Client = null` y registra un warning. El servicio no rompe el arranque de la aplicación.
- **Validación**: `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true` — cualquier campo extra en el body es rechazado automáticamente.
- **Assets HTML**: `nest-cli.json` tiene `"assets": ["**/*.html"]`, por lo que la plantilla `invoice.template.html` se copia a `dist/` durante el build.
