-- V5: Insertar usuario administrador por defecto
-- Password: admin123 (BCrypt encoded)
INSERT INTO usuarios (username, password, rol, created_at)
VALUES ('admin', '$2a$10$EIX2gXwMOfy5IfZBpMRSqOe9FE.PAhCSMvsiVHtXhPCwRVGOGJ/CG', 'ADMIN', NOW());
