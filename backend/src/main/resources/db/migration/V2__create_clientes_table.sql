-- V2: Crear tabla de clientes
CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    razon_social VARCHAR(150) NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_clientes_razon_responsable UNIQUE (razon_social, responsable)
);

-- Agregar FK de usuarios a clientes
ALTER TABLE usuarios
    ADD CONSTRAINT fk_usuarios_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id);
