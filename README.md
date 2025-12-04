# TravelSuites - Desarrollo Local

## 🚀 Inicio Rápido

### Opción 1: Con Vercel Dev (Recomendado)

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Ejecutar en modo desarrollo
vercel dev
```

Luego abre: `http://localhost:3000`

### Opción 2: Servidor HTTP Simple

Si solo quieres ver la UI (sin datos reales de WooCommerce):

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Luego abre: `http://localhost:8000`

**Nota:** Con esta opción verás datos de fallback, no datos reales de WooCommerce.

---

## 📋 Requisitos

- Node.js 18+ (para Vercel Dev)
- Variables de entorno configuradas (ver `.env.example`)

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
WOOCOMMERCE_URL=https://travelsuites.cl
WOOCOMMERCE_CONSUMER_KEY=tu_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=tu_consumer_secret
```

### 2. Ejecutar Vercel Dev

```bash
vercel dev
```

Esto iniciará:
- Frontend en `http://localhost:3000`
- Serverless functions en `http://localhost:3000/api/*`

---

## 🌐 Cómo Funciona

### En Producción (Deploy)
```
Usuario → Vercel CDN → /api/products → WooCommerce API
```

### En Local (Vercel Dev)
```
Usuario → localhost:3000 → /api/products → WooCommerce API
```

### En Local (Sin Vercel Dev)
```
Usuario → localhost:8000 → ❌ CORS Error → Datos de Fallback
```

---

## 🐛 Troubleshooting

### "No se pudieron cargar las propiedades"

**Causa:** Vercel Dev no está corriendo.

**Solución:**
```bash
vercel dev
```

### "Vercel dev no detectado"

**Causa:** Estás usando un servidor HTTP simple.

**Solución:** Usa `vercel dev` o acepta que verás datos de fallback.

### Puerto 3000 ocupado

```bash
vercel dev --listen 3001
```

Luego actualiza la URL en el código si es necesario.

---

## 📁 Estructura del Proyecto

```
protocolo_travel_suites/
├── api/                    # Serverless functions (Vercel)
│   ├── products.js        # GET /api/products
│   └── orders.js          # POST /api/orders
├── components/            # Componentes UI
├── services/              # Lógica de negocio
├── data/                  # Datos estáticos
├── config/                # Configuración
└── index.html            # Punto de entrada
```

---

## 🔐 Seguridad

- ✅ Credenciales en variables de entorno
- ✅ API proxy via serverless functions
- ✅ No exponer keys en el cliente
- ✅ `.env` en `.gitignore`

---

## 📝 Notas

1. **Vercel Dev** simula el entorno de producción localmente
2. Los **datos de fallback** están en `data/data.js`
3. El **cache** se guarda en localStorage (30 min)

---

## 🚢 Deploy

```bash
# Deploy a producción
vercel --prod

# Deploy a preview
vercel
```

Variables de entorno se configuran en Vercel Dashboard.
