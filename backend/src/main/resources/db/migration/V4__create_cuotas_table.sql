-- V4: Crear tabla de cuotas
CREATE TABLE cuotas (
    id BIGSERIAL PRIMARY KEY,
    prestamo_id BIGINT NOT NULL,
    numero_cuota INTEGER NOT NULL,
    monto DECIMAL(12, 2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    fecha_pago DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_cuotas_prestamo FOREIGN KEY (prestamo_id) REFERENCES prestamos(id),
    CONSTRAINT chk_cuotas_estado CHECK (estado IN ('PENDIENTE', 'PAGADA', 'EN_MORA')),
    CONSTRAINT chk_cuotas_monto_positivo CHECK (monto > 0),
    CONSTRAINT chk_cuotas_numero_positivo CHECK (numero_cuota > 0)
);

CREATE INDEX idx_cuotas_prestamo_id ON cuotas(prestamo_id);
CREATE INDEX idx_cuotas_estado ON cuotas(estado);
CREATE INDEX idx_cuotas_fecha_vencimiento ON cuotas(fecha_vencimiento);
