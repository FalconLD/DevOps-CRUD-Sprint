TALLER GRUPAL: DevOps CRUD Sprint (Startup Collaboration)
Curso: Computación en la Nube y Orquestación de Entornos Virtuales

Metodología: Aprendizaje Basado en Proyectos (PBL) y Startups de Células de Desarrollo

EL CASO DE ESTUDIO: Registro del Centro Cultural Inteligente

La junta directiva del Centro Cultural Inteligente ha solicitado implementar con carácter de urgencia el Módulo de Registro de Visitantes. Este sistema debe permitir que los usuarios se registren en línea para los eventos especiales del centro (Nombre, Correo, Categoría de Entrada) y que el personal de recepción consulte la lista de confirmados en tiempo real.

Para garantizar la seguridad del núcleo operativo, la base de datos debe permanecer aislada del exterior (Hardening), los datos deben ser inmutables (Persistencia física en AWS EBS) y todo el clúster debe desplegarse de manera automática mediante un pipeline de GitHub Actions cada vez que se consoliden cambios.

INSTRUCCIONES PASO A PASO (Flujo de Trabajo)
Constitución de la Startup: Reúnanse con su equipo asignado. Creen un único repositorio en GitHub para el grupo. Todos los miembros deben ser agregados como colaboradores.
División de Roles: Repártanse los roles de desarrollo y arquitectura de forma equitativa. Recuerden que Git registrará la autoría e historial de cambios de cada integrante de forma milimétrica.
Trabajo sobre Ramas específicas: Queda estrictamente prohibido programar directamente sobre la rama principal. Cada integrante creará y subirá su código sobre su respectiva rama (ej: feature/frontend, feature/backend).
Integración y Pull Requests: Realicen la fusión de ramas hacia main únicamente mediante Pull Requests en GitHub. El DevOps del grupo coordinará la resolución de conflictos de fusión (merge conflicts) en equipo.
Despliegue Automático (Banda Transportadora): Al fusionar en la rama main, el robot de GitHub Actions debe despertarse, validar la sintaxis de la infraestructura, conectarse por SSH a la instancia EC2 de AWS del grupo y desplegar el CRUD actualizado de forma autónoma.
DIVISIÓN DE ROLES (Entregables por Integrante)
Cada estudiante es responsable exclusivo de la estabilidad de su capa. El código final debe estar acoplado, integrado y funcional.

Integrante A: Frontend Engineer (Rama: feature/frontend)
Diseña el formulario de registro y la tabla dinámica en HTML moderno.
Implementa el envío de datos del formulario y la recarga de la tabla mediante Fetch API / Ajax en JavaScript.
Consume los endpoints realizando llamadas transparentes a la ruta local /api/visitantes (sin quemar IPs fijas en el JS).
Integrante B: Backend Developer (Rama: feature/backend)
Desarrolla el API REST transaccional en un microservicio en la carpeta backend (FastAPI, Flask o Express).
Expone el endpoint POST /api/visitantes para recibir el JSON de entrada y guardarlo en la base de datos.
Expone el endpoint GET /api/visitantes retornando los registros guardados en estructura JSON nativa.
Lee las credenciales de conexión de la base de datos mediante variables de entorno (no quemadas en el código).
Integrante C: Database Administrator y SRE (Rama: feature/database)
Configura el motor relacional PostgreSQL en el archivo docker-compose.yml.
Asigna volúmenes físicos de datos en el host de AWS EBS para garantizar la persistencia de las transacciones.
Diseña el esquema SQL inicial (schema.sql) para levantar las tablas de forma automática al encender el contenedor por primera vez.
Hardening de Red: Aísla la base de datos cerrando el puerto 5432 de accesos públicos externos.
Integrante D: DevOps Architect (Rama: main / coordinación)
Configura el proxy inverso nginx.conf (API Gateway) en el puerto 80 sirviendo el Frontend e integrando las rutas del Backend.
Programa el workflow de GitHub Actions (deploy.yml) estructurando el linter de Compose y los accesos SSH seguros.
Administra los secretos criptográficos en GitHub Secrets (SERVER_IP, SERVER_USER, SSH_PRIVATE_KEY).
Coordina la fusión de cambios resolviendo colisiones en Git.
FORMATO DE ENTREGA (Por el DevOps del equipo)
El líder DevOps de la Startup subirá en este espacio un único documento PDF consolidado que contenga:

Enlace del Repositorio de GitHub: Debe evidenciar los aportes balanceados de los 4 integrantes en el panel de commits y ramas fusionadas.
IP Pública activa de AWS: URL de producción lista para testing en caliente (ej: http://TU_IP_AWS).
Bitácora del Despliegue: Evidencias (capturas) de la luz verde en GitHub Actions, el comando 'docker compose ps' corriendo en AWS y la respuesta de logs.
EXAMEN DE AUDITORÍA EN CALIENTE (Evaluación en el Aula)
Durante la sesión presencial de laboratorio, cada Startup defenderá su infraestructura ante el proyector. Someteremos el clúster a tres pruebas de penetración y caos:

Git Trace: Auditoría visual del panel de colaboración e historial de ramas de desarrollo en GitHub. No se aceptarán commits directos a main ni autorías ficticias.
Testing del CRUD: Realizaremos inserciones masivas y concurrentes de datos en su formulario para verificar que la comunicación Frontend-Backend no sufra degradación.
Chaos Engineering Test: Detendremos la infraestructura con 'docker compose down' e intentaremos vulnerar la base de datos escanando el puerto 5432 externamente (debe dar Timeout). Al iniciar nuevamente el clúster, los registros ingresados previamente deben persistir de manera íntegra, comprobando el volumen elástico de AWS.
RÚBRICA DE EVALUACIÓN MULTICAPA (Puntaje Máximo: 10.0 Puntos)
Criterio Técnico	Evidencias de la Auditoría	Puntaje
1. Sincronización y Git Flow	Historial de GitHub con ramas de desarrollo lícitas (feature/) unificadas sin commits directos de autoría compartida y pull requests limpios.	2.5 Pts
2. Persistencia y Hardening	Postgres configurado en red privada (puerto 5432 cerrado al mundo) con datos persistiendo correctamente tras el desmantelamiento total del contenedor en caliente.	2.5 Pts
3. Integración en API Gateway	Nginx actuando como ruteador central perimetral (puerto 80) sirviendo el Frontend e intercomunicando llamadas JSON cruzadas estables del CRUD.	2.5 Pts
4. Automatización CI/CD	Historial de compilación en GitHub Actions con Luz Verde. Demostración práctica de actualización en producción con un único git push.	2.5 Pts
TALLER GRUPAL: DevOps CRUD Sprint (Startup Collaboration)
Curso: Computación en la Nube y Orquestación de Entornos Virtuales

Metodología: Aprendizaje Basado en Proyectos (PBL) y Startups de Células de Desarrollo

EL CASO DE ESTUDIO: Registro del Centro Cultural Inteligente

La junta directiva del Centro Cultural Inteligente ha solicitado implementar con carácter de urgencia el Módulo de Registro de Visitantes. Este sistema debe permitir que los usuarios se registren en línea para los eventos especiales del centro (Nombre, Correo, Categoría de Entrada) y que el personal de recepción consulte la lista de confirmados en tiempo real.

Para garantizar la seguridad del núcleo operativo, la base de datos debe permanecer aislada del exterior (Hardening), los datos deben ser inmutables (Persistencia física en AWS EBS) y todo el clúster debe desplegarse de manera automática mediante un pipeline de GitHub Actions cada vez que se consoliden cambios.

INSTRUCCIONES PASO A PASO (Flujo de Trabajo)
Constitución de la Startup: Reúnanse con su equipo asignado. Creen un único repositorio en GitHub para el grupo. Todos los miembros deben ser agregados como colaboradores.
División de Roles: Repártanse los roles de desarrollo y arquitectura de forma equitativa. Recuerden que Git registrará la autoría e historial de cambios de cada integrante de forma milimétrica.
Trabajo sobre Ramas específicas: Queda estrictamente prohibido programar directamente sobre la rama principal. Cada integrante creará y subirá su código sobre su respectiva rama (ej: feature/frontend, feature/backend).
Integración y Pull Requests: Realicen la fusión de ramas hacia main únicamente mediante Pull Requests en GitHub. El DevOps del grupo coordinará la resolución de conflictos de fusión (merge conflicts) en equipo.
Despliegue Automático (Banda Transportadora): Al fusionar en la rama main, el robot de GitHub Actions debe despertarse, validar la sintaxis de la infraestructura, conectarse por SSH a la instancia EC2 de AWS del grupo y desplegar el CRUD actualizado de forma autónoma.
DIVISIÓN DE ROLES (Entregables por Integrante)
Cada estudiante es responsable exclusivo de la estabilidad de su capa. El código final debe estar acoplado, integrado y funcional.

Integrante A: Frontend Engineer (Rama: feature/frontend)
Diseña el formulario de registro y la tabla dinámica en HTML moderno.
Implementa el envío de datos del formulario y la recarga de la tabla mediante Fetch API / Ajax en JavaScript.
Consume los endpoints realizando llamadas transparentes a la ruta local /api/visitantes (sin quemar IPs fijas en el JS).
Integrante B: Backend Developer (Rama: feature/backend)
Desarrolla el API REST transaccional en un microservicio en la carpeta backend (FastAPI, Flask o Express).
Expone el endpoint POST /api/visitantes para recibir el JSON de entrada y guardarlo en la base de datos.
Expone el endpoint GET /api/visitantes retornando los registros guardados en estructura JSON nativa.
Lee las credenciales de conexión de la base de datos mediante variables de entorno (no quemadas en el código).
Integrante C: Database Administrator y SRE (Rama: feature/database)
Configura el motor relacional PostgreSQL en el archivo docker-compose.yml.
Asigna volúmenes físicos de datos en el host de AWS EBS para garantizar la persistencia de las transacciones.
Diseña el esquema SQL inicial (schema.sql) para levantar las tablas de forma automática al encender el contenedor por primera vez.
Hardening de Red: Aísla la base de datos cerrando el puerto 5432 de accesos públicos externos.
Integrante D: DevOps Architect (Rama: main / coordinación)
Configura el proxy inverso nginx.conf (API Gateway) en el puerto 80 sirviendo el Frontend e integrando las rutas del Backend.
Programa el workflow de GitHub Actions (deploy.yml) estructurando el linter de Compose y los accesos SSH seguros.
Administra los secretos criptográficos en GitHub Secrets (SERVER_IP, SERVER_USER, SSH_PRIVATE_KEY).
Coordina la fusión de cambios resolviendo colisiones en Git.
FORMATO DE ENTREGA (Por el DevOps del equipo)
El líder DevOps de la Startup subirá en este espacio un único documento PDF consolidado que contenga:

Enlace del Repositorio de GitHub: Debe evidenciar los aportes balanceados de los 4 integrantes en el panel de commits y ramas fusionadas.
IP Pública activa de AWS: URL de producción lista para testing en caliente (ej: http://TU_IP_AWS).
Bitácora del Despliegue: Evidencias (capturas) de la luz verde en GitHub Actions, el comando 'docker compose ps' corriendo en AWS y la respuesta de logs.
EXAMEN DE AUDITORÍA EN CALIENTE (Evaluación en el Aula)
Durante la sesión presencial de laboratorio, cada Startup defenderá su infraestructura ante el proyector. Someteremos el clúster a tres pruebas de penetración y caos:

Git Trace: Auditoría visual del panel de colaboración e historial de ramas de desarrollo en GitHub. No se aceptarán commits directos a main ni autorías ficticias.
Testing del CRUD: Realizaremos inserciones masivas y concurrentes de datos en su formulario para verificar que la comunicación Frontend-Backend no sufra degradación.
Chaos Engineering Test: Detendremos la infraestructura con 'docker compose down' e intentaremos vulnerar la base de datos escanando el puerto 5432 externamente (debe dar Timeout). Al iniciar nuevamente el clúster, los registros ingresados previamente deben persistir de manera íntegra, comprobando el volumen elástico de AWS.
RÚBRICA DE EVALUACIÓN MULTICAPA (Puntaje Máximo: 10.0 Puntos)
Criterio Técnico	Evidencias de la Auditoría	Puntaje
1. Sincronización y Git Flow	Historial de GitHub con ramas de desarrollo lícitas (feature/) unificadas sin commits directos de autoría compartida y pull requests limpios.	2.5 Pts
2. Persistencia y Hardening	Postgres configurado en red privada (puerto 5432 cerrado al mundo) con datos persistiendo correctamente tras el desmantelamiento total del contenedor en caliente.	2.5 Pts
3. Integración en API Gateway	Nginx actuando como ruteador central perimetral (puerto 80) sirviendo el Frontend e intercomunicando llamadas JSON cruzadas estables del CRUD.	2.5 Pts
4. Automatización CI/CD	Historial de compilación en GitHub Actions con Luz Verde. Demostración práctica de actualización en producción con un único git push.	2.5 Pts
