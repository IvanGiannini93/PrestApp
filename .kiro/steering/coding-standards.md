# Estándares de Código

## Clean Architecture

El backend sigue los principios de Clean Architecture con las siguientes capas:

```
backend/src/main/java/com/prestapp/
├── domain/              # Entidades y reglas de negocio puras
│   ├── model/           # Entidades del dominio
│   ├── repository/      # Interfaces de repositorio (puertos)
│   └── service/         # Lógica de negocio (casos de uso)
├── application/         # Orquestación y DTOs
│   ├── dto/             # Objetos de transferencia (request/response)
│   ├── mapper/          # Conversión entre entidades y DTOs
│   └── usecase/         # Casos de uso de aplicación
├── infrastructure/      # Implementaciones concretas
│   ├── persistence/     # Implementaciones JPA de repositorios
│   ├── security/        # Configuración de Spring Security y JWT
│   ├── config/          # Configuraciones de Spring
│   └── external/        # Servicios externos (email, WhatsApp)
└── web/                 # Controladores REST
    ├── controller/      # Endpoints de la API
    ├── filter/          # Filtros HTTP (JWT, CORS)
    └── exception/       # Manejo global de excepciones
```

## Reglas de dependencia

- `domain` NO depende de ninguna otra capa (es el núcleo).
- `application` depende solo de `domain`.
- `infrastructure` depende de `domain` (implementa sus interfaces).
- `web` depende de `application` y `domain`.
- NUNCA importar clases de `infrastructure` en `domain` o `application`.

## Buenas prácticas

### General
- Principios SOLID en todo el código.
- Nombres descriptivos en inglés para clases, métodos y variables.
- Métodos cortos con una sola responsabilidad.
- Evitar código duplicado (DRY).
- Preferir composición sobre herencia.
- Manejar excepciones de forma centralizada con @ControllerAdvice.

### Java / Spring Boot
- Usar Lombok para reducir boilerplate (@Data, @Builder, @AllArgsConstructor, etc.).
- Inyección de dependencias por constructor (no @Autowired en campos).
- Validaciones con Bean Validation (@NotNull, @NotBlank, @Size, etc.).
- Usar Optional para valores que pueden ser nulos.
- Transacciones explícitas con @Transactional donde corresponda.

### Documentación
- TODAS las clases públicas deben tener Javadoc con descripción.
- TODOS los métodos públicos deben tener Javadoc con @param, @return y @throws.
- Los DTOs deben documentar cada campo.
- Los endpoints deben documentar el propósito, parámetros y respuestas.

### Frontend (React)
- Componentes funcionales con hooks.
- Separación en componentes reutilizables.
- Manejo de estado con Context API o hooks personalizados.
- Nombres de componentes en PascalCase.
- Nombres de funciones y variables en camelCase.
- Comentarios JSDoc en funciones utilitarias y hooks personalizados.

### Patrones de diseño
- Aplicar patrones de diseño SOLO cuando sea necesario y aporten valor real.
- No forzar patrones donde una solución simple es suficiente.
- Cuando se aplique un patrón de diseño, documentarlo en el archivo `docs/design-patterns.md` con:
  - Nombre del patrón
  - Dónde se aplicó (clase/módulo)
  - Por qué se eligió ese patrón
  - Beneficio concreto que aporta

### API REST
- Usar verbos HTTP correctamente (GET, POST, PUT, PATCH, DELETE).
- Respuestas con códigos HTTP apropiados (200, 201, 400, 401, 403, 404, 500).
- Formato de respuesta consistente con estructura { data, message, errors }.
- Versionado de API: /api/v1/...
