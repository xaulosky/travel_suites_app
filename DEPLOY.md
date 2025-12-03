# Deploy a Vercel - Protocolo Travel Suites

Guía paso a paso para desplegar la aplicación en Vercel de forma segura.

## 📋 Prerequisitos

- Cuenta en [Vercel](https://vercel.com)
- Vercel CLI instalado: `npm i -g vercel`
- Credenciales de WooCommerce (ya configuradas en `.env.local`)

## 🚀 Pasos para Deploy

### 1. Preparar el Proyecto

El proyecto ya está configurado con:
- ✅ Funciones serverless en `/api`
- ✅ Variables de entorno en `.env.local`
- ✅ Configuración de Vercel en `vercel.json`
- ✅ `.gitignore` actualizado

### 2. Probar Localmente

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Ejecutar en modo desarrollo
vercel dev
```

Esto iniciará un servidor local que simula el entorno de Vercel. Prueba que:
- `/api/products` retorna los productos
- `/api/orders` puede crear órdenes
- La aplicación funciona correctamente

### 3. Hacer Deploy

```bash
# Login a Vercel (solo la primera vez)
vercel login

# Deploy a producción
vercel --prod
```

### 4. Configurar Variables de Entorno en Vercel

Después del primer deploy, ve al [Dashboard de Vercel](https://vercel.com/dashboard):

1. Selecciona tu proyecto
2. Ve a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

| Variable | Valor |
|----------|-------|
| `WOOCOMMERCE_URL` | `https://travelsuites.cl` |
| `WOOCOMMERCE_CONSUMER_KEY` | `ck_17efb8d2c990cff8ad90aabd24e1d3c05a1ab5e8` |
| `WOOCOMMERCE_CONSUMER_SECRET` | `cs_e1fb69c842c541384ee89cc5881ab37d6c876b2b` |

4. Marca las variables para **Production**, **Preview**, y **Development**
5. Guarda los cambios

### 5. Re-deploy

Después de configurar las variables de entorno:

```bash
vercel --prod
```

## 🔒 Seguridad

### ✅ Qué está protegido

- Las credenciales de WooCommerce están en variables de entorno del servidor
- Las funciones serverless actúan como proxy seguro
- El código del cliente NO tiene acceso a las credenciales
- `.env.local` está en `.gitignore` y NO se sube a Git

### ⚠️ Importante

- **NUNCA** commitees `.env.local` a Git
- **NUNCA** expongas las credenciales en el código del cliente
- Las variables de entorno en Vercel están encriptadas y seguras

## 📁 Estructura de Archivos

```
protocolo_travel_suites/
├── api/
│   ├── products.js          # Serverless function para productos
│   └── orders.js            # Serverless function para órdenes
├── config/
│   └── woocommerce.js       # Ya no contiene credenciales
├── services/
│   └── woocommerce.service.js  # Llama a /api en lugar de WooCommerce
├── .env.local               # Variables locales (NO commitear)
├── .gitignore               # Excluye archivos sensibles
└── vercel.json              # Configuración de Vercel
```

## 🧪 Testing

### Probar API Localmente

```bash
# Iniciar servidor local
vercel dev

# En otra terminal, probar endpoints
curl http://localhost:3000/api/products
curl -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -d '{...}'
```

### Probar en Producción

Después del deploy, tu app estará disponible en:
```
https://tu-proyecto.vercel.app
```

## 🐛 Troubleshooting

### Error: "WooCommerce credentials not configured"

**Solución:** Verifica que las variables de entorno estén configuradas en Vercel Dashboard.

### Error: "CORS"

**Solución:** El archivo `vercel.json` ya tiene la configuración de CORS. Si persiste, verifica que esté correctamente configurado.

### Error: "Module not found"

**Solución:** Vercel usa Node.js para las funciones serverless. Asegúrate de que no estés usando sintaxis de ES6 modules en `/api`.

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables en Vercel](https://vercel.com/docs/projects/environment-variables)

## ✨ Próximos Pasos

Después del deploy exitoso:

1. ✅ Verifica que la app funcione correctamente
2. ✅ Prueba crear una orden de prueba
3. ✅ Configura un dominio personalizado (opcional)
4. ✅ Configura analytics de Vercel (opcional)
