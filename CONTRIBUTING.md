# Guía de Contribución

¡Gracias por tu interés en contribuir a De Brasi Propiedades! Esta guía te ayudará a comenzar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## Código de Conducta

Este proyecto adhiere a un código de conducta. Al participar, se espera que mantengas este código.

## Cómo Contribuir

### 1. Fork del Repositorio

```bash
# Fork en GitHub, luego clona tu fork
git clone https://github.com/tu-usuario/debrasiwebpage.git
cd debrasiwebpage
```

### 2. Crear una Rama

```bash
# Crea una rama descriptiva
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 3. Hacer Cambios

- Escribe código limpio y bien documentado
- Sigue los estándares de código del proyecto
- Agrega tests si es aplicable
- Actualiza la documentación si es necesario

### 4. Commit

```bash
# Usa commits descriptivos
git add .
git commit -m "feat: agregar validación de email en formulario de contacto"
```

#### Formato de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan el código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

### 5. Push y Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

Luego crea un Pull Request en GitHub.

## Estándares de Código

### JavaScript

- Usa ES6+ features
- Sigue la guía de estilo de ESLint (`.eslintrc.json`)
- Usa nombres descriptivos para variables y funciones
- Comenta código complejo
- Evita funciones muy largas (máx 50 líneas)

```javascript
// ✅ Bueno
async function fetchUserProperties(userId) {
  try {
    const properties = await propertyService.getByUser(userId);
    return properties;
  } catch (error) {
    ErrorHandler.handle(error);
    return [];
  }
}

// ❌ Malo
async function f(u) {
  return await ps.g(u);
}
```

### HTML

- Usa HTML5 semántico
- Incluye atributos ARIA cuando sea necesario
- Usa nombres de clase descriptivos
- Mantén la indentación consistente (2 espacios)

```html
<!-- ✅ Bueno -->
<section aria-label="Propiedades destacadas">
  <h2 class="section-title">Propiedades Destacadas</h2>
  <div class="property-grid" role="list">
    <!-- contenido -->
  </div>
</section>

<!-- ❌ Malo -->
<div>
  <div class="t">Propiedades</div>
  <div class="g">
    <!-- contenido -->
  </div>
</div>
```

### CSS

- Usa Tailwind CSS cuando sea posible
- Para CSS personalizado, usa nombres de clase BEM
- Evita !important
- Usa variables CSS para valores reutilizables

```css
/* ✅ Bueno */
.property-card {
  background: var(--color-white);
  border-radius: var(--radius-md);
}

.property-card__title {
  font-size: var(--text-lg);
}

/* ❌ Malo */
.pc {
  background: #fff !important;
}
```

## Proceso de Pull Request

1. **Asegúrate de que tu código pase los tests**
   ```bash
   npm run lint
   npm run format
   ```

2. **Actualiza la documentación** si es necesario

3. **Describe tus cambios** en el PR:
   - ¿Qué problema resuelve?
   - ¿Cómo lo probaste?
   - Screenshots si aplica

4. **Espera la revisión** - Un mantenedor revisará tu PR

5. **Realiza cambios** si se solicitan

6. **Merge** - Una vez aprobado, tu PR será mergeado

## Reportar Bugs

### Antes de Reportar

- Verifica que el bug no haya sido reportado
- Verifica que no esté en la última versión
- Recopila información sobre el bug

### Cómo Reportar

Crea un issue con:

**Título**: Descripción breve del bug

**Descripción**:
- Pasos para reproducir
- Comportamiento esperado
- Comportamiento actual
- Screenshots si aplica
- Información del navegador/OS

**Ejemplo**:

```markdown
## Descripción
El formulario de búsqueda no filtra por ubicación correctamente.

## Pasos para Reproducir
1. Ir a la página de propiedades
2. Seleccionar "Martínez" en el filtro de ubicación
3. Hacer clic en "Buscar"

## Comportamiento Esperado
Debería mostrar solo propiedades en Martínez

## Comportamiento Actual
Muestra todas las propiedades

## Entorno
- Navegador: Chrome 120
- OS: Windows 11
- Versión: 2.0.0
```

## Sugerir Mejoras

Las sugerencias son bienvenidas! Crea un issue con:

- **Título**: Descripción de la mejora
- **Motivación**: ¿Por qué es útil?
- **Propuesta**: ¿Cómo funcionaría?
- **Alternativas**: Otras opciones consideradas

## Áreas de Contribución

### Necesitamos Ayuda Con:

- 🐛 Corrección de bugs
- 📝 Mejoras en documentación
- ♿ Mejoras de accesibilidad
- 🌐 Traducciones
- 🎨 Mejoras de UI/UX
- ⚡ Optimizaciones de rendimiento
- 🧪 Tests

## Preguntas

Si tienes preguntas, puedes:

- Abrir un issue con la etiqueta `question`
- Contactar a los mantenedores

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto (MIT).

---

¡Gracias por contribuir! 🎉
