# Dependencias entre roles

## Vista rápida

```text
                    +------------------+
                    | DevOps Architect |
                    | nginx, CI/CD,    |
                    | skeleton Compose |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                   |                   |
         v                   v                   v
+----------------+  +----------------+  +----------------+
| Frontend       |  | Backend        |  | DBA / SRE      |
| UI + Fetch     |  | FastAPI        |  | Postgres+EBS   |
+--------+-------+  +--------+-------+  +--------+-------+
         |                   |                   |
         |         contrato JSON /api            |
         +------------------>|<------------------+
                             |  schema + env
                             v
                      PostgreSQL (interno)
```

Los cuatro roles pueden **desarrollar en paralelo**. Las flechas indican dependencias de *integración*, no de inicio de trabajo.

## Matriz de dependencias

| Rol consumidor | Depende de | Artefacto / condición | Bloquea el merge a `main`? | Bloquea empezar a codear? |
|----------------|------------|------------------------|----------------------------|---------------------------|
| Frontend | Backend | Contrato JSON estable; API disponible | Sí (E2E) | No (puede mockear) |
| Frontend | DevOps | Nginx sirve `/` y proxy `/api/` | Sí (E2E producción) | No |
| Backend | DBA | `schema.sql` + servicio `db` + vars | Sí (persistencia real) | No (puede stubear) |
| Backend | DevOps | Red Compose + proxy `/api/` | Sí (ruta pública) | No (puerto interno debug) |
| DBA | DevOps | Skeleton Compose, red, path EBS, SG | Parcial (AWS) | No (Compose local) |
| DevOps | Frontend | Servicio/archivos estáticos | Sí (demo UI) | No (nginx con placeholder) |
| DevOps | Backend | Upstream API | Sí (demo CRUD) | No |
| DevOps | DBA | DB interna + hardening | Sí (chaos test) | No |
| DevOps | Todos | PRs y autoría limpia | Sí (Git Trace) | No |

## Contrato compartido (única fuente de verdad)

Definido en [MapaGeneralDelProyecto.md](MapaGeneralDelProyecto.md):

| Elemento | Valor |
|----------|--------|
| Alta | `POST /api/visitantes` |
| Listado | `GET /api/visitantes` |
| Campos | `nombre`, `correo`, `categoria_entrada` |
| Frontend | Solo rutas relativas `/api/...` |
| DB | Tabla `visitantes` vía `database/schema.sql` |

**Cambio de contrato:** requiere mensaje al canal del equipo + PR que actualice el mapa + OK de Frontend y Backend (y DBA si cambia el schema).

## Archivo compartido: `docker-compose.yml`

| Sección | Dueño | Quién no debe editarla |
|---------|-------|-------------------------|
| Redes / nombre de proyecto / skeleton | DevOps | Frontend, Backend, DBA (salvo acuerdo) |
| `services.db` + volumes datos | DBA | Resto |
| `services.backend` | Backend | Resto |
| `services.frontend` | Frontend | Resto |
| `services.nginx` + `ports: "80:80"` | DevOps | Resto |

Si dos PRs tocan el mismo bloque: el **dueño del bloque** lidera la resolución; DevOps coordina el merge.

## Dependencias por fase

### Fase 0 — Kickoff (DevOps)

- Documentación y reglas Git.
- Skeleton Compose + redes.
- Ramas `feature/*` creadas o instructivo claro.

### Fase 1 — Paralelo

| Rol | Puede avanzar sin esperar |
|-----|---------------------------|
| DBA | Schema + servicio db local |
| Backend | API + Dockerfile (mock DB o db local) |
| Frontend | UI + Fetch al path relativo |
| DevOps | nginx.conf + deploy.yml (con placeholders) |

### Fase 2 — Integración (orden de merge)

1. DBA → `main`
2. Backend → `main`
3. Frontend → `main`
4. DevOps (Nginx final + CI/CD verificado) → `main`

### Fase 3 — Producción y auditoría

- DevOps: secrets, deploy verde, PDF.
- DBA + DevOps: chaos (`down`/`up`) y scan 5432.
- Todo el equipo: Git Trace y stress del formulario.

## Puntos de fricción conocidos y dueño de la mitigación

| Fricción | Roles implicados | Dueño de la mitigación |
|----------|------------------|------------------------|
| Conflicto en Compose | Todos | Dueño del bloque + DevOps |
| 502 Bad Gateway | DevOps, Backend, Frontend | DevOps (proxy) con apoyo Backend |
| Datos perdidos tras down | DBA | DBA (volumen); DevOps (path EBS) |
| 5432 abierto | DBA, DevOps | Ambos (Compose + SG) |
| CORS / API desde file:// | Frontend, DevOps | Probar solo vía Nginx |
| Credenciales en git | Backend, DBA, DevOps | Revisión de PR por DevOps |

## Comunicación mínima recomendada

1. **Día 0:** leer mapa + rol propio + este documento.
2. **Antes del primer PR de cada rol:** sync con `main` y anuncio en el grupo.
3. **Cambio de contrato o de puertos:** mensaje explícito; no “push silencioso”.
4. **Conflicto de merge:** no forzar; avisar a DevOps en < 24 h.
