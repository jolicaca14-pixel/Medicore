# Ciclo de Aprendizaje Continuo - Sistema Jules

## Objetivo
Permitir que Jules y sus agentes aprendan de la experiencia y se auto-optimicen continuamente.

## Frecuencia de Ejecución
- **Trigger 1**: Cada 10 tareas completadas
- **Trigger 2**: Cada 7 días (1 semana)
- **Trigger 3**: Cuando 3+ agentes reportan el mismo bloqueo

## Proceso de 5 Fases

### Fase 1: RECOLECCIÓN 📊
**Responsable**: Jules

**Acciones**:
1. Leer completamente `.jules/central_log.md`
2. Extraer todas las entradas de "Dificultades/Bloqueos"
3. Identificar patrones recurrentes
4. Recopilar sugerencias de mejora de agentes

**Salida**: Lista de problemas y sugerencias categorizadas

---

### Fase 2: ANÁLISIS 🔍
**Responsable**: Jules

**Preguntas Clave**:
- ¿Qué reglas causaron fricción innecesaria?
- ¿Qué decisiones mías fueron incorrectas?
- ¿Qué agente necesita optimización urgente?
- ¿Hay conflictos recurrentes entre agentes?
- ¿Las métricas muestran degradación de desempeño?

**Salida**: Diagnóstico con recomendaciones específicas

---

### Fase 3: OPTIMIZACIÓN ✏️
**Responsable**: Jules (con auto-actualización)

**Acciones**:
1. **Auto-optimización de Jules**:
   - Actualizar `jules_orchestration.md` con nuevas reglas
   - Agregar casos de resolución de conflictos aprendidos
   - Mejorar matriz de priorización si es necesario

2. **Optimización de Agentes**:
   - Actualizar archivos de instrucciones de agentes que lo necesiten
   - Agregar nuevas reglas basadas en experiencia
   - Eliminar reglas obsoletas o contraproducentes

3. **Actualización de Procesos**:
   - Mejorar workflows si se detectaron cuellos de botella
   - Actualizar `team_roster.md` si se necesitan nuevos roles

**Salida**: Archivos de instrucciones actualizados

---

### Fase 4: VALIDACIÓN ✅
**Responsable**: Smith, Doc House, Morpheus

**Validaciones Obligatorias**:
- **Smith**: Los cambios no rompen tests existentes
- **Doc House**: La lógica clínica sigue siendo correcta
- **Morpheus**: La seguridad no se compromete
- **Alfred**: La documentación está sincronizada

**Criterio de Aprobación**: 4/4 validaciones exitosas

**Si falla**: Revertir cambios y documentar en `learning_log.md` como "Intento fallido"

---

### Fase 5: COMMIT 💾
**Responsable**: Jules

**Acciones**:
1. Documentar aprendizaje en `.jules/learning_log.md`:
   ```markdown
   ## [FECHA] - Ciclo #X
   **Problema Detectado**: [Descripción]
   **Solución Implementada**: [Cambios realizados]
   **Archivos Modificados**: [Lista]
   **Resultado Esperado**: [Mejora esperada]
   ```

2. Actualizar métricas en `.jules/metrics.md`

3. Si cambio es significativo (seguridad/clínica):
   - Notificar al usuario con detalles
   - Esperar aprobación antes de continuar

4. Si cambio es menor (optimización):
   - Proceder autónomamente
   - Registrar en log

---

## Ejemplo de Ciclo Completo

### Escenario: Neo reporta 3 veces "Falta documentación de API"

**Fase 1 - Recolección**:
```
Patrón detectado: Neo solicita documentación 3/10 tareas
```

**Fase 2 - Análisis**:
```
Problema: Link no está siendo asignado automáticamente después de Neo
Causa: Falta regla en jules_orchestration.md
```

**Fase 3 - Optimización**:
```
Actualizar jules_orchestration.md:
"Después de que Neo cree un endpoint, asignar automáticamente a Link 
para documentar la API en Swagger/OpenAPI"
```

**Fase 4 - Validación**:
```
✅ Smith: No afecta tests
✅ Doc House: No afecta lógica clínica
✅ Morpheus: No afecta seguridad
✅ Alfred: Documentación actualizada
```

**Fase 5 - Commit**:
```
Cambio menor → Proceder autónomamente
Registrado en learning_log.md
Métricas actualizadas: "Asignaciones automáticas: +1"
```

---

## Métricas de Éxito del Ciclo

- **Problemas Resueltos**: X/Y
- **Optimizaciones Implementadas**: X
- **Optimizaciones Revertidas**: X
- **Notificaciones al Usuario**: X
- **Mejora en Velocidad**: X%
- **Reducción de Bloqueos**: X%

---

## Señales de que el Ciclo Funciona

✅ Menos reportes de "Dificultades/Bloqueos" con el tiempo
✅ Métricas de velocidad mejorando
✅ Menos conflictos entre agentes
✅ Más decisiones autónomas exitosas
✅ Feedback positivo de Doc House sobre usabilidad

---

> [!IMPORTANT]
> Este ciclo es AUTÓNOMO. Jules lo ejecuta sin intervención humana, excepto para cambios que afecten seguridad o lógica clínica.
