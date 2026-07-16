# DevOps CRUD Sprint — Centro Cultural Inteligente

Módulo de Registro de Visitantes con Frontend, API FastAPI, PostgreSQL, Nginx y despliegue automático a AWS EC2 vía GitHub Actions.

## Documentación del equipo

Empieza aquí:

| Documento | Contenido |
|-----------|-----------|
| [Documentacion/MapaGeneralDelProyecto.md](Documentacion/MapaGeneralDelProyecto.md) | Arquitectura, ownership, contrato API |
| [Documentacion/Roles/](Documentacion/Roles/) | Responsabilidades por integrante |
| [Documentacion/ReglasDeGit.md](Documentacion/ReglasDeGit.md) | Ramas, commits, PRs |
| [Documentacion/PlanDeTrabajo.md](Documentacion/PlanDeTrabajo.md) | Fases e integración |
| [TallerGrupalCRUD.md](TallerGrupalCRUD.md) | Enunciado del taller |

## Roles y ramas

| Rol | Rama | Carpeta |
|-----|------|---------|
| Frontend Engineer | `feature/frontend` | `frontend/` |
| Backend Developer | `feature/backend` | `backend/` |
| DBA / SRE | `feature/database` | `database/` |
| DevOps Architect | `feature/devops` | `nginx/`, `.github/`, skeleton Compose |

**Prohibido** trabajar directamente sobre `main`. Solo Pull Requests.

## Estructura

```text
frontend/               # Integrante A
backend/                # Integrante B
database/               # Integrante C (schema.sql)
nginx/                  # Integrante D (API Gateway)
.github/workflows/      # Integrante D (CI/CD)
docker-compose.yml      # Compartido por BLOQUES (ver comentarios en el archivo)
.env.example            # Plantilla de variables
```

## Contrato API (vía Nginx :80)

- `POST /api/visitantes` — registrar visitante
- `GET /api/visitantes` — listar confirmados
- `PUT /api/visitantes/{id}` — actualizar visitante
- `DELETE /api/visitantes/{id}` — eliminar visitante

El frontend debe usar rutas relativas `/api/visitantes` (sin IPs fijas).

## Arranque local (cuando todas las capas estén listas)

```bash
cp .env.example .env
# Completar valores en .env (no subir .env al repo)

docker compose config    # validar sintaxis
docker compose up -d --build
docker compose ps
```

App: [http://localhost](http://localhost) (puerto 80).

PostgreSQL **no** debe publicarse en el host (`5432` cerrado al exterior).

## Ownership de `docker-compose.yml`

| Bloque | Dueño |
|--------|-------|
| Redes / skeleton | DevOps |
| `services.nginx` | DevOps |
| `services.frontend` | Frontend |
| `services.backend` | Backend |
| `services.db` + volumes de datos | DBA |

## CI/CD

Al fusionar en `main`, GitHub Actions (`.github/workflows/deploy.yml`):

1. Valida `docker compose config`
2. Se conecta por SSH a la EC2 del grupo
3. Actualiza el código y ejecuta `docker compose up -d --build`

### Secrets requeridos en GitHub

| Secret | Descripción |
|--------|-------------|
| `SERVER_IP` | IP pública de la EC2 |
| `SERVER_USER` | Usuario SSH (p. ej. `ubuntu`) |
| `SSH_PRIVATE_KEY` | Clave privada para desplegar |
| `DEPLOY_PATH` | (opcional) Ruta del proyecto en el servidor; default `/opt/devops-crud-sprint` |

## Security Group AWS (checklist)

- Puerto **80** abierto (HTTP)
- Puerto **22** restringido (admin / runner)
- Puerto **5432** cerrado al mundo

## Orden de merge recomendado

1. `feature/database`
2. `feature/backend`
3. `feature/frontend`
4. `feature/devops`
