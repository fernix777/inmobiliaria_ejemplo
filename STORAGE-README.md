# Configuración de Supabase Storage para Imágenes de Propiedades

## Pasos para configurar el almacenamiento de imágenes:

### 1. Ejecutar el script SQL
1. Ve al **Supabase Dashboard** de tu proyecto
2. Abre el **SQL Editor**
3. Copia y pega el contenido del archivo `setup-storage.sql`
4. Ejecuta el script

### 2. Verificar políticas RLS
El script crea las siguientes políticas de seguridad:
- ✅ Usuarios autenticados pueden subir imágenes
- ✅ Cualquier usuario puede ver las imágenes públicas
- ✅ Usuarios pueden actualizar/eliminar sus propias imágenes

### 3. Configurar CORS (opcional)
Si encuentras problemas con CORS, ve a:
- **Storage** → **Settings** → **Allowed Origins**
- Agrega tu dominio (ej: `https://tudominio.com`)

## Funcionalidades implementadas:

### ✅ Carga de imágenes locales
- Interfaz drag & drop mejorada
- Validación de tipo (solo imágenes)
- Validación de tamaño (máximo 5MB)
- Preview antes de subir

### ✅ Soporte para URLs externas
- Campo opcional para URLs de imágenes
- Preview automático
- Prioridad: imagen local > URL externa

### ✅ Gestión automática
- Nombres únicos para evitar conflictos
- Organización por usuario (`properties/{userId}/`)
- URLs públicas automáticas

### ✅ Optimización de rendimiento
- Service Worker actualizado para cachear imágenes
- Estrategia "Stale While Revalidate" para imágenes
- Cache optimizado para imágenes de Supabase Storage

## Uso:
1. Selecciona una imagen local o ingresa una URL
2. El sistema priorizará la imagen local si ambas están presentes
3. Las imágenes se suben automáticamente al guardar la propiedad
4. Se generan URLs públicas para acceso directo

## Solución de problemas:
- **Error de permisos**: Verifica que el usuario esté autenticado
- **Imágenes no se muestran**: Revisa las políticas RLS en Supabase
- **Problemas de carga**: Verifica la conexión a internet y límites de tamaño
