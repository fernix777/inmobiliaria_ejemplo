# Guía de Despliegue

Esta guía te ayudará a desplegar el sitio de De Brasi Propiedades en producción.

## 📋 Pre-requisitos

- [ ] Cuenta de hosting (Apache/Nginx recomendado)
- [ ] Dominio configurado (debrasi.com.ar)
- [ ] Certificado SSL (Let's Encrypt recomendado)
- [ ] Cuenta de Supabase configurada
- [ ] Node.js instalado localmente para build

## 🚀 Proceso de Despliegue

### 1. Preparar el Build

```bash
# Instalar dependencias
npm install

# Compilar Tailwind CSS
npm run build:css

# Verificar que no hay errores
npm run lint
```

### 2. Configurar Variables de Entorno

Crea `js/supabaseConfig.js` con tus credenciales de producción:

```javascript
window.__SUPABASE_CONFIG__ = {
  url: 'https://tu-proyecto.supabase.co',
  anonKey: 'tu-anon-key-de-produccion'
};
```

**⚠️ IMPORTANTE**: Nunca commitees este archivo. Ya está en `.gitignore`.

### 3. Optimizar Assets

```bash
# Comprimir imágenes (si tienes imagemin instalado)
npx imagemin images/* --out-dir=images/optimized

# Minificar JavaScript (opcional, ya que usamos módulos)
# Los navegadores modernos manejan bien ES6 modules
```

### 4. Verificar Archivos de Configuración

#### .htaccess (Apache)
- ✅ Redirección HTTPS
- ✅ Headers de seguridad
- ✅ Compresión GZIP
- ✅ Caché de navegador
- ✅ Rewrite rules

#### robots.txt
- ✅ Sitemap URL correcto
- ✅ Rutas bloqueadas (dashboard, login, etc.)

#### sitemap.xml
- ✅ URLs absolutas con dominio correcto
- ✅ Fechas actualizadas

### 5. Subir Archivos

#### Vía FTP/SFTP:

```bash
# Archivos a subir:
├── css/
├── images/
├── js/
├── templates/
├── .htaccess
├── index.html
├── properties.html
├── dashboard.html
├── login.html
├── create-admin.html
├── property-detail.html
├── robots.txt
├── sitemap.xml
├── manifest.json
└── (otros archivos HTML)
```

#### Archivos a NO subir:
- ❌ node_modules/
- ❌ .env
- ❌ .git/
- ❌ package.json (opcional)
- ❌ package-lock.json
- ❌ README.md (opcional)
- ❌ *.md (archivos de documentación)

#### Vía Git (si usas Git Deploy):

```bash
# Agregar remote de producción
git remote add production user@server:/path/to/repo

# Push a producción
git push production main
```

### 6. Configurar Supabase

#### Base de Datos

1. **Crear tabla `properties`**:

```sql
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('venta', 'alquiler')),
  property_type TEXT NOT NULL,
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  bedrooms INTEGER,
  bathrooms INTEGER,
  area NUMERIC,
  image_url TEXT,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_properties_operation ON properties(operation);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
```

2. **Configurar Row Level Security (RLS)**:

```sql
-- Habilitar RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer
CREATE POLICY "Propiedades públicas para lectura"
  ON properties FOR SELECT
  USING (true);

-- Política: Solo admins pueden insertar/actualizar/eliminar
CREATE POLICY "Solo admins pueden modificar"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated');
```

3. **Configurar Storage (para imágenes)**:

```sql
-- Crear bucket público para imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Política de acceso
CREATE POLICY "Imágenes públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Usuarios autenticados pueden subir"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');
```

#### Autenticación

1. Configurar email provider en Supabase Dashboard
2. Crear usuario administrador:
   - Ir a Authentication > Users
   - Add user manualmente
   - Email: admin@debrasi.com.ar
   - Password: (contraseña segura)

### 7. Verificar SSL/HTTPS

```bash
# Verificar certificado SSL
openssl s_client -connect debrasi.com.ar:443 -servername debrasi.com.ar

# Verificar redirección HTTP -> HTTPS
curl -I http://debrasi.com.ar
# Debería retornar 301 Moved Permanently
```

### 8. Testing Post-Despliegue

#### Checklist de Verificación:

- [ ] Página principal carga correctamente
- [ ] HTTPS funciona sin errores
- [ ] Imágenes se cargan correctamente
- [ ] Formulario de búsqueda funciona
- [ ] Listado de propiedades se muestra
- [ ] Login funciona
- [ ] Dashboard es accesible (solo para admins)
- [ ] Lazy loading de imágenes funciona
- [ ] Caché de navegador funciona
- [ ] Headers de seguridad están presentes
- [ ] Sitemap.xml es accesible
- [ ] Robots.txt es accesible
- [ ] Manifest.json es accesible
- [ ] PWA se puede instalar

#### Herramientas de Testing:

```bash
# Lighthouse (Performance, SEO, Accessibility)
npx lighthouse https://debrasi.com.ar --view

# Security Headers
curl -I https://debrasi.com.ar | grep -E "X-|Content-Security|Strict-Transport"

# SSL Labs
# Visitar: https://www.ssllabs.com/ssltest/analyze.html?d=debrasi.com.ar
```

### 9. Monitoreo

#### Google Search Console
1. Agregar propiedad
2. Verificar dominio
3. Enviar sitemap: https://debrasi.com.ar/sitemap.xml

#### Google Analytics (opcional)
```html
<!-- Agregar en <head> de todas las páginas -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Uptime Monitoring
- UptimeRobot (gratuito)
- Pingdom
- StatusCake

### 10. Backups

#### Base de Datos (Supabase)
- Supabase hace backups automáticos
- Configurar backups adicionales si es crítico

#### Archivos
```bash
# Backup manual
tar -czf backup-$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  .

# Subir a almacenamiento seguro
```

## 🔧 Configuración de Servidor

### Apache

El archivo `.htaccess` ya incluye toda la configuración necesaria.

Asegúrate de que estos módulos estén habilitados:

```bash
# Habilitar módulos necesarios
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod expires
sudo systemctl restart apache2
```

### Nginx

Si usas Nginx en lugar de Apache, aquí está la configuración equivalente:

```nginx
server {
    listen 80;
    server_name debrasi.com.ar www.debrasi.com.ar;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name debrasi.com.ar www.debrasi.com.ar;
    
    root /var/www/debrasi;
    index index.html;
    
    # SSL
    ssl_certificate /etc/letsencrypt/live/debrasi.com.ar/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/debrasi.com.ar/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Cache
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(css|js)$ {
        expires 1M;
        add_header Cache-Control "public";
    }
    
    # Remove .html extension
    location / {
        try_files $uri $uri.html $uri/ =404;
    }
    
    # Block sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log|sql|md)$ {
        deny all;
    }
}
```

## 🚨 Troubleshooting

### Problema: Imágenes no cargan

**Solución**:
- Verificar permisos de archivos: `chmod 644 images/*`
- Verificar que las rutas sean correctas
- Verificar CORS si usas CDN

### Problema: CSS no se aplica

**Solución**:
- Limpiar caché del navegador
- Verificar que `css/output.css` existe
- Verificar que Tailwind CDN carga (solo en desarrollo)

### Problema: Errores de Supabase

**Solución**:
- Verificar credenciales en `js/supabaseConfig.js`
- Verificar CORS en Supabase Dashboard
- Verificar que las tablas existen

### Problema: Headers de seguridad no aparecen

**Solución**:
- Verificar que `mod_headers` está habilitado (Apache)
- Verificar que `.htaccess` se está leyendo
- Verificar permisos de `.htaccess`: `chmod 644 .htaccess`

## 📊 Métricas de Éxito

Después del despliegue, monitorea:

- **Lighthouse Score**: Objetivo >90
- **Page Load Time**: <2 segundos
- **First Contentful Paint**: <1.5 segundos
- **Time to Interactive**: <2.5 segundos
- **Cumulative Layout Shift**: <0.1

## 🔄 Actualizaciones Futuras

```bash
# 1. Hacer cambios localmente
# 2. Probar localmente
npm run dev

# 3. Compilar assets
npm run build:css

# 4. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 5. Desplegar
# (Repetir pasos 5-8 de esta guía)
```

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. Revisa los logs del servidor
2. Revisa la consola del navegador
3. Verifica la configuración de Supabase
4. Consulta la documentación

---

**Última actualización**: 2025-10-01  
**Versión**: 2.0.0
