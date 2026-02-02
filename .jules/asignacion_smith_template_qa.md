# ASIGNACIÓN: SMITH - Implementación de Plantillas y Verificación de Configuración

**Agente**: SMITH 🕵️‍♂️
**Tarea**: Implementar el formulario de creación de Plantillas y verificar la integridad de la pestaña de Configuración.
**Prioridad**: P1 - ALTO

## CONTEXTO
TRINITY ha implementado los formularios para Campos y Secciones. Ahora es necesario completar el motor de plantillas permitiendo al administrador crear nuevas `RoleTemplate` que agrupen estas secciones.

## INSTRUCCIONES DETALLADAS
1. **Modal de Nueva Plantilla (`isTemplateModalOpen`)**:
   - Crear un formulario para la interfaz `RoleTemplate`.
   - Campos: ID, Nombre, Descripción, Activa (Checkbox).
   - Tipo de Registro: Selector con `RecordType`.
   - Roles Permitidos: Selector múltiple con `UserRole`.
   - Selección de Secciones: Mostrar lista de `globalSections` con checkboxes para ordenar e incluir en la plantilla.
   - Implementar `handleSaveTemplate` para actualizar el estado `templates`.

2. **Control de Calidad (QA)**:
   - Verificar que todos los botones "Editar" en las listas de Campos, Secciones y Plantillas funcionen (o al menos no den error y carguen los datos en los formularios).
   - Ejecutar la suite de pruebas E2E para asegurar que los cambios en `AdminView.tsx` no rompieron la navegación o el Dashboard.

## ENTREGABLES
- `components/views/AdminView.tsx` con el formulario de plantillas funcional.
- Reporte de QA en `central_log.md`.
