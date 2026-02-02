# ASIGNACIÓN: TRINITY - Implementación de Formularios de Configuración

**Agente**: TRINITY 🎨
**Tarea**: Implementar formularios funcionales para la creación de Campos y Secciones en la pestaña de Configuración.
**Prioridad**: P1 - ALTO

## CONTEXTO
Actualmente, los botones "Nuevo Campo" y "Nueva Sección" en `AdminView.tsx` abren modales con contenido de marcador de posición (placeholders). Es necesario que estos modales permitan al administrador crear nuevos elementos en la biblioteca global.

## INSTRUCCIONES DETALLADAS
1. **Modal de Nuevo Campo (`isFieldModalOpen`)**:
   - Crear un formulario para la interfaz `TemplateField`.
   - Campos requeridos: ID (slug), Etiqueta (Label), Tipo de Dato (SELECT con `FieldType`), Requerido (Checkbox).
   - Campos opcionales: Unidad (unit), Fórmula (formula - solo si tipo es CALCULATED), Opciones (options - solo si tipo es SELECT, separado por comas).
   - Implementar `handleSaveField` para actualizar el estado `globalFields`.

2. **Modal de Nueva Sección (`isSectionModalOpen`)**:
   - Crear un formulario para la interfaz `TemplateSection`.
   - Campos: ID, Título, Descripción.
   - Selección de Campos: Mostrar lista de `globalFields` con checkboxes para incluir en la sección.
   - Implementar `handleSaveSection` para actualizar el estado `globalSections`.

## ENTREGABLES
- `components/views/AdminView.tsx` actualizado con los formularios funcionales.
- Reporte de finalización en `central_log.md`.
