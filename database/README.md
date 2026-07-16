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
