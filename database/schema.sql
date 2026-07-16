-- OWNER: DBA / SRE (rama feature/database)
-- Se ejecuta automáticamente una sola vez cuando PostgreSQL inicializa un
-- directorio de datos vacío.

BEGIN;

CREATE TABLE IF NOT EXISTS visitantes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL CHECK (btrim(nombre) <> ''),
    correo VARCHAR(150) NOT NULL CHECK (btrim(correo) <> ''),
    categoria_entrada VARCHAR(50) NOT NULL CHECK (btrim(categoria_entrada) <> ''),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_visitantes_correo
    ON visitantes (correo);

CREATE INDEX IF NOT EXISTS idx_visitantes_creado_en
    ON visitantes (creado_en DESC);

COMMIT;
