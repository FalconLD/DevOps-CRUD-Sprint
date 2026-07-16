# Rol: Frontend Engineer

| Campo | Valor |
|-------|--------|
| Integrante | A |
| Rama Git | `feature/frontend` |
| Documento de mapa | [../MapaGeneralDelProyecto.md](../MapaGeneralDelProyecto.md) |

## Objetivo principal

Entregar la interfaz web del Módulo de Registro de Visitantes: formulario de alta y tabla dinámica de confirmados, comunicándose exclusivamente con la API pública relativa `/api/visitantes` mediante Fetch/Ajax.

## Responsabilidades

- Diseñar e implementar el formulario (Nombre, Correo, Categoría de Entrada).
- Implementar la tabla dinámica que liste visitantes confirmados.
- Enviar altas con `POST /api/visitantes` y recargar listado con `GET /api/visitantes`.
- Usar solo rutas relativas (sin IPs, hosts ni puertos hardcodeados en el JavaScript).
- Definir el servicio `frontend` en `docker-compose.yml` (solo ese bloque) y el `Dockerfile`/`nginx` estático interno si aplica.
- Asegurar que la UI sea usable en escritorio y móvil básico para la auditoría en aula.

## Alcance del trabajo

**Incluye**

- Todo el código bajo `frontend/`.
- Estilos e interacción del lado del cliente.
- Manejo básico de errores de red/API visibles al usuario (mensaje claro si falla el POST/GET).

**Excluye**

- Lógica de negocio en el servidor, SQL, Nginx perimetral, workflows CI/CD, secretos AWS.
- Exponer el frontend directamente en un puerto público distinto del 80 (Nginx es el perímetro).

## Módulos / carpetas permitidas

| Ruta | Permiso |
|------|---------|
| `frontend/` | Crear y modificar libremente |
| `docker-compose.yml` → solo `services.frontend` | Modificar |
| Resto del repo | Solo lectura / no editar |

## Archivos que probablemente creará o modificará

```text
frontend/
  index.html          # Formulario + contenedor de tabla
  css/styles.css      # Estilos (opcional pero recomendado)
  js/app.js           # Fetch POST/GET y render de tabla
  Dockerfile          # Imagen que sirve estáticos (o base nginx alpine)
docker-compose.yml    # Únicamente el servicio frontend
```

## Dependencias con otros roles

| Depende de | Qué necesita | Cuándo |
|------------|--------------|--------|
| Backend | Contrato JSON y endpoints `POST`/`GET /api/visitantes` | Para integración real; puede mockear localmente al inicio |
| DevOps | Nginx sirviendo `/` → frontend y `/api/` → backend | Para E2E en Compose / AWS |
| DBA | Indirecta: datos reales tras persistencia | Para demo de lista con registros persistidos |

**Contrato que debe respetar (no renegociar solo):** ver sección de contrato en el mapa general.

## Riesgos y posibles conflictos de integración

| Riesgo | Mitigación |
|--------|------------|
| Hardcodear `http://IP:puerto` en JS | Usar siempre `/api/visitantes` |
| CORS al probar el HTML abriendo archivo local | Probar solo vía Nginx/Compose, no `file://` |
| Editar `nginx.conf` o el bloque backend en Compose | Queda fuera de alcance; abrir issue/PR al dueño |
| Cambiar forma del JSON sin avisar | Acordar cambio con Backend y actualizar el mapa |

## Entregables esperados

1. UI funcional de registro y listado.
2. Código en rama `feature/frontend` con commits propios.
3. PR hacia `main` cuando el contrato y Nginx permitan prueba E2E.
4. Evidencia breve (captura o GIF) del formulario insertando y la tabla actualizando.

## Criterios de aceptación

- [ ] El formulario captura nombre, correo y categoría de entrada.
- [ ] Al enviar, se realiza `POST /api/visitantes` con JSON válido.
- [ ] La tabla se alimenta con `GET /api/visitantes` y se puede recargar tras un alta.
- [ ] No existen IPs ni hosts fijos en el JavaScript de llamadas API.
- [ ] El servicio `frontend` arranca en Compose sin publicar un puerto que bypassée Nginx (salvo acuerdo DevOps para debug temporal).
- [ ] Autoría Git clara en la rama `feature/frontend` (sin commits ajenos en archivos de otras capas).

## Checklist de tareas

- [ ] Crear rama `feature/frontend` desde `main` actualizado.
- [ ] Scaffold `frontend/index.html` + JS + CSS.
- [ ] Implementar submit del formulario con Fetch POST.
- [ ] Implementar carga/recarga de tabla con Fetch GET.
- [ ] Añadir feedback de éxito/error en UI.
- [ ] Añadir `Dockerfile` del frontend.
- [ ] Completar solo el bloque `services.frontend` en Compose.
- [ ] Probar contra API (mock o backend real detrás de Nginx).
- [ ] Abrir PR y responder comentarios de revisión.

## Orden recomendado de implementación

1. Maquetar HTML del formulario y tabla (sin API).
2. Cablear Fetch contra `/api/visitantes` (asumiendo contrato del mapa).
3. Empaquetar con Dockerfile y servicio Compose.
4. Validar E2E con Nginx + Backend cuando estén disponibles.
5. Abrir PR a `main` (idealmente después del merge de backend; ver [PlanDeTrabajo.md](../PlanDeTrabajo.md)).
