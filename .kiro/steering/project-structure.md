# Estructura del Proyecto

## Organización de carpetas

El proyecto PrestApp tiene frontend y backend separados en carpetas independientes dentro del mismo repositorio (monorepo):

```
PrestApp/
├── backend/          # Java 21 + Spring Boot 3.x + Maven
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/prestapp/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/         # React + Vite + JavaScript + Tailwind CSS
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── .kiro/            # Specs, steering y configuración de Kiro
```

## Stack técnico

### Backend
- Java 21
- Spring Boot 3.x
- Maven
- Spring Data JPA
- PostgreSQL 15
- Lombok
- Spring Security + JWT
- Flyway (migraciones)

### Frontend
- React (Vite)
- JavaScript (no TypeScript)
- Tailwind CSS

## Reglas
- NUNCA mezclar código de frontend dentro de backend ni viceversa.
- El backend expone una API REST que el frontend consume.
- El frontend se comunica con el backend exclusivamente vía HTTP/JSON.
