-- V7: Agregar columnas para recuperación de contraseña
ALTER TABLE usuarios ADD COLUMN reset_token VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN reset_token_expiry TIMESTAMP;
