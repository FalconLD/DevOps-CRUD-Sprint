-- OWNER: DBA / SRE (rama feature/database)
-- Este archivo es el contrato inicial acordado en Documentacion/MapaGeneralDelProyecto.md.
-- El DBA puede ajustar tipos, índices y constraints; coordinar cambios con Backend.

CREATE TABLE IF NOT EXISTS visitantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    categoria_entrada VARCHAR(50) NOT NULL,
    creado_en TIMESTAMP DEFAULT NOW()
);
