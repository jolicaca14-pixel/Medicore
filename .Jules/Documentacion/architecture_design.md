# Diseño de Arquitectura Técnica - Sistema de Gestión Clínica (HealthTech PWA)

## 1. Visión General
Este documento define la arquitectura técnica para una Aplicación Web Progresiva (PWA) de gestión clínica, optimizada para Google Chrome y cumpliendo con la normativa colombiana (Resolución 1995 de 1999, Ley 2015 de 2020). El sistema prioriza la seguridad, la inmutabilidad de los datos clínicos y una experiencia de usuario minimalista y rápida.

## 2. Stack Tecnológico (PERN)
Se ha seleccionado el stack **PERN** por su robustez, soporte de tipado fuerte (vía TypeScript, recomendado) y capacidad de gestión relacional compleja requerida para historias clínicas.

*   **Database (PostgreSQL 14+)**: Motor de base de datos relacional. Ideal para garantizar integridad referencial y soporte `JSONB` para plantillas dinámicas de historias clínicas.
*   **Backend (Node.js + Express)**: API RESTful modular.
*   **Frontend (React 18+)**: Biblioteca de UI. Uso de Hooks y Context API para gestión de estado.
*   **PWA (Service Workers + Workbox)**: Capacidad offline-first, cacheo de recursos estáticos y manifest para instalación en escritorio/móvil.

## 3. Arquitectura del Sistema

### 3.1 Modelo de Arquitectura: Monolito Modular
Para facilitar el mantenimiento y la escalabilidad inicial sin la complejidad de microservicios, se adoptará un **Monolito Modular**.
Estructura de Directorios del Backend (Sugerida):
- `/src/modulos/auth` (Gestión de usuarios, RBAC)
- `/src/modulos/pacientes` (Demografía, búsqueda)
- `/src/modulos/historias-clinicas` (HCE, Notas aclaratorias, Firmas)
- `/src/modulos/agenda` (Agenda, Citas)
- `/src/modulos/recetas` (E-Prescribing, CIE-11)
- `/src/modulos/rips` (Generación de archivos planos, validación)
- `/src/modulos/reportes` (Estadísticas, BI básico)

### 3.2 Seguridad y Cumplimiento
*   **Autenticación**: JSON Web Tokens (JWT).
    *   `AccessToken`: Vida corta (15 min).
    *   `RefreshToken`: HttpOnly cookie, vida media (7 días).
*   **Control de Acceso (RBAC)**: Middleware estricto para validar roles (`admin`, `professional`, `secretary`) en cada endpoint.
    *   *Regla de Oro*: Un profesional solo accede a sus registros o pacientes asignados/remitidos.
*   **Encriptación**:
    *   En tránsito: TLS 1.2+.
    *   En reposo: Cifrado de base de datos (TDE) o columnas sensibles con `pgcrypto`.
    *   Contraseñas: `bcrypt` con salt rounds >= 12.
*   **Firma Digital**: Hash criptográfico (SHA-256) generado al cerrar la historia clínica, vinculando el contenido del registro con la identidad del profesional.

## 4. Estrategia PWA y Rendimiento (Chrome V8)
*   **Service Workers**: Cacheo agresivo de "App Shell" (HTML, CSS, JS core) para carga instantánea.
*   **Virtualización de Listas**: Uso de librerías como `react-window` para renderizar agendas y listas de pacientes grandes sin bloquear el DOM.
*   **Code Splitting**: Carga perezosa (`React.lazy`) de módulos no críticos (ej. módulo administrativo no se carga para médicos).
*   **Optimizaciones V8**: Evitar "hidden classes" dinámicas en objetos frecuentes, uso eficiente de Arrays tipados para datos masivos.

## 5. Integraciones Externas
*   **CIE-11**: Integración con la API oficial de la OMS o mirror local para autocompletado de diagnósticos.
*   **Generación de Documentos**: Uso de `docx` (lado servidor o cliente) para exportación fiel de historias clínicas.

## 6. Diagrama de Alto Nivel (Mermaid)

```mermaid
graph TD
    User[Usuario (Chrome)] -->|HTTPS| PWA[PWA Frontend (React)]
    PWA -->|Service Worker| Cache[Cache Storage]
    PWA -->|API REST| API[Backend (Express/Node.js)]
    API -->|Auth| AuthModule[Módulo de Autenticación]
    API -->|Queries| DB[(PostgreSQL)]
    API -->|External| CIE11[API CIE-11]
    
    subgraph "Seguridad"
        AuthModule --> JWT[Emisión JWT]
        AuthModule --> RBAC[Verificación de Roles]
    end
    
    subgraph "Base de Datos"
        DB --> Patients[Pacientes (pacientes)]
        DB --> HCE[Historias (historias_clinicas)]
        DB --> Logs[Audit Logs]
    end
```
