# Cronograma sugerido

Calendario orientativo para un sprint de laboratorio de **5 días hábiles** (ajustable a la fecha real de auditoría). Los días son secuenciales desde el kickoff del equipo.

## Resumen visual

```text
Día 1  | Kickoff + docs + ramas + skeleton DevOps + inicio paralelo
Día 2  | Desarrollo paralelo intensivo (DB / API / UI / Nginx)
Día 3  | Merges database → backend → frontend; E2E local
Día 4  | AWS + Secrets + Actions verde; smoke producción
Día 5  | Ensayo auditoría + PDF + buffer de fixes
```

## Día 1 — Constitución y desbloqueo

| Franja | Actividad | Roles |
|--------|-----------|-------|
| Mañana | Repo, colaboradores, lectura del mapa y del rol propio | Todos |
| Mañana | Crear ramas `feature/*` | Todos / DevOps |
| Tarde | Skeleton Compose + redes (DevOps); inicio `schema.sql` (DBA); scaffold API (Backend); maqueta HTML (Frontend) | Paralelo |
| Fin del día | Sync: contrato JSON reconfirmado (5 min) | Todos |

**Hito:** cada integrante tiene rama remota y primer commit propio (aunque sea scaffold).

## Día 2 — Construcción paralela

| Rol | Meta del día |
|-----|----------------|
| DBA | `db` en Compose sin puerto público + volumen + init schema |
| Backend | POST/GET funcionando contra Postgres (Compose) |
| Frontend | Formulario + tabla + Fetch (probar vía Nginx si ya hay skeleton) |
| DevOps | `nginx.conf` usable; borrador `deploy.yml`; revisión de PRs tempranos |

**Hito:** capas casi listas para PR; DBA abre PR de `feature/database` si está estable.

## Día 3 — Integración

| Orden | Acción |
|-------|--------|
| 1 | Merge PR database → `main` |
| 2 | Backend rebase/sync + PR + merge |
| 3 | Frontend rebase/sync + PR + merge |
| 4 | Prueba E2E local: alta + listado vía puerto 80 |
| 5 | DevOps ajusta Nginx/Compose ante hallazgos | 

**Hito:** CRUD completo en local detrás de Nginx.

## Día 4 — Producción y CI/CD

| Actividad | Roles |
|-----------|-------|
| EC2 + EBS + Security Group | DevOps (+ DBA path volumen) |
| Configurar Secrets en GitHub | DevOps |
| Merge/ajuste `feature/devops` + primer deploy Actions | DevOps |
| Smoke test en `http://IP` | Todos |
| Corregir 502/vars/volumen si falla | Dueño de la capa + DevOps |

**Hito:** luz verde en Actions y URL pública respondiendo.

## Día 5 — Auditoría y entrega

| Actividad | Roles |
|-----------|-------|
| Ensayo Git Trace | Todos / DevOps |
| Stress del formulario | Frontend + Backend |
| Chaos: `down`/`up` + scan 5432 | DBA + DevOps |
| Capturas para bitácora | DevOps |
| PDF consolidado | DevOps |
| Buffer de hotfixes vía PR (no commits directos a main) | Según capa |

**Hito:** equipo listo para defensa en aula.

## Variante de 7 días (si hay más margen)

| Día | Foco |
|-----|------|
| 1–2 | Igual que días 1–2 del plan de 5 |
| 3 | Solo calidad (tests manuales, validación schema, UX básica) |
| 4 | Igual día 3 (integración) |
| 5–6 | Igual día 4 (nube/CI) con más tiempo de estabilización |
| 7 | Igual día 5 (auditoría/PDF) |

## Dependencias temporales críticas

| Si esto se atrasa… | Entonces… |
|--------------------|-----------|
| PR de database | Backend no debe mergear a `main` aún (sí puede seguir en su rama) |
| Nginx / skeleton | E2E y demo se retrasan; cada capa sigue en aislamiento |
| Secrets / EC2 | Actions no puede ponerse verde; priorizar Día 4 temprano |
| Contrato JSON | Frontend y Backend pierden tiempo en retrabajo |

## Buffer y reglas de emergencia

- Reservar **medio día** antes de la auditoría solo para bugs de integración.
- Hotfix en producción: rama `fix/<descripcion>` → PR → Actions (nunca editar a mano solo en el servidor sin reflejar en git).
- Si un rol está bloqueado > 4 h por dependencia: avisar a DevOps y usar mock/stub documentado.

## Alineación con rúbrica

| Día objetivo | Criterio que más se fortalece |
|--------------|-------------------------------|
| 1–3 | Git Flow (2.5) + base para API Gateway |
| 2–3 | Persistencia/Hardening (2.5) en local |
| 3–4 | API Gateway (2.5) |
| 4–5 | CI/CD (2.5) + ensayo chaos |
