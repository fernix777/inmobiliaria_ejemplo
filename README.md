# De Brasi Propiedades

Sitio web profesional de [De Brasi Propiedades](https://debrasi.com.ar), una inmobiliaria con más de 30 años de experiencia ubicada en Buenos Aires, Argentina, especializada en la venta y alquiler de propiedades en la zona norte de la ciudad.

## 🚀 Versión 2.0 - Mejoras Implementadas

Esta versión incluye mejoras sustanciales en:
- ⚡ **Rendimiento**: Caché client-side, lazy loading, optimización de imágenes
- 🔒 **Seguridad**: Validaciones, headers de seguridad, manejo de errores
- 🔍 **SEO**: Sitemap, robots.txt, metadatos optimizados, PWA
- ♿ **Accesibilidad**: ARIA labels, navegación semántica
- 🏗️ **Arquitectura**: Código modular, utilidades reutilizables

Ver [IMPROVEMENTS.md](IMPROVEMENTS.md) para detalles completos.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
debrasiwebpage/
├── css/
│   ├── styles.css       # Estilos principales del sitio
│   └── slider.css       # Estilos específicos para el slider
├── images/
│   ├── logo.svg         # Logo principal
│   ├── logo-white.svg   # Logo para el footer (versión blanca)
│   ├── slider/          # Imágenes para el slider principal
│   └── properties/      # Imágenes de las propiedades
├── js/
│   ├── main.js          # JavaScript principal
│   └── slider.js        # Funcionalidad del slider
└── index.html          # Página principal
```

## Características

- Diseño responsive que se adapta a diferentes tamaños de pantalla
- Slider de imágenes en la página principal
- Sección de búsqueda de propiedades
- Visualización de propiedades destacadas
- Navegación intuitiva
- Sección de llamado a la acción (CTA)
- Footer con información de contacto y enlaces rápidos

## Tecnologías Utilizadas

### Frontend
- HTML5 semántico
- CSS3 + Tailwind CSS 3.4
- JavaScript ES6+ (módulos)
- Supabase para backend

### Herramientas de Desarrollo
- ESLint para linting
- Prettier para formateo
- PostCSS + Autoprefixer
- HTTP Server para desarrollo local

### Características Técnicas
- Progressive Web App (PWA)
- Lazy loading de imágenes
- Sistema de caché client-side
- Validación de formularios
- Manejo centralizado de errores
- Monitoreo de rendimiento

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 16+ y npm
- Cuenta de Supabase (para backend)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/debrasiwebpage.git
cd debrasiwebpage
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

4. **Configurar Supabase**
```bash
cp js/supabaseConfig.example.js js/supabaseConfig.js
# Editar js/supabaseConfig.js con tu URL y API key
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El sitio estará disponible en `http://localhost:8080`

### Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build:css    # Compila y minifica Tailwind CSS
npm run watch:css    # Compila CSS en modo watch
npm run lint         # Ejecuta ESLint
npm run format       # Formatea código con Prettier
```

## Personalización

Puedes personalizar este clon modificando los siguientes archivos:

- `css/styles.css`: Para cambiar colores, fuentes y estilos generales
- `index.html`: Para modificar la estructura y contenido
- `images/`: Para reemplazar las imágenes con tus propias imágenes

## Notas

Este proyecto es solo con fines educativos y de demostración. Las imágenes utilizadas son representaciones SVG simples y deberían ser reemplazadas por imágenes reales en un entorno de producción.

## Licencia

Este proyecto es de código abierto y está disponible para su uso y modificación según sea necesario.