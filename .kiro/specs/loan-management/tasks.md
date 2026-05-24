# Implementation Plan

## Overview

Plan de implementación para PrestApp - sistema de gestión de préstamos. El proyecto se divide en 20 tareas que cubren setup, backend (Clean Architecture con Java 21 + Spring Boot), frontend (React + Vite + Tailwind) y jobs programados. Las tareas siguen un orden de dependencias donde la infraestructura base se construye primero, luego el dominio, y finalmente las capas externas.

## Tasks

- [x] 1. Setup del proyecto backend: Crear estructura Maven en `backend/`, configurar `pom.xml` con Java 21, Spring Boot 3.x y dependencias (JPA, Security, Validation, Mail, Flyway, PostgreSQL, Lombok, jjwt). Crear `application.yml`, clase principal y estructura de paquetes según Clean Architecture. Agregar `.gitignore`.
- [x] 2. Setup del proyecto frontend: Crear proyecto React con Vite en `frontend/`, instalar y configurar Tailwind CSS, axios y react-router-dom. Crear estructura de carpetas (api, components, context, hooks, pages, routes, utils). Configurar proxy en `vite.config.js`. Agregar `.gitignore`.
- [x] 3. Migraciones de base de datos con Flyway: Crear migraciones para tablas `usuarios`, `clientes`, `prestamos`, `cuotas`. Insertar usuario admin por defecto. Configurar Flyway en Spring Boot.
- [ ] 4. Capa de dominio - Entidades y enums: Crear enums (`FrecuenciaPago`, `EstadoPrestamo`, `EstadoCuota`, `Rol`), entidades JPA con Lombok (`Usuario`, `Cliente`, `Prestamo`, `Cuota`) e interfaces de repositorio en `domain/repository/`.
- [x] 5. Capa de dominio - Servicios de negocio: Implementar `CuotaCalculatorService` (cálculo de montos y fechas según frecuencia, redondeo, residuo en última cuota) y `MoraDetectorService` (detección de cuotas vencidas). Documentar con Javadoc.
- [x] 6. Capa de infraestructura - Repositorios JPA: Implementar `JpaClienteRepository`, `JpaPrestamoRepository`, `JpaCuotaRepository`, `JpaUsuarioRepository` con queries personalizadas necesarias.
- [x] 7. Autenticación y seguridad: Implementar `JwtTokenProvider`, `JwtAuthenticationFilter`, `SecurityConfig`, `CorsConfig`. Implementar `AuthUseCase` con login, bloqueo por intentos. Crear `AuthController` y DTOs de login.
- [x] 8. Manejo global de excepciones: Crear excepciones custom (`ResourceNotFoundException`, `DuplicateResourceException`, `ValidationException`). Implementar `GlobalExceptionHandler` con @ControllerAdvice. Crear `ApiResponse<T>`.
- [x] 9. CRUD de Clientes: Crear DTOs (`ClienteRequest`, `ClienteResponse`), `ClienteMapper`, `ClienteUseCase` (registrar, listar, obtener, validar duplicados) y `ClienteController`. Validaciones con Bean Validation.
- [x] 10. Creación de Préstamos y cálculo de cuotas: Crear DTOs (`PrestamoRequest`, `PrestamoResponse`, `CuotaResponse`), mappers, `PrestamoUseCase` (crear, listar, detalle) y `PrestamoController`. Integrar `CuotaCalculatorService`. Validaciones de rangos.
- [x] 11. Registro de pagos: Crear `PagoRequest` DTO, `CuotaUseCase` (registrar pago, validar estado, actualizar saldo, completar préstamo) y `CuotaController` con PATCH /api/v1/cuotas/{id}/pagar.
- [x] 12. Reporte de cobranza: Crear `ReporteCobranzaResponse` DTO, `ReporteUseCase` (categorizar cuotas por estado, calcular totales) y `ReporteController` con GET /api/v1/reportes/cobranza.
- [x] 13. Portal del cliente - Endpoints: Implementar endpoints para el cliente logueado: GET /api/v1/mi-prestamo, /mi-prestamo/{id}, /mis-cuotas, /mi-historial. Filtrar por clienteId del JWT.
- [x] 14. Jobs programados: Implementar `NotificationScheduler` para detección de mora (diario 00:01) y recordatorios de vencimiento (diario 08:00). Implementar `EmailService`. Registrar fallas en logs.
- [x] 15. Frontend - Configuración base y autenticación: Configurar `axiosConfig.js` con interceptores JWT, crear `AuthContext.jsx`, hook `useAuth.js`, `LoginPage.jsx`, `AppRouter.jsx` con rutas protegidas por rol.
- [x] 16. Frontend - Componentes comunes: Crear componentes reutilizables (`Button`, `Input`, `Table`, `Modal`, `Pagination`, `StatusBadge`) y utilidades (`formatters.js`, `validators.js`).
- [x] 17. Frontend - Panel Admin (Clientes): Crear `ClienteForm.jsx`, `ClienteList.jsx`, `ClientesPage.jsx`, `clienteApi.js` y hook `useClientes.js`.
- [x] 18. Frontend - Panel Admin (Préstamos y Pagos): Crear `PrestamoForm.jsx`, `PrestamoList.jsx`, `PrestamoDetail.jsx`, `CuotaList.jsx`, `PrestamosPage.jsx`, APIs y hook `usePrestamos.js`.
- [x] 19. Frontend - Panel Admin (Reportes y Dashboard): Crear `ReporteCobranza.jsx`, `ReportesPage.jsx` y `DashboardPage.jsx` con resumen general.
- [x] 20. Frontend - Portal Cliente: Crear `PrestamoActivo.jsx`, `CuotasPendientes.jsx`, `HistorialPrestamos.jsx`, `MiPrestamoPage.jsx` y `MiHistorialPage.jsx`.

## Task Dependency Graph

```json
{
  "waves": [
    ["1", "2"],
    ["3"],
    ["4"],
    ["5"],
    ["6"],
    ["7", "8"],
    ["9", "15"],
    ["10", "16"],
    ["11", "12", "17"],
    ["13", "18"],
    ["14", "19"],
    ["20"]
  ]
}
```

## Notes

- Las tareas de backend (1-14) y frontend (2, 15-20) pueden avanzar en paralelo una vez completados los setups respectivos.
- Cada tarea se implementa en un branch separado siguiendo el formato PA-XXX.
- Los jobs programados (tarea 14) dependen de que existan los endpoints de préstamos y cuotas.
- El frontend depende de que los endpoints del backend estén disponibles para pruebas de integración.
