# Guías de Diseño UI/UX (Minimalismo & Rendimiento)

## 1. Filosofía de Diseño
Inspirado en la limpieza visual (tipo *GNU Health* pero modernizado) y la eficiencia de *Google Material Design 3*, pero simplificado para reducir carga cognitiva.
*   **Menos es Más**: Pantallas limpias, sin gradientes excesivos ni animaciones pesadas innecesarias.
*   **Foco en el Contenido**: Lo más importante es el texto clínico. Tipografía legible y alto contraste.

## 2. Paleta de Colores (Minimalismo Funcional)
Tonos suavizados para evitar fatiga visual, manteniendo la semántica estricta.
*   **Acción Primaria (Seguro)**: `#15803d` (Green 700 desaturado) - Elegante y claro para 'Aceptar/Guardar'.
*   **Acción Destructiva (Peligro)**: `#b91c1c` (Red 700 desaturado) - Alerta sin ser estridente.
*   **Acento/Navegación**: `#0369a1` (Sky 700) - Enlaces y branding sutil.
*   **Fondo Base**: `#f8fafc` (Slate 50) - Casi blanco, cálido.
*   **Superficies**: `#ffffff` (White) - Tarjetas y contenedores con sombras suaves.
*   **Texto Principal**: `#334155` (Slate 700) - Gris oscuro, nunca negro puro (`#000`).

## 3. Componentes Clave

### 3.1 Layout Principal
*   **Sidebar Colapsable**: Menú de navegación a la izquierda (Pacientes, Agenda, Historias). Se contrae a iconos en pantallas pequeñas (Tablet).
*   **Topbar**: Información de contexto (Usuario logueado, Sede).
*   **Área de Trabajo**: Contenedor central con "breadcrumbs" para navegación fácil.

### 3.2 Formularios de Historia Clínica
*   **Autoguardado**: Feedback visual sutil "Guardando borrador..." en la esquina.
*   **Inputs Claros**: Bordes suaves, foco visible.
*   **Modo Lectura vs Edición**:
    *   *Edición*: Campos abiertos, botones de guardar.
    *   *Lectura (Historial Pasado)*: Texto plano, estilizado como documento, sin cajas de input (sensación de documento finalizado).

### 3.3 Agenda
*   **Drag & Drop**: Permitir mover citas (solo secretarias) con feedback visual inmediato.
*   **Tooltips**: Al pasar el mouse sobre una cita, mostrar resumen rápido sin abrir modal.

## 4. Optimización para Chrome V8
*   **Renderizado**: Evitar re-renders innecesarios en React. Usar `React.memo` en componentes de celdas de agenda.
*   **Transiciones**: Animaciones CSS simples (`transform`, `opacity`) para transiciones de página, evitando `layout trashing`.
*   **Fuentes**: Usar fuentes del sistema (San Francisco, Segoe UI, Roboto) para carga instantánea y nulo CLS (Cumulative Layout Shift).

## 5. Accesibilidad
*   Soporte completo para navegación por teclado (Tab index lógico).
*   Contraste WCAG AA mínimo en todos los textos.
