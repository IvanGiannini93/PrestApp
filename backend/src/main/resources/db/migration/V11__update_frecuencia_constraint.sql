-- V11: Actualizar constraint de frecuencia para incluir DIARIA y MENSUAL
ALTER TABLE prestamos DROP CONSTRAINT IF EXISTS chk_prestamos_frecuencia;
ALTER TABLE prestamos ADD CONSTRAINT chk_prestamos_frecuencia CHECK (frecuencia IN ('DIARIA', 'SEMANAL', 'QUINCENAL', 'MENSUAL'));
