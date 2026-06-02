-- V10: Actualizar constraints de estado para incluir CANCELADO/CANCELADA
ALTER TABLE prestamos DROP CONSTRAINT IF EXISTS chk_prestamos_estado;
ALTER TABLE prestamos ADD CONSTRAINT chk_prestamos_estado CHECK (estado IN ('ACTIVO', 'COMPLETADO', 'EN_MORA', 'CANCELADO'));

ALTER TABLE cuotas DROP CONSTRAINT IF EXISTS chk_cuotas_estado;
ALTER TABLE cuotas ADD CONSTRAINT chk_cuotas_estado CHECK (estado IN ('PENDIENTE', 'PAGADA', 'EN_MORA', 'CANCELADA'));
