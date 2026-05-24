# Git Workflow

## Proyecto

- Nombre del proyecto: PrestApp
- Iniciales del proyecto: PA

## Reglas de branching

- Antes de comenzar cualquier tarea de implementación, SIEMPRE crear un nuevo branch desde la rama principal (main o develop).
- Formato del nombre del branch: `PA-XXX` donde XXX es el número de tarea secuencial con tres dígitos (PA-001, PA-002, PA-003, etc.).
- Para determinar el siguiente número, revisar los branches existentes y usar el siguiente número disponible.
- Hacer commit con mensajes descriptivos en español siguiendo conventional commits: `feat(PA-XXX):`, `fix(PA-XXX):`, `refactor(PA-XXX):`, `docs(PA-XXX):`, `test(PA-XXX):`.
- No hacer push directamente a main/master. Siempre trabajar en branches separados.

## Flujo de trabajo

1. Verificar en qué branch estamos actualmente.
2. Revisar branches existentes para determinar el siguiente número de tarea disponible.
3. Crear y cambiar al nuevo branch (ej: `PA-001`) antes de hacer cualquier cambio.
4. Realizar los cambios necesarios.
5. Hacer commit de los cambios incluyendo el identificador del branch en el mensaje.
6. Push al branch remoto con `-u` para configurar tracking.
