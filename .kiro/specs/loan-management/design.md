# Technical Design

## Overview

PrestApp es un sistema de gestión de préstamos con arquitectura cliente-servidor. El backend expone una API REST construida con Java 21 y Spring Boot 3.x siguiendo Clean Architecture. El frontend es una SPA en React + Vite que consume la API vía HTTP/JSON. La autenticación se maneja con JWT stateless y la persistencia con PostgreSQL 15.

## Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────────────────────────┐
│                 │  HTTP    │            Backend                  │
│    Frontend     │◄────────►│                                     │
│  React + Vite   │  JSON    │  ┌─────────────────────────────┐   │
│  Tailwind CSS   │         │  │         Web Layer            │   │
│                 │         │  │   Controllers + Filters       │   │
└─────────────────┘         │  └──────────────┬──────────────┘   │
                            │                 │                    │
                            │  ┌──────────────▼──────────────┐   │
                            │  │      Application Layer       │   │
                            │  │   Use Cases + DTOs + Mappers │   │
                            │  └──────────────┬──────────────┘   │
                            │                 │                    │
                            │  ┌──────────────▼──────────────┐   │
                            │  │        Domain Layer          │   │
                            │  │  Entities + Repo Interfaces  │   │
                            │  └──────────────┬──────────────┘   │
                            │                 │                    │
                            │  ┌──────────────▼──────────────┐   │
                            │  │    Infrastructure Layer      │   │
                            │  │  JPA Repos + Security + Mail │   │
                            │  └──────────────┬──────────────┘   │
                            │                 │                    │
                            └─────────────────┼────────────────────┘
                                              │
                                   ┌──────────▼──────────┐
                                   │   PostgreSQL 15     │
                                   └─────────────────────┘
```

## Components and Interfaces

### Backend Components

#### Web Layer
- `AuthController` — POST /api/v1/auth/login
- `ClienteController` — GET/POST /api/v1/clientes
- `PrestamoController` — GET/POST /api/v1/prestamos
- `CuotaController` — PATCH /api/v1/cuotas/{id}/pagar
- `ReporteController` — GET /api/v1/reportes/cobranza
- `GlobalExceptionHandler` — manejo centralizado de errores
- `JwtRequestFilter` — interceptor de autenticación JWT

#### Application Layer
- `AuthUseCase` — login, validación de credenciales, bloqueo por intentos
- `ClienteUseCase` — registrar, listar, obtener, validar duplicados
- `PrestamoUseCase` — crear préstamo, generar cuotas, listar, detalle
- `CuotaUseCase` — registrar pago, validar estado, actualizar saldo
- `ReporteUseCase` — categorizar cuotas, calcular totales por estado
- `ClienteMapper`, `PrestamoMapper`, `CuotaMapper` — conversión entidad ↔ DTO

#### Domain Layer
- `Cliente`, `Prestamo`, `Cuota`, `Usuario` — entidades del dominio
- `CuotaCalculatorService` — cálculo de montos y fechas de cuotas
- `MoraDetectorService` — detección de cuotas vencidas
- `ClienteRepository`, `PrestamoRepository`, `CuotaRepository`, `UsuarioRepository` — interfaces (puertos)

#### Infrastructure Layer
- `JpaClienteRepository`, `JpaPrestamoRepository`, `JpaCuotaRepository`, `JpaUsuarioRepository` — implementaciones JPA
- `JwtTokenProvider` — generación y validación de tokens JWT
- `SecurityConfig` — configuración de Spring Security
- `EmailService` — envío de notificaciones por email
- `NotificationScheduler` — jobs programados (mora + recordatorios)

### Frontend Components

#### Pages
- `LoginPage` — formulario de autenticación
- `DashboardPage` — resumen general (admin)
- `ClientesPage` — gestión de clientes (admin)
- `PrestamosPage` — gestión de préstamos (admin)
- `ReportesPage` — reporte de cobranza (admin)
- `MiPrestamoPage` — préstamo activo (cliente)
- `MiHistorialPage` — historial de préstamos (cliente)

#### Context & Hooks
- `AuthContext` — estado de autenticación global
- `useAuth` — hook de autenticación
- `useClientes` — hook de gestión de clientes
- `usePrestamos` — hook de gestión de préstamos

### Interfaces (API Contracts)

#### POST /api/v1/auth/login
Request: `{ username: string, password: string }`
Response: `{ data: { token: string, rol: string }, message: string }`

#### POST /api/v1/clientes
Request: `{ razonSocial: string, responsable: string, telefono: string, email: string }`
Response: `{ data: ClienteResponse, message: string }`

#### POST /api/v1/prestamos
Request: `{ clienteId: long, monto: decimal, tasaInteres: decimal, plazo: int, frecuencia: string, fechaInicio: date }`
Response: `{ data: PrestamoResponse, message: string }`

#### PATCH /api/v1/cuotas/{id}/pagar
Request: `{ monto: decimal }`
Response: `{ data: CuotaResponse, message: string }`

## Data Models

### Entity: Usuario
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| username | String(50) | UNIQUE, NOT NULL |
| password | String(255) | NOT NULL, BCrypt encoded |
| rol | Rol (enum) | NOT NULL (ADMIN, CLIENTE) |
| clienteId | Long | FK → Cliente, NULLABLE |
| intentosFallidos | Integer | DEFAULT 0 |
| bloqueadoHasta | LocalDateTime | NULLABLE |
| createdAt | LocalDateTime | NOT NULL |

### Entity: Cliente
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| razonSocial | String(150) | NOT NULL |
| responsable | String(100) | NOT NULL |
| telefono | String(20) | NOT NULL |
| email | String(100) | NOT NULL |
| createdAt | LocalDateTime | NOT NULL |
| updatedAt | LocalDateTime | NOT NULL |
| UNIQUE(razonSocial, responsable) | | |

### Entity: Prestamo
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| clienteId | Long | FK → Cliente, NOT NULL |
| monto | BigDecimal(12,2) | NOT NULL |
| tasaInteres | BigDecimal(5,2) | NOT NULL |
| plazo | Integer | NOT NULL |
| frecuencia | FrecuenciaPago (enum) | NOT NULL |
| fechaInicio | LocalDate | NOT NULL |
| saldoRestante | BigDecimal(12,2) | NOT NULL |
| estado | EstadoPrestamo (enum) | NOT NULL |
| createdAt | LocalDateTime | NOT NULL |
| updatedAt | LocalDateTime | NOT NULL |

### Entity: Cuota
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| prestamoId | Long | FK → Prestamo, NOT NULL |
| numeroCuota | Integer | NOT NULL |
| monto | BigDecimal(12,2) | NOT NULL |
| fechaVencimiento | LocalDate | NOT NULL |
| fechaPago | LocalDate | NULLABLE |
| estado | EstadoCuota (enum) | NOT NULL |
| createdAt | LocalDateTime | NOT NULL |

### Enums
- `Rol`: ADMIN, CLIENTE
- `FrecuenciaPago`: SEMANAL, QUINCENAL
- `EstadoPrestamo`: ACTIVO, COMPLETADO, EN_MORA
- `EstadoCuota`: PENDIENTE, PAGADA, EN_MORA

## Correctness Properties

### Property 1: Integridad de montos de cuotas
La suma de todos los montos de cuotas de un préstamo es exactamente igual al monto total (capital + interés). Esto se garantiza asignando el residuo de redondeo a la última cuota.
**Validates: Requirement 3.5**

### Property 2: Transición de estado de préstamo
Un préstamo pasa a estado COMPLETADO únicamente cuando todas sus cuotas están en estado PAGADA. No existe otra forma de completar un préstamo.
**Validates: Requirement 12.4**

### Property 3: Aislamiento de datos por cliente
Un cliente autenticado solo puede acceder a datos de sus propios préstamos. El filtrado se realiza por clienteId extraído del JWT en cada request al portal cliente.
**Validates: Requirement 6.3**

### Property 4: Idempotencia de pagos
No se puede registrar un pago para una cuota que ya está en estado PAGADA. El sistema rechaza la operación con error 409.
**Validates: Requirement 12.3**

### Property 5: Bloqueo por intentos fallidos
La cuenta se bloquea por 15 minutos después de exactamente 5 intentos fallidos consecutivos. El contador se reinicia tras un login exitoso.
**Validates: Requirement 11.3**

### Property 6: Espaciado de fechas de cuotas
Las fechas de vencimiento de cuotas están espaciadas exactamente 7 días (semanal) o 14 días (quincenal) a partir de la fecha de inicio del préstamo.
**Validates: Requirement 3.1**

## Error Handling

### Strategy
- Manejo centralizado con `@ControllerAdvice` en `GlobalExceptionHandler`.
- Todas las respuestas de error siguen el formato `ApiResponse<T>` con campos: data (null), message, errors.

### Custom Exceptions
- `ResourceNotFoundException` → HTTP 404
- `DuplicateResourceException` → HTTP 409
- `ValidationException` → HTTP 400
- `AuthenticationException` → HTTP 401
- `AccessDeniedException` → HTTP 403

### Error Response Format
```json
{
  "data": null,
  "message": "Descripción del error",
  "errors": ["detalle1", "detalle2"]
}
```

## Testing Strategy

### Backend
- Unit tests para servicios de dominio (CuotaCalculatorService, MoraDetectorService)
- Unit tests para use cases con mocks de repositorios
- Integration tests para controllers con MockMvc
- Integration tests para repositorios con @DataJpaTest y testcontainers (PostgreSQL)

### Frontend
- Unit tests para hooks y utilidades
- Component tests para formularios y listas
- Integration tests para flujos completos (login → crear cliente → crear préstamo)

## Security Design

### JWT Flow
1. Cliente/Admin envía POST /api/v1/auth/login con username + password
2. Backend valida credenciales, verifica bloqueo por intentos fallidos
3. Si válido: genera JWT con { sub: username, rol: ADMIN|CLIENTE, clienteId, exp }
4. Frontend almacena JWT en memoria
5. Cada request incluye header: Authorization: Bearer {token}
6. JwtRequestFilter intercepta, valida token y establece SecurityContext

### Token Configuration
- Admin: expiración 60 minutos
- Cliente: expiración 30 minutos
- Bloqueo: 5 intentos fallidos → 15 minutos de bloqueo

## Installment Calculation Logic

```
montoTotal = monto × (1 + tasaInteres / 100)
numeroCuotas = plazo (en semanas) / frecuenciaEnSemanas (1 para semanal, 2 para quincenal)
montoCuota = floor(montoTotal / numeroCuotas × 100) / 100
ultimaCuota = montoTotal - (montoCuota × (numeroCuotas - 1))

fechas: fechaInicio + (i × 7días) para semanal
        fechaInicio + (i × 14días) para quincenal
        donde i = 1, 2, ..., numeroCuotas
```

## Scheduled Jobs

### Detección de Mora
- Frecuencia: diaria a las 00:01
- Lógica: cuotas con fecha_vencimiento < hoy AND estado = PENDIENTE → EN_MORA

### Recordatorios de Vencimiento
- Frecuencia: diaria a las 08:00
- Lógica: cuotas con fecha_vencimiento = mañana AND estado = PENDIENTE → enviar email
