# Registro de Cambios (Changelog)

## [Reciente] Implementación de Generación de Recetas en PDF
**Fecha:** 2026-01-08

### Backend
- **Nuevo Endpoint:** `GET /api/v1/recetas/:id/pdf`
    - Genera un archivo PDF profesional con la receta médica utilizando Puppeteer.
    - Incluye:
        - Datos del paciente y profesional (con registro médico).
        - Fecha de consulta.
        - Tabla detallada de medicamentos (Dosis, Frecuencia, Duración, Indicaciones).
        - Espacio para firma (o firma digital placeholder).
- **Controlador de Historias Clínicas:**
    - Se actualizó el método de creación (`createHistoria`) y actualización (`updateHistoria`) para sincronizar automáticamente los medicamentos prescritos con la tabla `recetas`.
    - Esto asegura que al finalizar una historia clínica, la receta esté disponible para descarga inmediata.

### Próximos Pasos (Pendientes)
- Implementar botón "Imprimir Receta" en el Frontend (`HistoriaPaciente.tsx` o `App.tsx` detalle).
- Verificar migración de base de datos para columna `nombre_completo`.
