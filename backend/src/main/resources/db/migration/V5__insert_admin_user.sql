-- V5: Insertar usuario administrador por defecto
-- Password: admin123 (BCrypt encoded)
INSERT INTO usuarios (username, password, rol, created_at)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NOW());
