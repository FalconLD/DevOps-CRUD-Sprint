# Carpeta: `backend/` — OWNER Backend Developer

Rama: `feature/backend`

Lee: [Documentacion/Roles/BackendDeveloper.md](../Documentacion/Roles/BackendDeveloper.md)

## Debes crear aquí

- API **FastAPI** con:
  - `POST /api/visitantes`
  - `GET /api/visitantes`
- Credenciales DB solo por variables de entorno (`POSTGRES_*` o `DATABASE_URL`)
- `Dockerfile` — proceso escuchando en **`0.0.0.0:8000`**
- `requirements.txt`
- Solo el bloque `services.backend` en `docker-compose.yml` si hace falta ajustarlo

## Host de Postgres en Compose

`POSTGRES_HOST=db` (nombre del servicio), puerto `5432` interno.

## No editar

`frontend/`, `database/schema.sql` (salvo acuerdo), `nginx/`, `.github/`
