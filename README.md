# Where in the world?

App para explorar países del mundo. Busca, filtra por región y ve detalles de cada país.

## Enfoque

Se hizo con vanilla JS sin frameworks. HTML, CSS y JavaScript puro. La idea fue mantenerlo simple pero funcional:

- Fetch de datos de la REST Countries API
- CSS variables para el tema oscuro/claro
- Media queries para responsive (mobile, tablet, laptop, desktop)
- Búsqueda y filtro en tiempo real
- Los datos se guardan en localStorage para el tema seleccionado

## Qué hace

- Ver todos los países en un grid (4 columnas en desktop, menos en mobile)
- Buscar por nombre
- Filtrar por región (con botón X para limpiar)
- Hacer click en un país para ver detalles completos
- Hacer click en los países fronterizos para navegar entre ellos
- Cambiar entre tema oscuro y claro

## Cómo está hecho

- `index.html` - Estructura (dos vistas: listado y detalle)
- `styles.css` - Estilos responsive + variables para temas
- `script.js` - Lógica (fetch, filtrado, eventos, navegación)


## Características

- Responsive en 4 breakpoints (767px, 768-1024px, 1025-1366px, 1367px+)
- Búsqueda mientras escribes
- Filtro por región con opción de limpiar
- Dark/Light mode con persistencia
- Países en orden alfabético
- Info detallada: nombre nativo, población, región, capital, dominio, divisas, idiomas
- Enlaces a países fronterizos

---

Hecho con HTML, CSS y JavaScript. Usa la API REST Countries y Font Awesome para los iconos.
