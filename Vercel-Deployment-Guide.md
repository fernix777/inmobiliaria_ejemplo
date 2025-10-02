# 🚀 Despliegue en Vercel con Supabase

## Guía completa para desplegar De Brasi Propiedades en Vercel

### 📋 Prerrequisitos:
- ✅ Cuenta en Vercel
- ✅ Proyecto configurado en Supabase
- ✅ Script SQL ejecutado en Supabase Dashboard

---

## 1. Variables de Entorno en Vercel

### Paso 1: Obtener credenciales de Supabase
```bash
# En Supabase Dashboard → Settings → API:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Paso 2: Configurar en Vercel
1. Ve a **Vercel Dashboard** → Tu proyecto
2. **Settings** → **Environment Variables**
3. Agrega estas variables:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | `your-anon-key` | Production, Preview, Development |

---

## 2. Archivo de Configuración de Vercel

Crea `vercel.json` en la raíz del proyecto:
```json
{
  "functions": {
    "src/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 3. Configurar CORS en Supabase (opcional)

Si encuentras problemas de CORS, ve a:
**Supabase Dashboard** → **Storage** → **Settings** → **Allowed Origins**

Agrega:
```
https://your-project.vercel.app
https://*.vercel-preview.app
```

---

## 4. Archivo package.json para producción

```json
{
  "name": "debrasi-propiedades",
  "version": "1.0.0",
  "description": "Dashboard de propiedades inmobiliarias",
  "scripts": {
    "build": "tailwindcss -i ./input.css -o ./css/styles.css --minify",
    "dev": "tailwindcss -i ./input.css -o ./css/styles.css --watch",
    "start": "serve -s . -p $PORT"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "serve": "^14.0.0"
  },
  "engines": {
    "node": "18.x"
  }
}
```

---

## 5. Service Worker para producción

El service worker actual funciona bien en Vercel, pero considera estas optimizaciones:

```javascript
// En sw.js - Agregar dominios de Vercel
const ALLOWED_HOSTS = [
  'localhost',
  '127.0.0.1',
  'your-project.vercel.app',
  '*.vercel-preview.app'
];

function isAllowedHost(url) {
  return ALLOWED_HOSTS.some(host => {
    if (host.includes('*')) {
      const domain = host.replace('*', '.*');
      return new RegExp(`^https?://(${domain})(:\\d+)?/?`).test(url.href);
    }
    return url.hostname === host;
  });
}
```

---

## 6. Despliegue paso a paso

### Paso 1: Preparar el proyecto
```bash
# Instalar dependencias
npm install

# Compilar CSS para producción
npm run build

# Verificar archivos críticos existen
ls -la css/styles.css
ls -la js/dashboard.js
```

### Paso 2: Subir a Git
```bash
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

### Paso 3: Desplegar en Vercel
1. **Vercel Dashboard** → **New Project**
2. Conectar tu repositorio de Git
3. **Configuración automática** (Vercel detectará el proyecto)
4. **Deploy**

### Paso 4: Configurar dominio personalizado (opcional)
- **Vercel Dashboard** → **Settings** → **Domains**
- Agrega tu dominio personalizado

---

## 7. Verificación post-despliegue

### ✅ Checklist:
- [ ] Dashboard carga sin errores de consola
- [ ] Formulario de propiedades funcional
- [ ] Imágenes se pueden subir (si bucket configurado)
- [ ] Service worker registrado correctamente
- [ ] CSS aplicado correctamente

### 🔧 Comandos útiles para debugging:
```bash
# Ver logs en Vercel
vercel logs --follow

# Ver métricas de rendimiento
vercel inspect
```

---

## 8. Solución de problemas comunes

### Problema: "Supabase client no disponible"
**Solución:** Verificar que las variables de entorno estén configuradas correctamente en Vercel.

### Problema: Service Worker no registra
**Solución:** Asegurar que el archivo `sw.js` esté en la raíz y sea accesible públicamente.

### Problema: CSS no se aplica
**Solución:** Verificar que `styles.css` esté en `/css/` y sea accesible.

### Problema: Imágenes no se cargan
**Solución:** 
1. Ejecutar script SQL completo en Supabase
2. Verificar políticas RLS del bucket
3. Configurar CORS si es necesario

---

## 9. Optimizaciones adicionales

### Para mejor rendimiento:
```javascript
// En dashboard.js - Lazy loading para gráficos
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initializeCharts();
        observer.disconnect();
      }
    });
  });
  observer.observe(document.getElementById('dashboardSection'));
}
```

### Para SEO (si es necesario):
```html
<!-- En dashboard.html - Meta tags -->
<meta name="robots" content="noindex, nofollow">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 🎯 Resultado final:
- ✅ Aplicación desplegada en Vercel
- ✅ Funcional con Supabase
- ✅ Configuración de producción optimizada
- ✅ Service worker operativo
- ✅ CSS compilado y minificado

**¿Necesitas ayuda con algún paso específico del despliegue?** 🚀
