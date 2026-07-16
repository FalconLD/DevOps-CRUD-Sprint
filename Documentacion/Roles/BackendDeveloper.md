# Rol: Backend Developer

| Campo | Valor |
|-------|--------|
| Integrante | B |
| Rama Git | `feature/backend` |
| Documento de mapa | [../MapaGeneralDelProyecto.md](../MapaGeneralDelProyecto.md) |

## Objetivo principal

Desarrollar el microservicio API REST (FastAPI) que persiste y consulta visitantes en PostgreSQL, exponiendo `POST` y `GET` en `/api/visitantes`, con credenciales de base de datos leídas exclusivamente desde variables de entorno.

## Responsabilidades

- Implementar la API en la carpeta `backend/` con FastAPI.
- Exponer `POST /api/visitantes` (alta) y `GET /api/visitantes` (listado JSON).
- Conectar a PostgreSQL usando variables de entorno (sin secretos en código).
- Definir el servicio `backend` en `docker-compose.yml` (solo ese bloque) y su `Dockerfile`.
- Validar entrada (campos requeridos) y devolver códigos HTTP coherentes (p. ej. 201/200/400/500).
- Mantener el contrato JSON acordado en el mapa del proyecto.

## Alcance del trabajo

**Incluye**

- Código Python de la API, modelos/schemas, capa de acceso a datos.
- Dependencias (`requirements.txt` o equivalente) y Dockerfile.
- Healthcheck opcional del servicio backend (recomendado para Compose).

**Excluye**

- Diseño visual del frontend.
- Autoria de `schema.sql` (lo define DBA; el backend lo consume).
- Configuración de Nginx, GitHub Actions y secrets SSH.
- Publicar el puerto del backend al exterior (solo red interna + proxy Nginx).

## Módulos / carpetas permitidas

| Ruta | Permiso |
|------|---------|
| `backend/` | Crear y modificar libremente |
| `docker-compose.yml` → solo `services.backend` | Modificar |
| `.env.example` → claves de conexión usadas por la API | Puede proponer/añadir claves (coordinar con DBA/DevOps) |
| Resto del repo | Solo lectura / no editar |

## Archivos que probablemente creará o modificará

```text
backend/
  Dockerfile
  requirements.txt
  main.py                 # App FastAPI y rutas
  db.py                   # Conexión vía env
  models.py / schemas.py  # Pydantic / modelos
docker-compose.yml        # Únicamente el servicio backend
.env.example              # Claves DATABASE_URL / POSTGRES_* (coordinado)
```

## Dependencias con otros roles

| Depende de | Qué necesita | Cuándo |
|------------|--------------|--------|
| DBA / SRE | Tabla `visitantes` en `schema.sql`; host interno `db`; vars `POSTGRES_*` | Para pruebas de persistencia reales |
| DevOps | Proxy `/api/` → backend; red Compose; skeleton de servicios | Para E2E y producción |
| Frontend | Consumidor del contrato; no bloquea el desarrollo de la API | Pruebas con curl/httpie primero |

**Variables de entorno mínimas sugeridas**

- `POSTGRES_HOST` (típicamente `db`)
- `POSTGRES_PORT` (`5432`)
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`  
  o una sola `DATABASE_URL`.

## Riesgos y posibles conflictos de integración

| Riesgo | Mitigación |
|--------|------------|
| Credenciales en código o en commits | Solo env; usar `.env` local gitignored |
| Prefijo de ruta distinto de `/api/visitantes` | Alinear con Nginx (`location /api/`) y el mapa |
| Editar bloque `db` o `nginx` en Compose | Fuera de alcance; pedir al dueño |
| Divergencia con columnas de `schema.sql` | Revisar schema del DBA antes del PR final |
| Exponer `8000:8000` en producción | Evitar; solo debug local acordado |

## Entregables esperados

1. API FastAPI funcional con POST y GET.
2. Rama `feature/backend` con historial de commits propios.
3. Servicio Compose que arranca y habla con `db` en red interna.
4. PR a `main` tras validar contra Postgres del DBA.

## Criterios de aceptación

- [ ] `POST /api/visitantes` acepta JSON con nombre, correo y categoría; persiste en DB.
- [ ] `GET /api/visitantes` retorna JSON nativo (lista de registros).
- [ ] Ninguna credencial de DB está hardcodeada en el código fuente.
- [ ] El backend no necesita exponerse públicamente para la demo (funciona detrás de Nginx).
- [ ] Compatible con el `schema.sql` del DBA.
- [ ] Autoría Git clara en `feature/backend`.

## Checklist de tareas

- [ ] Crear rama `feature/backend` desde `main` actualizado.
- [ ] Scaffold FastAPI + requirements + Dockerfile.
- [ ] Definir schemas Pydantic alineados al contrato del mapa.
- [ ] Implementar conexión DB por variables de entorno.
- [ ] Implementar POST (insert) y GET (select).
- [ ] Completar solo el bloque `services.backend` en Compose.
- [ ] Probar con curl contra el contenedor (o vía Nginx).
- [ ] Verificar que un registro aparece tras reinicio solo si el volumen DBA está bien (prueba conjunta).
- [ ] Abrir PR y atender revisión.

## Orden recomendado de implementación

1. API “en memoria” o con respuesta fija para validar rutas (opcional, corto).
2. Conexión real a Postgres según contrato DBA.
3. POST + GET transaccionales.
4. Dockerfile + bloque Compose.
5. Prueba conjunta con DBA; luego PR (idealmente después del merge de `feature/database`).
