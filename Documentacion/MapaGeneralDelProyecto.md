# Mapa general del proyecto

## Identificación

| Campo | Valor |
|-------|--------|
| Nombre | DevOps CRUD Sprint |
| Caso de estudio | Módulo de Registro de Visitantes — Centro Cultural Inteligente |
| Curso | Computación en la Nube y Orquestación de Entornos Virtuales |
| Metodología | Aprendizaje Basado en Proyectos (PBL) / Startup de 4 células |
| Documento de enunciado | [TallerGrupalCRUD.md](../TallerGrupalCRUD.md) |

## Estado actual (análisis)

| Elemento | Estado |
|----------|--------|
| Código de aplicación | Pendiente (repo vacío salvo enunciado y esta documentación) |
| `docker-compose.yml` | Pendiente |
| Frontend / Backend / Database / Nginx | Pendientes |
| GitHub Actions | Pendiente |
| Instancia AWS EC2 + EBS | Pendiente (infra del equipo) |
| Documentación de roles y Git | En curso (este directorio) |

**Conclusión:** todo el stack está por construir. La división de trabajo se basa en la arquitectura objetivo del enunciado y en ownership por carpeta para maximizar el paralelismo y minimizar conflictos de merge.

## Producto

Sistema web de registro de visitantes a eventos del centro cultural.

**Campos de dominio**

- Nombre
- Correo
- Categoría de entrada

**Flujos**

1. El visitante se registra en línea (`POST`).
2. El personal de recepción consulta la lista de confirmados (`GET`), de forma cercana a tiempo real (recarga de tabla desde el frontend).

## Stack tecnológico fijado

| Capa | Tecnología |
|------|------------|
| Frontend | HTML + JavaScript (Fetch API) |
| Backend | FastAPI (Python) |
| Base de datos | PostgreSQL |
| API Gateway / proxy | Nginx (puerto 80) |
| Orquestación local/servidor | Docker Compose |
| Persistencia | Volumen en host AWS EBS |
| CI/CD | GitHub Actions → SSH → EC2 |

## Arquitectura objetivo

```text
  Navegador
      |
      |  HTTP :80
      v
  +--------+        +-----------+
  | Nginx  |------->| Frontend  |   (estáticos)
  | :80    |        +-----------+
  |        |
  |        |        +-----------+        +------------+
  |        |------->| Backend   |------->| PostgreSQL |
  +--------+  /api  | (interno) | red    | (sin :5432 |
                    +-----------+ interna|  público)  |
                                         +-----+------+
                                               |
                                         Volumen EBS
```

### Servicios Compose previstos

| Servicio | Puerto al exterior | Dueño del bloque |
|----------|--------------------|------------------|
| `nginx` | `80:80` | DevOps Architect |
| `frontend` | No expuesto (solo red interna / vía Nginx) | Frontend Engineer |
| `backend` | No expuesto (solo vía Nginx `/api/`) | Backend Developer |
| `db` | **No** publicar `5432` | DBA / SRE |

## Estructura de carpetas y ownership

```text
DevOps-CRUD-Sprint/
├── Documentacion/              → DevOps Architect
│   ├── MapaGeneralDelProyecto.md
│   ├── DependenciasEntreRoles.md
│   ├── PlanDeTrabajo.md
│   ├── CronogramaSugerido.md
│   ├── ReglasDeGit.md
│   └── Roles/
├── frontend/                   → Frontend Engineer
├── backend/                    → Backend Developer
├── database/                   → DBA / SRE
├── nginx/                      → DevOps Architect
├── .github/workflows/          → DevOps Architect
├── docker-compose.yml          → Compartido por SECCIONES (ver abajo)
├── .env.example                → DevOps (plantilla); DBA/Backend (claves DB)
├── TallerGrupalCRUD.md         → Referencia del curso (no editar salvo acuerdo)
└── README.md                   → DevOps Architect
```

### Regla de ownership en `docker-compose.yml`

Archivo de alto riesgo de conflicto. Cada rol **solo** modifica su bloque:

| Bloque | Dueño |
|--------|-------|
| Skeleton (`version`/`name`, `networks`, nombres de servicios) | DevOps (una vez en kickoff) |
| `services.db` + `volumes` de datos | DBA / SRE |
| `services.backend` (+ build/context backend) | Backend Developer |
| `services.frontend` (+ build/context frontend) | Frontend Engineer |
| `services.nginx` + publicación puerto 80 | DevOps Architect |

Credenciales únicamente por variables de entorno (`POSTGRES_*`, `DATABASE_URL`, etc.). Nunca literales en el repositorio.

## Contrato de integración (punto de acoplamiento)

Acordado como contrato estable entre capas. Cambios requieren aviso al equipo y actualización de este mapa.

### HTTP (vía Nginx)

| Método | Ruta pública | Descripción |
|--------|--------------|-------------|
| `POST` | `/api/visitantes` | Crear registro |
| `GET` | `/api/visitantes` | Listar registros |

El frontend **debe** llamar a rutas relativas `/api/visitantes` (sin IPs ni hosts fijos en el JS).

### JSON de ejemplo (cuerpo POST / elementos del GET)

```json
{
  "nombre": "Ana Pérez",
  "correo": "ana@mail.com",
  "categoria_entrada": "General"
}
```

Respuesta GET sugerida: arreglo JSON de objetos con al menos esos campos más `id` y, si aplica, `creado_en`.

### Esquema SQL mínimo esperado (`database/schema.sql`)

```sql
CREATE TABLE visitantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  categoria_entrada VARCHAR(50) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);
```

## Roles y ramas

| Rol | Rama | Documento |
|-----|------|-----------|
| Frontend Engineer | `feature/frontend` | [Roles/FrontendEngineer.md](Roles/FrontendEngineer.md) |
| Backend Developer | `feature/backend` | [Roles/BackendDeveloper.md](Roles/BackendDeveloper.md) |
| DBA / SRE | `feature/database` | [Roles/DatabaseAdministratorSRE.md](Roles/DatabaseAdministratorSRE.md) |
| DevOps Architect | `feature/devops` | [Roles/DevOpsArchitect.md](Roles/DevOpsArchitect.md) |

**Asignación activa (agente / usuario de esta sesión):** DevOps Architect. El trabajo de implementación posterior se limita a ese rol.

## Módulos: existentes vs pendientes

| Módulo / funcionalidad | Estado | Dueño |
|------------------------|--------|-------|
| Formulario + tabla dinámica | Pendiente | Frontend |
| Fetch POST/GET `/api/visitantes` | Pendiente | Frontend |
| API REST FastAPI | Pendiente | Backend |
| Variables de entorno DB en backend | Pendiente | Backend |
| PostgreSQL en Compose | Pendiente | DBA |
| Volumen EBS / persistencia | Pendiente | DBA |
| `schema.sql` | Pendiente | DBA |
| Hardening puerto 5432 | Pendiente | DBA (+ SG AWS con DevOps) |
| `nginx.conf` API Gateway | Pendiente | DevOps |
| Skeleton Compose + redes | Pendiente | DevOps |
| GitHub Actions `deploy.yml` | Pendiente | DevOps |
| GitHub Secrets SSH | Pendiente | DevOps |
| Documentación de roles y Git | Hecho / en esta carpeta | DevOps |
| PDF de entrega y bitácora | Pendiente | DevOps |

## Rúbrica de evaluación (alineación)

| Criterio | Puntos | Capas principales |
|----------|--------|-------------------|
| Sincronización y Git Flow | 2.5 | Todo el equipo; coordina DevOps |
| Persistencia y Hardening | 2.5 | DBA / SRE |
| Integración API Gateway | 2.5 | DevOps + Frontend + Backend |
| Automatización CI/CD | 2.5 | DevOps |

## Documentos relacionados

- [DependenciasEntreRoles.md](DependenciasEntreRoles.md)
- [PlanDeTrabajo.md](PlanDeTrabajo.md)
- [CronogramaSugerido.md](CronogramaSugerido.md)
- [ReglasDeGit.md](ReglasDeGit.md)
