# invoice-frontend

Aplicación web para crear, calcular y generar facturas en PDF. El formulario calcula totales en tiempo real contra el backend y delega la generación del documento en el servidor.

## Stack

| | Versión |
|---|---|
| Next.js (App Router) | 16.1.6 |
| React | 19.2.3 |
| Tailwind CSS | 4 |
| react-hook-form | 7 |
| axios | 1 |
| TypeScript | 5 |

## Características

- Cálculo automático de subtotal, impuesto y descuento en cada cambio (items, ajustes)
- Soporte para facturas de tipo **Product** y **Service** (no se pueden mezclar en la misma factura)
- Impuesto y descuento configurables como valor fijo (`Money`) o porcentaje (`Percent`)
- Campos de información de empresa, emisor, receptor, número y fechas de factura
- Subida de logo de empresa — se convierte a base64 en el navegador y se incluye en el PDF generado
- Máximo 10 ítems por factura
- Generación de PDF en el backend: abre la URL resultante en una nueva pestaña automáticamente
- Mensajes de error del backend (validaciones `400 Bad Request`) mostrados al usuario en un alert

## Estructura relevante

```
app/
├── api/
│   └── axios.api.ts          # Helper POST genérico, lee NEXT_PUBLIC_API_URL
├── components/
│   ├── Header.tsx
│   ├── Invoice.tsx            # Contenedor orquestador de la factura completa
│   └── invoice/
│       ├── HeaderInvoice.tsx  # Logo, datos empresa, número y fechas
│       ├── BillingInformation.tsx
│       ├── Notes.tsx
│       ├── Price.tsx          # Panel de subtotal / tax / discount / total
│       └── table/
│           ├── Table.tsx
│           └── RowItem.tsx
├── hooks/
│   └── useInvoice.tsx         # Todo el estado y las llamadas a la API
└── interfaces/                # Tipos TypeScript compartidos
```

## Primeros pasos — local

**Requisitos:** Node.js 20+

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp ../.env.example .env.local
# Editar .env.local con el valor correcto de NEXT_PUBLIC_API_URL

# 3. Levantar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Sí | URL base del backend. **Se hornea en el bundle durante `next build`.** |

Ejemplo para desarrollo local (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> Cambiar esta variable después de un build no tiene efecto. La imagen del frontend debe reconstruirse si cambia la URL del backend.

## Scripts

```bash
npm run dev      # Servidor de desarrollo con HMR (Turbopack)
npm run build    # Build de producción (genera .next/standalone)
npm run start    # Servidor de producción
npm run lint     # ESLint
```

## Docker

El `Dockerfile` usa un build multi-etapa con salida [`standalone`](https://nextjs.org/docs/pages/api-reference/next-config-js/output) de Next.js, lo que produce una imagen mínima sin `node_modules` en el runner.

```bash
# Build manual
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:5000 \
  -t invoice-frontend .

docker run -p 3000:3000 invoice-frontend
```

O desde la raíz del monorepo (recomendado):

```bash
docker compose up --build frontend
```

## Deploy — Vercel

1. Importar `invoice-frontend/` como proyecto en Vercel (configurar *Root Directory* si es un monorepo).
2. Añadir la variable de entorno en el dashboard de Vercel:

   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://tu-backend.railway.app` |

3. Hacer un nuevo deploy después de cambiar la variable (se baka en el bundle).

## Notas técnicas

- **Renderizado**: el formulario de factura usa `"use client"` — es renderizado en el navegador. Next.js gestiona el routing y el layout del lado del servidor.
- **Recálculo automático**: `useInvoice` dispara `POST /api/v1/invoice/calculation-summary` en cada cambio a `items`, `tax` o `discount` mediante un `useEffect`.
- **Logo**: el componente `HeaderInvoice` lee el archivo con `FileReader.readAsDataURL` y almacena el resultado (data URL base64) en el estado. Se envía al backend dentro de `billingInformation[0].logo`.
- **Apertura del PDF**: `Header` llama a `window.open('', '_blank')` de forma **síncrona** antes del `await` de la petición, evitando que el navegador bloquee la pestaña como popup. Una vez recibida la URL, se asigna con `newTab.location.href`.
- **Errores de validación**: el `catch` en `Header` extrae `error.response.data.message`. Si es un array (class-validator), los mensajes se unen con `\n` y se muestran en un `alert`.
- **Variables de entorno**: `NEXT_PUBLIC_*` se incrustan en el bundle JavaScript en tiempo de build. No son configurables en runtime sin reconstruir la imagen.
