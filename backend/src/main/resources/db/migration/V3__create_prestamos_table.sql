-- V3: Crear tabla de préstamos
CREATE TABLE prestamos (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    monto DECIMAL(12, 2) NOT NULL,
    tasa_interes DECIMAL(5, 2) NOT NULL,
    plazo INTEGER NOT NULL,
    frecuencia VARCHAR(20) NOT NULL,
    fecha_inicio DATE NOT NULL,
    saldo_restante DECIMAL(12, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_prestamos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    CONSTRAINT chk_prestamos_frecuencia CHECK (frecuencia IN ('SEMANAL', 'QUINCENAL')),
    CONSTRAINT chk_prestamos_estado CHECK (estado IN ('ACTIVO', 'COMPLETADO', 'EN_MORA')),
    CONSTRAINT chk_prestamos_monto_positivo CHECK (monto > 0),
    CONSTRAINT chk_prestamos_tasa_positiva CHECK (tasa_interes > 0),
    CONSTRAINT chk_prestamos_plazo_positivo CHECK (plazo > 0)
);

CREATE INDEX idx_prestamos_cliente_id ON prestamos(cliente_id);
CREATE INDEX idx_prestamos_estado ON prestamos(estado);
