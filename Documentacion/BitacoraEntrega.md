# Bitacora de entrega DevOps

## Resumen ejecutivo

El proyecto **DevOps CRUD Sprint** quedo desplegado en AWS EC2 y validado con CI/CD, Nginx como API Gateway, FastAPI, PostgreSQL persistente y frontend estatico.

| Elemento | Valor |
|----------|-------|
| Repositorio | https://github.com/FalconLD/DevOps-CRUD-Sprint |
| URL publica | http://18.227.61.88 |
| Health check | http://18.227.61.88/api/health |
| Servidor | AWS EC2 Ubuntu 24.04 |
| Ruta de deploy | `/opt/devops-crud-sprint` |
| Ruta de datos Postgres | `/opt/devops-crud-data` |
| Workflow verde | https://github.com/FalconLD/DevOps-CRUD-Sprint/actions/runs/29522465118 |

## Orden de integracion

| Orden | PR | Rama | Titulo | Merge |
|-------|----|------|--------|-------|
| 1 | [#1](https://github.com/FalconLD/DevOps-CRUD-Sprint/pull/1) | `feature/devops` | `feat(devops): skeleton Compose, Nginx y CI/CD` | 2026-07-16 03:47 UTC |
| 2 | [#2](https://github.com/FalconLD/DevOps-CRUD-Sprint/pull/2) | `jb_001` | `Add frontend visitor registration UI` | 2026-07-16 04:17 UTC |
| 3 | [#3](https://github.com/FalconLD/DevOps-CRUD-Sprint/pull/3) | `feature/backend` | `feat(backend): Implementacion de endpoints de visitantes` | 2026-07-16 04:19 UTC |
| 4 | [#4](https://github.com/FalconLD/DevOps-CRUD-Sprint/pull/4) | `feature/database` | `feat(database): configurar postgres persistente y aislado` | 2026-07-16 04:54 UTC |

## CI/CD

Se configuraron los GitHub Secrets necesarios:

- `SSH_PRIVATE_KEY`
- `SERVER_IP`
- `SERVER_USER`
- `DEPLOY_PATH`

El workflow `Deploy to AWS EC2` fue ejecutado manualmente con `workflow_dispatch` desde `main`.

Resultado:

```text
Run: 29522465118
Estado: completed
Conclusion: success
Evento: workflow_dispatch
Rama: main
URL: https://github.com/FalconLD/DevOps-CRUD-Sprint/actions/runs/29522465118
```

Durante la primera ejecucion, `rsync` fallo al intentar sincronizar el directorio `postgres_data` dentro del path de deploy. Para corregirlo sin modificar el workflow ni hacer push, la persistencia fue movida fuera del arbol sincronizado:

```text
POSTGRES_DATA_PATH=/opt/devops-crud-data
```

Con esto, el deploy automatico quedo estable y el directorio de datos ya no interfiere con `rsync --delete`.

## Estado de contenedores en EC2

Comando ejecutado:

```bash
cd /opt/devops-crud-sprint
docker compose ps
```

Resultado verificado:

```text
NAME           IMAGE                         SERVICE    STATUS                   PORTS
cci-backend    devops-crud-sprint-backend    backend    Up (healthy)             8000/tcp
cci-db         postgres:16-alpine            db         Up (healthy)             5432/tcp
cci-frontend   devops-crud-sprint-frontend   frontend   Up                       80/tcp
cci-nginx      nginx:1.27-alpine             nginx      Up                       0.0.0.0:80->80/tcp
```

## Validacion publica

Endpoint verificado:

```text
GET http://18.227.61.88/api/health
```

Respuesta:

```json
{"status":"ok"}
```

## Security Group

Validacion externa de puertos:

| Puerto | Resultado | Estado esperado |
|--------|-----------|-----------------|
| 80/tcp | Abierto | Correcto: acceso HTTP publico |
| 22/tcp | Abierto | Correcto temporalmente: requerido por GitHub Actions SSH |
| 5432/tcp | Cerrado | Correcto: Postgres no expuesto publicamente |

Nota: el puerto 22 queda abierto durante la entrega para permitir deploy desde runners dinamicos de GitHub Actions. Despues de la evaluacion, puede restringirse a IPs administradas o reemplazarse por un mecanismo de despliegue mas controlado.

## Chaos test de persistencia

Objetivo: validar que los datos sobreviven a la recreacion del contenedor `cci-db`.

Procedimiento:

1. Insertar visitante temporal via API publica.
2. Detener y eliminar el contenedor `cci-db`.
3. Recrear `cci-db` con `docker compose up -d db`.
4. Esperar estado healthy.
5. Confirmar el registro desde Postgres y desde la API publica.
6. Eliminar el registro temporal para dejar la base limpia.

Registro temporal:

```text
correo: chaos-20260716130756@puce.edu.ec
```

Evidencia directa en Postgres tras recrear el contenedor:

```text
id | nombre     | correo                           | categoria_entrada
---+------------+----------------------------------+------------------
1  | Chaos Test | chaos-20260716130756@puce.edu.ec | General
```

Evidencia via API publica tras recrear el contenedor:

```json
{
  "id": 1,
  "nombre": "Chaos Test",
  "correo": "chaos-20260716130756@puce.edu.ec",
  "categoria_entrada": "General",
  "creado_en": "2026-07-16T18:07:57.377189Z"
}
```

Resultado:

```text
PERSISTENCE_OK
```

Limpieza:

```text
DELETE 1
Visitantes actuales: 0
```

## Extensión CRUD completo (Update + Delete)

Tras el despliegue inicial (solo Create/Read), se completó el CRUD:

| Método | Ruta | Uso |
|--------|------|-----|
| `PUT` | `/api/visitantes/{id}` | Actualizar visitante |
| `DELETE` | `/api/visitantes/{id}` | Eliminar visitante |

Frontend: columna Acciones (Editar / Eliminar) y modo edición en el formulario.
Despliegue: vía merge a `main` + GitHub Actions (mismo pipeline ya validado).

## Estado final

- Aplicacion accesible en `http://18.227.61.88`.
- CI/CD en verde.
- Contenedores corriendo en EC2.
- Postgres persistente fuera del arbol sincronizado por Actions.
- Puerto 5432 cerrado externamente.
- Chaos test aprobado.
- CRUD completo (POST, GET, PUT, DELETE) implementado en codigo local; pendiente merge/deploy segun politica Git del equipo.
- No se ejecutaron commits ni pushes automaticos como parte de esta bitacora.
