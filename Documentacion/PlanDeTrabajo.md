# Plan de trabajo

## Propósito

Secuencia de trabajo para el DevOps CRUD Sprint que permite desarrollo en paralelo por roles y una integración ordenada hacia `main`, alineada a la rúbrica del taller.

## Principios

1. **Paralelismo máximo en desarrollo; serialización mínima en merges.**
2. **Ownership por carpeta** (ver [MapaGeneralDelProyecto.md](MapaGeneralDelProyecto.md)).
3. **Contrato estable** antes de pelear por detalles de UI o SQL.
4. **Nadie commitea en `main`**; solo Pull Requests ([ReglasDeGit.md](ReglasDeGit.md)).
5. El agente/usuario de esta sesión opera solo como **DevOps Architect**.

## Fases

### Fase 0 — Constitución y base organizativa

| ID | Tarea | Responsable | Resultado |
|----|-------|-------------|-----------|
| 0.1 | Repo GitHub + colaboradores | Todo el equipo / DevOps | Repo único |
| 0.2 | Documentación de roles y Git | DevOps | Carpeta `Documentacion/` |
| 0.3 | Crear ramas `feature/frontend`, `feature/backend`, `feature/database`, `feature/devops` | Cada rol / DevOps | Ramas remotas |
| 0.4 | Acordar contrato JSON + schema mínimo (ya en mapa) | Todos (lectura) | Sin ambigüedad de campos |

**Estado:** 0.2 en ejecución en esta entrega; 0.1/0.3 pendientes de operación Git del equipo.

### Fase 1 — Scaffold de infraestructura (DevOps, desbloquea Compose)

| ID | Tarea | Responsable |
|----|-------|-------------|
| 1.1 | Skeleton `docker-compose.yml` + network | DevOps |
| 1.2 | Servicio `nginx` + `nginx.conf` (placeholders de upstream) | DevOps |
| 1.3 | `.env.example` plantilla + `README` | DevOps |
| 1.4 | Borrador `deploy.yml` (puede completar tras tener EC2) | DevOps |

Las capas de app **no esperan** a que 1.x esté mergeado para codear en su rama; sí lo necesitan para E2E.

### Fase 2 — Desarrollo paralelo por capa

| ID | Tarea | Responsable | Rama |
|----|-------|-------------|------|
| 2.1 | Postgres + volumen + `schema.sql` + hardening Compose | DBA | `feature/database` |
| 2.2 | FastAPI POST/GET + env + Dockerfile | Backend | `feature/backend` |
| 2.3 | Formulario + tabla + Fetch | Frontend | `feature/frontend` |
| 2.4 | Refinar Nginx y pipeline según servicios reales | DevOps | `feature/devops` |

Criterio de salida de fase: cada rol tiene su capa funcionando de forma aislada o semi-integrada en su rama.

### Fase 3 — Integración en `main` (orden fijo)

| Orden | PR | Criterio para mergear |
|-------|-----|------------------------|
| 1 | `feature/database` → `main` | DB up, schema ok, 5432 no publicado |
| 2 | `feature/backend` → `main` | POST/GET contra `db`, env vars |
| 3 | `feature/frontend` → `main` | UI habla con `/api/visitantes` |
| 4 | `feature/devops` → `main` | Nginx E2E + Actions listo o casi listo |

DevOps revisa cada PR (o delega peer review) y resuelve conflictos de archivos compartidos con el dueño del bloque.

### Fase 4 — Nube y CI/CD

| ID | Tarea | Responsable |
|----|-------|-------------|
| 4.1 | EC2 + volumen EBS + path de datos | DevOps (+ DBA en path) |
| 4.2 | Security Group: 80 abierto; 5432 cerrado; SSH restringido | DevOps |
| 4.3 | GitHub Secrets | DevOps |
| 4.4 | Pipeline verde y deploy autónomo | DevOps |
| 4.5 | Smoke test producción `http://IP` | Todo el equipo |

### Fase 5 — Ensayo de auditoría y entrega

| ID | Tarea | Responsable |
|----|-------|-------------|
| 5.1 | Git Trace (ramas, PRs, autoría) | DevOps coordina; todos evidencian |
| 5.2 | Stress del formulario (altas concurrentes) | Frontend + Backend |
| 5.3 | Chaos: `docker compose down` / `up` + scan 5432 | DBA + DevOps |
| 5.4 | PDF: repo, IP, Actions, `docker compose ps`, logs | DevOps |

## Matriz RACI resumida

| Entregable | Frontend | Backend | DBA | DevOps |
|------------|----------|---------|-----|--------|
| UI registro | R | C | I | C |
| API REST | C | R | C | C |
| Postgres + persistencia | I | C | R | C |
| Nginx + CI/CD | I | I | C | R |
| PDF / defensa | C | C | C | R |

R = Responsible, C = Consulted, I = Informed.

## Definición de “listo” del proyecto

- CRUD usable en `http://IP_PUBLICA`.
- Actions en verde.
- Persistencia y hardening verificados.
- Historial Git auditable (feature branches + PRs).
- PDF de entrega subido por DevOps.

## Referencias

- [DependenciasEntreRoles.md](DependenciasEntreRoles.md)
- [CronogramaSugerido.md](CronogramaSugerido.md)
- Roles en [Roles/](Roles/)
