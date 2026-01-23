# Requisitos Funcionales y Reglas de Negocio

## 1. Gestión de Usuarios y Seguridad (RBAC)

### 1.1 Perfiles de Usuario
El sistema debe soportar los siguientes roles con permisos estrictos:

*   **ADMINISTRADOR**
    *   Gestión de usuarios del sistema (Crear/Inactivar).
    *   **Gestión de Roles**: Capacidad de crear nuevos tipos de profesionales según necesidad.
    *   **Editor de Plantillas**: Herramienta para crear y modificar estructuras de historias clínicas.
    *   Configuración global (Institución, logos, CIE-11 cache).
    *   **Reportes**: Generación de informes automáticos y creación de reportes personalizados.
    *   Acceso a logs de auditoría técnica.
    *   *Restricción*: NO tiene acceso de lectura al contenido clínico de las historias (Privacidad del paciente).
*   **PROFESIONAL (Médico, Enfermería, Psicología, Nutrición, etc.)**
    *   *Sistema Extensible*: Se contempla la creación de nuevos roles de profesionales.
    *   CRUD completo de Historias Clínicas propias.
    *   Creación de Recetas Médicas, Órdenes de Laboratorio y Exámenes.
    *   Visualización de pacientes asignados o con interconsulta.
    *   *Restricción*: Solo puede ver historias de otros colegas si existe una "Remisión" activa en el sistema.
*   **APOYO DIAGNÓSTICO (Bacteriólogo / Radiólogo)**
    *   **Bacteriólogo/Microbiólogo**: Acceso al Módulo de Laboratorio. Ingreso de resultados estructurados y adjuntos PDF.
    *   **Radiólogo**: Acceso al Módulo de Imagenología. Redacción de informes y carga de imágenes (JPG, PNG) o PDFs.
    *   *Visibilidad*: Sus reportes son visibles automáticamente para el profesional tratante en la Historia Clínica.
*   **SECRETARIA (Personal Administrativo)**
    *   Gestión de Pacientes (Crear, Editar datos contacto).
    *   Gestión de Agenda (Asignar, Cancelar, Reagendar citas).
    *   **Gestión Administrativa**: Apoyo en gestión de medicación y órdenes de exámenes/laboratorios (sin criterio clínico, solo administrativo).
    *   **Validación CUPS**: Verificación de códigos CUPS para las atenciones.
    *   *Restricción*: NO puede ver ni editar Diagnósticos, Evoluciones ni Recetas. Acceso denegado a contenido clínico sensible.

### 1.2 Autenticación y Firma
*   **Login Seguro**: Usuario y contraseña encriptada.
*   **Firma y Sello**:
    *   El profesional configurará su **Sello Digital** (Imagen cargada) que se estampará automáticamente en los documentos finales.
    *   Se mantendrá el registro textual del número profesional.
    *   **Seguridad de Cierre**: Para finalizar y cerrar una historia clínica (acción que la hace inmutable), el sistema **exigirá** que el profesional re-ingrese su usuario y contraseña para confirmar su identidad y autoría.
    *   **Validación Estricta**: En caso de no realizar la autenticación correctamente o cancelar el proceso, **el cierre NO se ejecutará** y la historia permanecerá en estado BORRADOR. No se guardará el estado "Finalizado" bajo ninguna circunstancia sin esta confirmación.

## 2. Módulo de Historia Clínica Electrónica (HCE)

### 2.1 Cumplimiento Normativo
*   **Resolución 1995 de 1999**: Integridad, confidencialidad, disponibilidad.
*   **Ley 2015 de 2020**: Interoperabilidad (diseño de datos estándar).

### 2.2 Plantillas Dinámicas y Personalizadas
El sistema debe permitir seleccionar el tipo de atención al iniciar una historia, soportando múltiples especialidades y programas de PyP.
*   **Plantillas Personalizables**: El sistema permitirá la creación de **Nuevos Modelos de Historia** según necesidad, definiendo campos y secciones específicas.
*   **Catálogo Base**:
    *   **Historia General / Medicina General**.
    *   **Historias Especializadas**: Psicología, Nutrición.
    *   **Procedimientos**: Notas de procedimientos cortos.
    *   **Promoción y Prevención (PyP)**: Estricto cumplimiento de las **Guías de Atención de la Resolución 412 de 2000**.
        *   Detección temprana de alteraciones del Crecimiento y Desarrollo (Menores de 10 años).
        *   Detección temprana de alteraciones del Desarrollo del Joven (10-29 años).
        *   Detección temprana de alteraciones del Embarazo (Control Prenatal).
        *   Detección temprana de alteraciones del Adulto (Mayor de 45 años).
        *   Planificación Familiar (Hombres y Mujeres).
        *   Salud Visual y Agudeza Visual.
        *   Cáncer de Cuello Uterino y Seno.
        *   **Atención del Puerperio** (Post-parto).
        *   **Atención del Recién Nacido**.
        *   **Riesgo Cardiovascular (RCV)**:
            *   **Calculadoras Automáticas**: El sistema calculará automáticamente la **Tasa de Filtración Glomerular (TFG)** y el Riesgo de **Framingham** basado en los datos ingresados.
            *   **Escala de Barthel**: Será **obligatoria** la primera vez que se diligencia la historia de un paciente en el programa; en consultas subsecuentes será opcional.

### 2.3 Continuidad y Visión Histórica
*   **Persistencia de Antecedentes**: Los datos de antecedentes (Patológicos, Alérgicos, etc.) ingresados previamente deben **aparecer precargados** en nuevas consultas para facilitar el diligenciamiento, permitiendo solo validación o actualización.
*   **Historial Unificado**: Dentro de la consulta actual, el profesional tendrá acceso a una vista de "Línea de Tiempo" para revisar historias, exámenes físicos y notas de **otros profesionales** (interdisciplinario) para tener contexto completo del paciente.

### 2.3 Inmutabilidad y Notas Aclaratorias
*   **Cierre de Historia**: Botón "Finalizar Atención". Acción irreversible. Bloquea edición de la fila en BD.
*   **Correcciones y Nuevas Órdenes**: Si se detecta un error post-cierre (ej. dosis equivocada), el profesional debe crear una "Nota Aclaratoria".
    *   Esta nota se anexa visualmente al registro original.
    *   **Generación de Órdenes**: Desde una nota aclaratoria, el sistema permitirá **generar nuevas órdenes** (Recetas, Labs, Remisiones) para subsanar el error.
    *   **Seguridad**: Al igual que el cierre de historia, la creación de una Nota Aclaratoria **exige re-ingreso de contraseña** para firmar la corrección.

## 3. Módulo de Prescripción (e-Prescribing)
*   **Integración CIE-11**: Campo de búsqueda de diagnóstico obligatorio antes de recetar. Autocompletado consumiendo API/base local.
*   **Formulación**:
    *   Selección de medicamento (base de datos CUM sugerida).
    *   Campos estructurados: Dosis, Frecuencia, Vía de administración, Duración, Cantidad total.
    *   Recomendaciones/Observaciones.
*   **Salida**: Generación de PDF o impresión directa con formato legal (encabezado, firma digitalizada, pie de página).

## 4. Gestión Administrativa (Agenda y Tablero Profesional)
*   **Reglas de Agendamiento**:
    *   **Bloqueo de Solapamiento**: El sistema impedirá asignar citas en horarios ya ocupados.
    *   **Duraciones Estándar** (Configurables):
        *   Consulta General: 20 minutos.
        *   Procedimientos: 30 minutos.
        *   Control Prenatal: 40 minutos.
    *   **Turnos y Horarios**: Configuración flexible del horario de atención por profesional (Diario, Semanal, Mensual). El sistema bloqueará citas fuera del horario laboral definido.
*   **Calendario Interactivo**: Vista diaria, semanal y mensual para secretarias.
*   **Tablero del Profesional (Sala de Espera Virtual)**:
    *   Interfaz específica donde el profesional ve SU lista de pacientes del día.
    *   **Visualización por Colores**: Identificación rápida del estado (Azul=Programada, Verde=En Sala, Naranja=En Atención, Gris=Finalizada).
    *   **Acceso Directo**: Clic en una cita en estado "Verde" (Confirmada) abre inmediatamente la Historia Clínica correspondiente para iniciar atención.
*   **Estados de Cita**:
    *   *Programada*: Color azul.
    *   *Confirmada*: Color verde (paciente llega a sala).
    *   *En Atención*: Color naranja (médico abre historia).
    *   *Finalizada*: Color gris (historia cerrada).
    *   *Cancelada*: Color rojo (requiere motivo).

## 5. Exportación, RIPS y Comunicación Automática
*   **Exportación a PDF**: Se reemplaza la exportación editable por formato **PDF Seguro** (No modificable) para todos los documentos legales (Historias, Recetas, Órdenes).
*   **Envío Automático al Paciente**: Al finalizar la atención, el sistema enviará **automáticamente un correo electrónico** al paciente (al email registrado) adjuntando:
    *   Resumen de Historia Clínica / Evolución.
    *   Fórmulas Médicas.
    *   Órdenes de Laboratorio/Exámenes.
    *   Incapacidades o Remisiones.
*   **Notificación de Correcciones**: Si se genera una **Nota Aclaratoria**, el sistema reenviará automáticamente la historia clínica completa al paciente, incluyendo la corrección debidamente **firmada y sellada** por el profesional.
*   **Integración y Envío de Resultados**:
    *   **Notificación al Profesional**: Alerta en la línea de tiempo cuando un resultado está listo.
    *   **Envío al Paciente**: El sistema enviará **automáticamente un correo electrónico** al paciente con el resultado (PDF) adjunto, tan pronto como sea validado por el especialista (Bacteriólogo/Radiólogo).
*   **RIPS Automáticos**: Generación automática de archivos planos para el ministerio.
*   **Reportes Inteligentes**: Informes automáticos de productividad y morbilidad.

## 6. Módulo Financiero y Facturación
*   **Gestión de Tarifarios**: Soporte inicial para **Manual Tarifario SOAT** (Salario Mínimo Diario Legal Vigente). Capacidad de cargar códigos, descripciones y factores de cobro.
*   **Facturación de Servicios**:
    *   Generación automática de pre-factura basada en los procedimientos (CUPS) registrados en la historia clínica.
    *   Posibilidad de agregar insumos o servicios adicionales manualmente.
*   **Contabilidad Básica**:
    *   Registro de ingresos por atenciones.
    *   Control de Cuentas por Cobrar (Seguimiento a pagos de aseguradoras o particulares).
    *   Reportes de facturación por profesional, sede o periodo.

## 7. Gestión de Talento Humano y Nómina
El sistema permitirá gestionar múltiples tipos de vinculación laboral, cumpliendo normativa colombiana.
*   **Gestión de Contratos Multimodales**: Un profesional puede tener vigentes contratos de **Nómina** y **OPS** simultáneamente.
*   **Tipos de Contratación**:
    1.  **Nómina (Laboral)**:
        *   Definición de Salario Básico.
        *   Cálculo automático de valor hora.
        *   **Horas Extras y Recargos**: Cálculo automático según legislación colombiana (Diurna, Nocturna, Festiva) basado en los turnos y atenciones realizadas.
    2.  **OPS (Prestación de Servicios)**:
        *   Pago por evento (Atención o Procedimiento realizado).
        *   Control de cuentas de cobro: "Realizado vs Pagado" para seguimiento de deuda.
*   **Privacidad**: El módulo de Honorarios es estrictamente confidencial; cada profesional solo puede visualizar sus propios ingresos y liquidaciones.
*   **Reportes**: Generación de informes de horas trabajadas y productividad mensual por contrato.
