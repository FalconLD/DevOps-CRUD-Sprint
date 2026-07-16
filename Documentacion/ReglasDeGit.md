# Reglas de Git

## Estrategia elegida: Git Flow simplificado

Se adopta un **Git Flow simplificado** basado en:

- Rama estable `main` (solo código integrado vía Pull Request).
- Una rama larga por rol: `feature/<rol>`.
- Integración a `main` exclusivamente con Pull Requests.
- Tags opcionales de release tras deploy estable (no obligatorio para el taller).

### Por qué no Trunk-Based Development

| Requisito del taller | Trunk-Based | Git Flow simplificado |
|----------------------|-------------|------------------------|
| Ramas por integrante (`feature/frontend`, etc.) | Choca (se evita ramas largas) | Encaja |
| Prohibición de programar en `main` | Posible con PR, pero el modelo empuja commits muy frecuentes a trunk | Explícito |
| Evaluación Git Trace / historial de PRs (2.5 pts) | Historial menos “por capa” | Evidencia clara por rol |
| DevOps coordina merge conflicts | Menos natural | Rol explícito |

**Conclusión:** Git Flow simplificado es el modelo alineado a la rúbrica y al enunciado.

## Convención de nombres de ramas

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Trabajo por rol | `feature/<rol>` | `feature/frontend`, `feature/backend`, `feature/database`, `feature/devops` |
| Hotfix urgente post-integración | `fix/<descripcion-corta>` | `fix/nginx-api-proxy` |
| No usar | `main` para desarrollo diario | — |

Reglas:

- Un rol **no** desarrolla features de otra capa en su rama.
- No crear ramas `feature/mi-nombre` genéricas; usar el rol.
- Tras merge, se puede seguir usando la misma `feature/<rol>` haciendo sync con `main` (rebase o merge de `main` en la feature).

## Convención de mensajes de commit

Formato **Conventional Commits**:

```text
<tipo>(<alcance>): <descripción breve en español o inglés, consistente en el equipo>

[cuerpo opcional]
```

### Tipos permitidos

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección |
| `docs` | Solo documentación |
| `chore` | Scaffold, tooling, limpieza menor |
| `ci` | GitHub Actions / pipeline |
| `refactor` | Cambio interno sin cambiar contrato |

### Alcances recomendados

`frontend`, `backend`, `database`, `nginx`, `compose`, `ci`, `docs`

### Ejemplos

```text
feat(frontend): agregar formulario de registro de visitantes
feat(backend): implementar POST y GET /api/visitantes
feat(database): añadir schema.sql y volumen de postgres
feat(nginx): proxy /api al servicio backend
ci(deploy): validar compose y desplegar por SSH
docs(roles): definir criterios de aceptación del DBA
fix(compose): evitar publicar puerto 5432
```

Prohibido: commits vacíos de mensaje, “update”, “changes”, “WIP” como mensaje final en `main` (WIP solo temporal en la feature, preferible squash o mensajes claros antes del PR).

## Política de Pull Requests

1. **Destino:** siempre `main`.
2. **Origen:** `feature/<rol>` (o `fix/...`).
3. **Título del PR:** mismo estilo que el commit principal o resumen claro del rol.
4. **Descripción mínima:**
   - Qué cambió
   - Cómo probarlo
   - Checklist de criterios de aceptación del rol (enlace al doc en `Documentacion/Roles/`)
5. **Commits directos a `main`:** prohibidos (incluye al DevOps).
6. **Un PR no debe mezclar capas** (p. ej. no incluir `frontend/` y `database/` en el mismo PR salvo coordinación excepcional documentada).
7. **Orden preferido de merges:** database → backend → frontend → devops (ver [PlanDeTrabajo.md](PlanDeTrabajo.md)).

## Estrategia de revisión de código

| Quién revisa | Qué |
|--------------|-----|
| DevOps Architect | Todos los PRs (integración, secretos, Compose compartido, cumplimiento Git) |
| Peer de otra capa | Al menos un vistazo al contrato (Frontend↔Backend, Backend↔DBA) |
| Dueño del archivo compartido | Si el PR toca su bloque de `docker-compose.yml` |

### Checklist del revisor

- [ ] El PR solo toca archivos del ownership del autor (o el cambio cruzado está justificado).
- [ ] No hay secretos ni IPs/credenciales en claro.
- [ ] El contrato `/api/visitantes` se respeta.
- [ ] Compose: no se abre `5432` al host público.
- [ ] La descripción incluye cómo probar.

Aprobación mínima sugerida: **1 aprobación** (DevOps o peer) antes de merge. El autor no se auto-aprueba.

## Resolución de conflictos

1. El autor actualiza su rama con `main` (`merge` o `rebase`; el equipo elige uno y se mantiene consistente — recomendación: **merge de `main` en la feature** para historial más simple en clase).
2. Si el conflicto es en un archivo de **su ownership**, el autor resuelve.
3. Si el conflicto es en **archivo compartido** (`docker-compose.yml`, `.env.example`):
   - El **dueño del bloque** decide el contenido final de su sección.
   - **DevOps coordina** la sesión de resolución y el merge.
4. No usar `push --force` a `main`. Evitar force-push a features compartidas; si hace falta force-push a tu propia feature tras rebase, avisar al equipo.
5. Tras resolver, re-ejecutar la prueba mínima de la capa antes de pedir re-review.

## Frecuencia de sincronización con `main`

| Momento | Acción |
|---------|--------|
| Al menos **una vez al día** | Traer `main` a tu `feature/<rol>` |
| **Antes de abrir un PR** | Sync obligatorio |
| **Después de cada merge ajeno a `main`** que toque Compose/contrato | Sync el mismo día |
| Antes de la auditoría | Todas las features activas alineadas o ya mergeadas |

## Buenas prácticas para evitar conflictos

1. No editar carpetas de otros roles.
2. En `docker-compose.yml`, tocar solo tu bloque de servicio.
3. No reformatear archivos enteros ajenos (evita diffs ruidosos).
4. Acordar el contrato JSON/SQL temprano; no “sorpresas” el día del merge.
5. PRs pequeños y frecuentes mejor que un PR monolítico el último día.
6. No commitear `node_modules`, venvs, `.env` real, claves SSH ni binarios de datos Postgres.
7. Probar en tu rama antes de pedir review.
8. Comunicar cambios que afecten puertos, nombres de servicio Compose o paths de volúmenes.

## Protección recomendada de `main` (GitHub)

Configurar en el repositorio (lo aplica DevOps):

- Require a pull request before merging.
- Restrict direct pushes to `main`.
- (Opcional) Require status checks cuando el workflow exista.

## Autoría y auditoría (Git Trace)

- Cada integrante debe tener commits **propios** en su capa.
- No compartir credenciales Git ni hacer commits con autoría falsa.
- El historial de PRs mergeados es evidencia de evaluación (2.5 pts).

## Referencias rápidas de ramas

```text
main
 ├── feature/database    (DBA)
 ├── feature/backend     (Backend)
 ├── feature/frontend    (Frontend)
 └── feature/devops      (DevOps)  ← rol activo de esta sesión
```
