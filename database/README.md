# Carpeta: `database/` — OWNER DBA / SRE

Rama: `feature/database`

Lee: [Documentacion/Roles/DatabaseAdministratorSRE.md](../Documentacion/Roles/DatabaseAdministratorSRE.md)

## Ya incluido (scaffold DevOps)

- `schema.sql` — contrato inicial de la tabla `visitantes` (ajústalo si hace falta)

## Tu trabajo

- Revisar/completar `schema.sql`
- Ajustar el bloque `services.db` y `volumes` en `docker-compose.yml`
- Persistencia en volumen/bind mount (EBS en AWS)
- **No publicar** el puerto `5432` al host ni a Internet
- Coordinar Security Group con DevOps (5432 cerrado)

## No editar

`frontend/`, `backend/` (código), `nginx/`, `.github/`

## Persistencia en AWS EBS

El servicio `db` usa un **bind mount** configurado mediante
`POSTGRES_DATA_PATH`. En desarrollo, Compose usa `./postgres_data`; en EC2 se
debe definir en `.env` la ruta donde está montado el volumen EBS, por ejemplo:

```dotenv
POSTGRES_DATA_PATH=/data/postgres
```

El directorio debe existir en el host y permitir escritura al UID/GID `70`,
usado por PostgreSQL en la imagen Alpine. `docker compose down` no elimina un
bind mount; no se debe borrar esa ruta durante la prueba de caos.

## Hardening

El servicio `db` no declara `ports`, por lo que `5432` no se publica en el
host. El backend se conecta internamente usando `db:5432`. Como segunda capa,
el Security Group de EC2 debe carecer de reglas de entrada para TCP/5432.

## Inicialización

`schema.sql` se monta en `/docker-entrypoint-initdb.d/01-schema.sql` y solo se
ejecuta al inicializar un directorio de datos vacío. Cambiar el script después
del primer arranque no migra una base existente; esos cambios requieren una
migración explícita o reinicializar datos únicamente en entornos descartables.
