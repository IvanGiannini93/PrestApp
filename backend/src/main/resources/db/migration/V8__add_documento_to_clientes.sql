-- V8: Agregar campo documento a clientes y hacer único
ALTER TABLE clientes ADD COLUMN documento VARCHAR(20);
ALTER TABLE clientes ADD CONSTRAINT uk_clientes_documento UNIQUE (documento);
ALTER TABLE clientes ADD CONSTRAINT uk_clientes_email UNIQUE (email);
