# Rol: Database Administrator y SRE

| Campo | Valor |
|-------|--------|
| Integrante | C |
| Rama Git | `feature/database` |
| Documento de mapa | [../MapaGeneralDelProyecto.md](../MapaGeneralDelProyecto.md) |

## Objetivo principal

Configurar PostgreSQL en Docker Compose con persistencia física (volumen en host / EBS), esquema inicial automático (`schema.sql`) y endurecimiento de red: el puerto `5432` no debe ser accesible desde Internet.

## Responsabilidades

- Definir el servicio `db` (PostgreSQL) en `docker-compose.yml`.
- Montar volumen de datos en ruta de host alineada a EBS en AWS (p. ej. bind mount bajo un path acordado con DevOps).
- Crear `database/schema.sql` para inicializar tablas al primer arranque del contenedor.
- Garantizar que `5432` no se publique a `0.0.0.0` en Compose (sin `ports:` públicos hacia 5432).
- Documentar variables `POSTGRES_*` necesarias para Backend y `.env.example`.
- Apoyar la prueba de caos: tras `docker compose down` y `up`, los datos deben permanecer.

## Alcance del trabajo

**Incluye**

- Carpeta `database/` y bloque `services.db` + `volumes` de datos en Compose.
- Hardening a nivel Compose (no exponer 5432).
- Coordinación con DevOps sobre Security Group de AWS (5432 cerrado al mundo).

**Excluye**

- Código de la API FastAPI y del frontend.
- `nginx.conf` y workflows de GitHub Actions.
- Administración avanzada de réplicas/backup fuera del alcance del taller (salvo lo pedido en rúbrica).

## Módulos / carpetas permitidas

| Ruta | Permiso |
|------|---------|
| `database/` | Crear y modificar libremente |
| `docker-compose.yml` → `services.db` + `volumes` de persistencia | Modificar |
| `.env.example` → claves `POSTGRES_*` | Crear/actualizar (coordinar) |
| Resto del repo | Solo lectura / no editar |

## Archivos que probablemente creará o modificará

```text
database/
  schema.sql                 # CREATE TABLE visitantes ...
docker-compose.yml           # services.db + volumes
.env.example                 # POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, ...
```

**Notas de montaje típicas**

- Usar imagen oficial `postgres` y montar `schema.sql` en `/docker-entrypoint-initdb.d/`.
- Volumen nombrado o bind mount a path en EBS (acordar path con DevOps, p. ej. `/data/postgres`).

## Dependencias con otros roles

| Depende de | Qué necesita | Cuándo |
|------------|--------------|--------|
| DevOps | Skeleton Compose + red interna; EC2/EBS/SG; path del volumen en servidor | Kickoff y despliegue |
| Backend | Consumidor del schema y de las vars | Integración; no bloquea el diseño del schema |
| Frontend | Ninguna directa | — |

**Contrato hacia Backend:** mantener columnas `nombre`, `correo`, `categoria_entrada` (+ `id`, `creado_en` recomendado) según el mapa.

## Riesgos y posibles conflictos de integración

| Riesgo | Mitigación |
|--------|------------|
| Publicar `5432:5432` “para probar” y olvidarlo | Nunca añadir `ports` de db en la versión a `main` |
| Schema incompatible con Backend | Publicar `schema.sql` pronto; avisar cambios |
| Volumen en path efímero del contenedor | Usar volumen/bind en host EBS |
| Editar bloques `backend`/`nginx` | Fuera de alcance |
| SG de AWS deja 5432 abierto | Checklist conjunto con DevOps en auditoría |

## Entregables esperados

1. Postgres operativo en Compose sin puerto público.
2. `schema.sql` que crea la tabla al primer boot.
3. Persistencia demostrable tras `down`/`up`.
4. Rama `feature/database` + PR (idealmente **primero** en el orden de merges).

## Criterios de aceptación

- [ ] Servicio `db` healthy/running en `docker compose ps`.
- [ ] Tabla `visitantes` existe tras el primer arranque limpio.
- [ ] Escaneo externo al puerto 5432 falla o da timeout (Compose + SG AWS).
- [ ] Tras `docker compose down` y `docker compose up -d`, los registros previos siguen existiendo.
- [ ] Variables de conexión documentadas para el Backend.
- [ ] Autoría Git clara en `feature/database`.

## Checklist de tareas

- [ ] Crear rama `feature/database` desde `main` actualizado.
- [ ] Escribir `database/schema.sql` según contrato del mapa.
- [ ] Definir `services.db` sin `ports` públicos.
- [ ] Configurar volumen/bind para datos.
- [ ] Montar init scripts en `/docker-entrypoint-initdb.d/`.
- [ ] Actualizar `.env.example` con `POSTGRES_*`.
- [ ] Probar init limpio (volumen vacío) y segundo arranque (volumen con datos).
- [ ] Coordinar con DevOps el path EBS y el SG.
- [ ] Abrir PR a `main` (prioridad alta en el orden de integración).

## Orden recomendado de implementación

1. `schema.sql` alineado al contrato.
2. Servicio `db` + volumen en Compose.
3. Prueba local de init y persistencia.
4. Ajuste path EBS / notas para AWS con DevOps.
5. PR temprano para desbloquear al Backend.
