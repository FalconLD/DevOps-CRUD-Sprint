# Rol: DevOps Architect

| Campo | Valor |
|-------|--------|
| Integrante | D |
| Rama Git | `feature/devops` |
| Asignación de esta sesión | **Sí — rol activo del usuario y del agente** |
| Documento de mapa | [../MapaGeneralDelProyecto.md](../MapaGeneralDelProyecto.md) |

## Objetivo principal

Garantizar el perímetro (Nginx en puerto 80), la automatización CI/CD (GitHub Actions → SSH → EC2), la coordinación Git (PRs, conflictos) y la evidencia de entrega (PDF / bitácora), sin implementar la lógica de negocio de Frontend, Backend ni el schema SQL.

## Responsabilidades

- Configurar `nginx/nginx.conf` como API Gateway: estáticos del frontend en `/` y proxy de `/api/` al backend.
- Crear el skeleton de `docker-compose.yml` (redes, nombres de servicios) **una vez**, respetando que cada rol complete su bloque.
- Programar `.github/workflows/deploy.yml`: lint/validación de Compose + deploy por SSH.
- Administrar GitHub Secrets: `SERVER_IP`, `SERVER_USER`, `SSH_PRIVATE_KEY`.
- Coordinar merges a `main`, resolución de conflictos y cumplimiento de [ReglasDeGit.md](../ReglasDeGit.md).
- Mantener la documentación bajo `Documentacion/` y el `README.md` del repo.
- Consolidar el PDF de entrega (repo, IP pública, capturas Actions / `docker compose ps` / logs).
- Apoyar Security Group AWS: puerto 80 abierto, 5432 cerrado (junto con DBA).

## Alcance del trabajo

**Incluye**

- `nginx/`, `.github/workflows/`, skeleton Compose, `.env.example` plantilla, `Documentacion/`, `README.md`.
- Orquestación del flujo Git y del pipeline.
- Checklist de infraestructura EC2/EBS (provisionamiento y secrets).

**Excluye (salvo indicación explícita del usuario)**

- HTML/JS del formulario y tabla.
- Endpoints FastAPI y acceso SQL de negocio.
- Autoría de `database/schema.sql` y del bloque `services.db` (más allá de revisar PRs).

## Módulos / carpetas permitidas

| Ruta | Permiso |
|------|---------|
| `nginx/` | Crear y modificar |
| `.github/workflows/` | Crear y modificar |
| `Documentacion/` | Crear y modificar |
| `README.md` | Crear y modificar |
| `docker-compose.yml` | Skeleton + `services.nginx` (+ redes); no reescribir bloques ajenos |
| `.env.example` | Plantilla base (claves DB las completan DBA/Backend) |
| Código en `frontend/`, `backend/`, `database/` | Solo revisión / no desarrollo de features |

## Archivos que probablemente creará o modificará

```text
nginx/
  nginx.conf
.github/workflows/
  deploy.yml
docker-compose.yml          # skeleton + servicio nginx
.env.example
README.md
Documentacion/**            # ya iniciado
```

### Comportamiento esperado de Nginx

- Escucha en `:80`.
- `location /` → servicio `frontend`.
- `location /api/` → servicio `backend` (preservar path o reescribir según acuerdo documentado en el mapa).

### Comportamiento esperado del workflow

1. Trigger en push/merge a `main`.
2. Validar sintaxis de Compose (`docker compose config` o equivalente).
3. Conectar por SSH a EC2 con secrets.
4. Actualizar código y levantar stack (`docker compose up -d` o flujo equivalente).

## Dependencias con otros roles

| Depende de | Qué necesita | Cuándo |
|------------|--------------|--------|
| Frontend | Artefactos estáticos / servicio `frontend` | Para que Nginx sirva `/` |
| Backend | Servicio escuchando internamente en path `/api` | Para el proxy |
| DBA | DB interna + volumen; confirmación de no exponer 5432 | Para chaos test y deploy estable |
| Todo el equipo | PRs limpios y sync con `main` | Git Trace (2.5 pts) |

DevOps es el **integrador**: no bloquea el desarrollo paralelo, pero el merge ordenado sí (ver Plan de trabajo).

## Riesgos y posibles conflictos de integración

| Riesgo | Mitigación |
|--------|------------|
| Editar accidentalmente bloques Compose ajenos | Diff review; solo tocar skeleton + nginx |
| Secrets en el repo | Solo GitHub Secrets; nunca key material en git |
| Proxy mal configurado → 502 / CORS | Probar E2E en Compose antes del PR final |
| Commits directos a `main` | Prohibido; el propio DevOps usa `feature/devops` + PR |
| Desbalance de autoría (hacer el CRUD entero) | Respetar exclusiones de alcance |

## Entregables esperados

1. Nginx operativo en puerto 80 integrando FE + BE.
2. Pipeline Actions en verde desplegando a EC2.
3. Secrets configurados en el repositorio.
4. Coordinación visible de PRs y resolución de conflictos.
5. PDF consolidado: link repo, `http://IP_AWS`, bitácora (Actions, `docker compose ps`, logs).
6. Documentación de roles y reglas Git (esta carpeta).

## Criterios de aceptación

- [ ] Acceso a la app únicamente vía `http://IP:80` (o IP sin puerto explícito).
- [ ] Las llamadas del navegador a `/api/visitantes` llegan al backend a través de Nginx.
- [ ] Workflow en verde tras merge a `main`.
- [ ] Un cambio fusionado a `main` se refleja en el servidor de forma autónoma.
- [ ] No hay commits de aplicación hechos directamente en `main`.
- [ ] Evidencias listas para la auditoría en aula (Git Trace + CI/CD + apoyo a chaos con DBA).

## Checklist de tareas

- [x] Documentación organizativa bajo `Documentacion/` (fase actual).
- [ ] Crear rama `feature/devops`.
- [ ] Publicar skeleton Compose + redes + servicio nginx (placeholders).
- [ ] Escribir `nginx.conf` (estáticos + proxy `/api/`).
- [ ] Escribir `deploy.yml` (lint Compose + SSH deploy).
- [ ] Configurar GitHub Secrets (`SERVER_IP`, `SERVER_USER`, `SSH_PRIVATE_KEY`).
- [ ] Verificar SG: 80 abierto, 22 restringido al CI/admin, 5432 cerrado.
- [ ] Coordinar orden de merges: database → backend → frontend → devops.
- [ ] Ensayo de auditoría con el equipo.
- [ ] PDF de entrega y bitácora.

## Orden recomendado de implementación

1. Documentación y reglas Git (hecho en esta entrega).
2. Skeleton Compose + `nginx.conf` (puede ir en paralelo al resto).
3. Revisión de PRs de DBA/Backend/Frontend según orden de merge.
4. Workflow Actions + secrets + primer deploy.
5. Endurecimiento SG y ensayo chaos con DBA.
6. PDF y defensa en aula.

## Compromiso de alcance (agente)

Todo el trabajo posterior en esta sesión/proyecto, salvo orden explícita en contrario, se limita a las responsabilidades de **DevOps Architect** descritas aquí.
