# Arquitectura despliegue

- Docker Hub: un repo por servicio (ej. usuario/front, usuario/back)
- docker-compose.prod.yml en la EC2 que define front y back
- GitHub Actions: build + push de cada imagen que haya cambiado, luego SSH a la EC2 para hacer pull y recrear los contenedores
- Nginx se instala en el servidor

## Flujo deploy

1. Push a main (o merge de PR) → dispara GitHub Actions
2. GitHub Actions construye la imagen Docker de la app
3. Subir imagen a Docker Hub
4. Se conecta por SSH a la EC2 y despliega el nuevo contenedor

## EC2

- Instalar Docker, Docker Compose y Nginx en la instancia.
- Configurar nginx como reverse proxy hacia tu app (por ejemplo, el contenedor de front expone el puerto 3000 y nginx hace proxy_pass desde el 443/80).
- Crear un usuario SSH dedicado para despliegues y genera un par de claves SSH específico para deploy.
- Guardar esa clave privada, el host, usuario y puerto SSH como secrets en GitHub (Settings → Secrets and variables → Actions).

## Estructura del repo

/front
/back
docker-compose.yml
docker-compose.prod.yml

## Dockerfile front Next.js

- Loguearse en el repo de Docker via terminal
  `docker login --username <username> --password <password>`
- Hacer build de la imagen
  `docker build -t <username>/<image_name>:<tag> -f Dockerfile .`
- Subir la imagen al repositorio
  `docker push <username>/<image_name>:<tag>`

```dockerfile
FROM node:24.14.1-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24.14.1-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

## Dockerfile básico express

```dockerfile
FROM node:24.14.1-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4000
CMD ["node", "src/index.js"]

```

## Ejemplo docker-compose.prod.yml

- En la instancia EC2, no en el repo
- Añadir servicios que sean necesarios (postgres, redis, etc)

```yml
services:
  back:
    image: gmoralrubio/back:latest
    container_name: test_back
    env_file:
      - ./.env.prod
    environment:
      NODE_ENV: production
      HOST: 0.0.0.0
    ports:
      - '127.0.0.1:4000:4000'
    restart: always
    networks:
      - app_net

  front:
    image: gmoralrubio/front:latest
    container_name: test_front
    environment:
      API_URL: http://back:4000
    ports:
      - '127.0.0.1:3000:3000'
    depends_on:
      - back
    restart: always
    networks:
      - app_net

networks:
  app_net:
    driver: bridge
```

## Configuracion nginx

```
server {
    listen 80;
    server_name dominio.com;
    # Sin barra final en proxy_pass: así se conserva el prefijo /api y la app recibe /api/...
    # Con barra (http://127.0.0.1:4000/) nginx quita /api y /api/health llegaría como /health (404).
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Github Action

### Declarar variables en el repo

- En Settings->Secrets and variables->Actions->New repository secret

### Añadir usuario a grupo 'docker'

- `sudo usermod -aG docker "$USER"`
- Cerrar sesión ssh y volver a entrar

```yml
name: Build & Deploy

# Push a main: construye solo lo que cambió y lo despliega en la EC2.
on:
  push:
    branches: [main]

jobs:
  # Marca qué partes del repo cambiaron. El resto de jobs lee estas salidas.
  changes:
    runs-on: ubuntu-latest
    outputs:
      front: ${{ steps.filter.outputs.front }}
      back: ${{ steps.filter.outputs.back }}
      compose: ${{ steps.filter.outputs.compose }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            front:
              - 'front/**'
            back:
              - 'back/**'
            compose:
              - 'docker-compose.prod.yml'

  # Publica el front. El login es para el push: una imagen pública igual exige autenticación.
  build-front:
    needs: changes
    if: needs.changes.outputs.front == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USER }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: ./front
          push: true
          tags: |
            gmoralrubio/test-front:latest
            gmoralrubio/test-front:${{ github.sha }}

  # Publica el back. Misma razón de login que en el front.
  build-back:
    needs: changes
    if: needs.changes.outputs.back == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USER }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: ./back
          push: true
          tags: |
            gmoralrubio/test-back:latest
            gmoralrubio/test-back:${{ github.sha }}

  # Copia el compose y levanta los contenedores.
  # Corre si algún build acabó bien, o si solo cambió el compose.
  # No corre si un build falló o si se canceló el workflow.
  deploy:
    needs: [changes, build-front, build-back]
    if: >-
      always() && !cancelled() &&
      needs.changes.result == 'success' &&
      needs.build-front.result != 'failure' &&
      needs.build-back.result != 'failure' &&
      (needs.build-front.result == 'success' || needs.build-back.result == 'success' || needs.changes.outputs.compose == 'true')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: mkdir -p /home/ubuntu/test
      # Solo el compose. .env.prod se queda en el servidor y no se sube desde el repo.
      - uses: appleboy/scp-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          source: docker-compose.prod.yml
          target: /home/ubuntu/test
          overwrite: true
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/test
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d
            docker image prune -f
```

## Abrir puertos 80 y 443 en EC2

## Generar certificados ssl en Nginx con Certbot

## Crear claves ssh para GitHub Actions

## Archivos .env

- `.env` -> mismo directorio que `docker-compose.prod.yml` (`/home/ubuntu/welldone/`)
  - Lo leen las interpolaciones `${}` del compose (servicio `postgres`)

  ```
  POSTGRES_USER=user
  POSTGRES_PASSWORD=password
  POSTGRES_DB=WelldoneApi
  ```

- `.env.back` -> se le pasa a los servicios `backend` y `migrate` vía `env_file` en `docker-compose.prod.yml`
  - Se inyecta como variables de entorno dentro del contenedor cuando arranca
  - Son las que valida `EnvironmentService`. `DATABASE_URL` apunta al servicio `postgres` y usa
    el mismo usuario/clave/BD que el `.env` de arriba. Maildev no va a producción, así que
    `MAILDEV_HOST`/`MAILDEV_PORT` se omiten (son opcionales).

  ```
  DATABASE_URL=postgresql://user:password@postgres:5432/WelldoneApi
  REDIS_URL=redis://redis:6379
  NODE_ENV=production
  PORT=4000
  JWT_SECRET=<secreto-largo-y-aleatorio>
  ```

> **Cuidado con el `$` en las contraseñas.** Docker Compose interpola `${VAR}` también en los
> `.env`, así que un `$` literal en una contraseña se interpreta como variable y se pierde (verás
> un aviso tipo `The "nJ" variable is not set`). Si la contraseña lleva `$`, escríbelo duplicado
> (`$$`) en el archivo; dentro del contenedor queda un solo `$`. Lo más simple es usar contraseñas
> sin `$` ni `@`. Esto aplica tanto a `POSTGRES_PASSWORD` en `.env` como a `DATABASE_URL` en
> `.env.back`, y ambas deben coincidir.

> **Las credenciales de Postgres solo se fijan al crear el volumen.** `POSTGRES_USER` y
> `POSTGRES_PASSWORD` solo tienen efecto la primera vez que `postgres_data` está vacío. Cambiarlas
> en el `.env` cuando el volumen ya existe no actualiza al usuario, y la migración fallará con
> `P1000: Authentication failed`. Para aplicar credenciales nuevas hay que recrear el volumen
> (ver "Empezar de cero").

## Notas deploy

- Secrets github (Settings -> Secrets and variables -> Actions):
  - DOCKERHUB_USER
  - DOCKERHUB_TOKEN
  - EC2_HOST
  - EC2_USER
  - EC2_SSH_KEY

### Preparación manual antes del primer deploy

Cosas que el workflow no puede hacer y hay que dejar listas una sola vez:

- Crear en Docker Hub los repos `404welldone/frontend` y `404welldone/backend`.
- En la EC2, dentro de `/home/ubuntu/welldone/`, crear a mano `.env` y `.env.back` (ver sección
  anterior). No se suben desde el repo; solo se copia `docker-compose.prod.yml`.
- Configurar Nginx con el `proxy_pass` de `/api/` sin barra final (ver sección nginx).
- Verificar que los cinco secrets de arriba existen en el repo de GitHub.

## Operación y troubleshooting

### Nombres de servicio vs contenedor

Los servicios `backend` y `frontend` tienen el mismo `container_name` que su nombre de servicio.
Los de infraestructura no: el servicio `postgres` crea el contenedor `welldone_postgres`, `redis`
crea `welldone_redis` y `migrate` crea `welldone_migrate`. Los comandos de Compose usan el nombre de
servicio; `docker ...` y la columna NAMES de `docker ps` usan el del contenedor.

```bash
docker compose -f docker-compose.prod.yml logs backend    # servicio
docker logs welldone_postgres                             # contenedor (nombre con prefijo)
```

Nota: si Compose responde `no such service: backend`, es que en la EC2 está el compose antiguo (el
que solo definía `front`). Asegúrate de que el `docker-compose.prod.yml` del servidor es el que
define `postgres`, `redis`, `migrate`, `backend` y `frontend`.

### El servicio `migrate`

`migrate` ejecuta `prisma migrate deploy` una sola vez y termina; es normal verlo en
`Exited (0)`. Tiene `restart: "no"`, así que no se relanza solo. El servicio `backend` depende de que
`migrate` salga con código 0, de modo que si la migración falla, `backend` ni siquiera se crea.

Reintentar la migración tras corregir el `.env.back`:

```bash
docker compose -f docker-compose.prod.yml rm -f migrate
docker compose -f docker-compose.prod.yml up -d --force-recreate migrate
docker compose -f docker-compose.prod.yml logs migrate
```

### Empezar de cero

Borra contenedores y el volumen de Postgres (se pierden los datos). Imágenes y `.env` se conservan:

```bash
docker compose -f docker-compose.prod.yml down -v --remove-orphans
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Al estar vacío el volumen, Postgres se inicializa con el `POSTGRES_USER`/`POSTGRES_PASSWORD`
actuales del `.env`.

### Estado esperado tras un deploy correcto

```bash
docker compose -f docker-compose.prod.yml ps -a
```

- `backend` y `frontend`: `Up` (backend además `(healthy)`).
- `welldone_postgres` y `welldone_redis`: `Up (healthy)`.
- `welldone_migrate`: `Exited (0)`.

### Cargar datos de ejemplo (seed)

El contenedor `migrate` solo aplica el esquema (`prisma migrate deploy`), no inserta datos. Para
cargar el usuario y artículo de ejemplo de `prisma/seed.ts` hay que lanzarlo a mano. `tsx` no está
en la imagen de producción, así que `npx` lo descarga en el momento:

```bash
docker compose -f docker-compose.prod.yml exec backend npx tsx prisma/seed.ts
```

Verificar que el artículo responde:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' \
  http://127.0.0.1:4000/api/articles/jdoe/el-renacimiento-de-la-arquitectura-de-software-patrones
```

Un `200` indica que el seed cargó y la URL pública ya muestra el artículo.
