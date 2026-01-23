# Feedback Entre Agentes (Peer Review)

**Propósito**: Canal de comunicación para que los agentes se den feedback constructivo entre sí, mejorando la colaboración y detectando problemas temprano.

---

## Cómo Usar Este Archivo

Cada agente puede agregar feedback para otro agente siguiendo este formato:

```markdown
## [FECHA] - [AGENTE EMISOR] → [AGENTE RECEPTOR]
**Contexto**: [Tarea o situación específica]
**Feedback**: [Observación constructiva]
**Sugerencia**: [Acción recomendada]
**Prioridad**: [Alta / Media / Baja]
```

---

## Feedback Activo

### [2026-01-22] - Sistema → Todos
**Contexto**: Inicialización del sistema de peer feedback
**Feedback**: Sistema de feedback cruzado ahora activo
**Sugerencia**: Usar este canal para mejorar colaboración y detectar problemas temprano
**Prioridad**: Media

---

## Ejemplos de Feedback Útil

### Neo → Trinity
```markdown
**Contexto**: Endpoint /api/pacientes creado
**Feedback**: El endpoint devuelve datos paginados en formato { data: [], total: X, page: Y }
**Sugerencia**: Tu componente ListaPacientes debería usar el hook usePaginatedData() 
que maneja este formato automáticamente
**Prioridad**: Media
```

### Trinity → Neo
```markdown
**Contexto**: Formulario de signos vitales
**Feedback**: El endpoint /api/historias tarda 3s con 1000+ registros
**Sugerencia**: Implementar paginación o lazy loading en el backend
**Prioridad**: Alta
```

### Morpheus → Todos
```markdown
**Contexto**: Auditoría de seguridad semanal
**Feedback**: Detecté que nadie está validando tokens JWT expirados en algunos endpoints
**Sugerencia**: Neo debe agregar middleware validateToken() a todos los endpoints protegidos
**Prioridad**: Alta (Seguridad)
```

### Doc House → Trinity
```markdown
**Contexto**: Prueba de flujo de consulta médica
**Feedback**: El formulario de signos vitales tiene 15 campos en una sola pantalla
**Sugerencia**: Agrupar en tabs (Vitales Básicos / Antropometría / Otros) para reducir carga cognitiva
**Prioridad**: Alta (Usabilidad Clínica)
```

### Smith → Neo
```markdown
**Contexto**: Tests de integración fallando
**Feedback**: El endpoint /api/recetas no valida que el diagnóstico CIE-11 exista antes de crear la receta
**Sugerencia**: Agregar validación en el servicio RecetasService antes de guardar
**Prioridad**: Alta (Bug)
```

### The Oracle → Neo
```markdown
**Contexto**: Generación de RIPS
**Feedback**: Los códigos CUPS en la tabla servicios_prestados no tienen el formato correcto (faltan ceros)
**Sugerencia**: Agregar validación de formato CUPS en el modelo antes de guardar
**Prioridad**: Alta (Cumplimiento)
```

### Link → Trinity
```markdown
**Contexto**: Manual de usuario para módulo de agenda
**Feedback**: El flujo de "Cancelar Cita" no está documentado porque no encontré el botón en la UI
**Sugerencia**: ¿Dónde está el botón de cancelar? Necesito documentarlo
**Prioridad**: Media
```

### Ledger → Neo
```markdown
**Contexto**: Cálculo de nómina
**Feedback**: El cálculo de recargos nocturnos no está considerando festivos
**Sugerencia**: Implementar tabla de festivos colombianos y validar en el cálculo de turnos
**Prioridad**: Alta (Cumplimiento Legal)
```

### Alfred → Jules
```markdown
**Contexto**: Gestión de tareas
**Feedback**: Hay 5 tareas marcadas "En Progreso" hace más de 3 días sin actualización
**Sugerencia**: Revisar bloqueos con los agentes asignados (Neo x2, Trinity x2, Smith x1)
**Prioridad**: Alta (Gestión)
```

---

## Feedback Resuelto (Archivo)

### [2026-01-22] - Ejemplo Resuelto
**De**: Trinity → Neo
**Feedback**: Endpoint lento
**Solución**: Neo implementó paginación
**Resultado**: Tiempo reducido de 3s a 200ms
**Estado**: ✅ Resuelto

---

## Estadísticas

- **Total de Feedback Emitido**: 0
- **Feedback Resuelto**: 0
- **Feedback Pendiente**: 0
- **Feedback de Alta Prioridad**: 0

---

> [!TIP]
> El feedback constructivo entre agentes es clave para mejorar la calidad del sistema. Sé específico, propón soluciones y prioriza correctamente.
