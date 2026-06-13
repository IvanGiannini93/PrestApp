-- V12: Agregar nombre y apellido a clientes, hacer razon_social opcional
ALTER TABLE clientes ADD COLUMN nombre VARCHAR(100);
ALTER TABLE clientes ADD COLUMN apellido VARCHAR(100);
ALTER TABLE clientes ALTER COLUMN razon_social DROP NOT NULL;
ALTER TABLE clientes ALTER COLUMN responsable DROP NOT NULL;

-- Migrar datos existentes: copiar responsable a nombre si existe
UPDATE clientes SET nombre = responsable WHERE nombre IS NULL AND responsable IS NOT NULL;
UPDATE clientes SET apellido = '' WHERE apellido IS NULL;
