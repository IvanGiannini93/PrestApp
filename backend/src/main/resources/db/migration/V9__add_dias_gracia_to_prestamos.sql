-- V9: Agregar días de gracia a préstamos y renombrar conceptualmente fecha_inicio a fecha primer cobro
ALTER TABLE prestamos ADD COLUMN dias_gracia INTEGER NOT NULL DEFAULT 0;
