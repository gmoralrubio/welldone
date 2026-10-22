# WellDone — Práctica final KeepCoding Web Development Bootcamp

Red de blogging al estilo Medium. La web pública (Next.js) sirve artículos, perfiles y comentarios en español e inglés. La API REST (Express) gestiona usuarios, artículos, comentarios y favoritos, con recuperación de contraseña por email.

## Requisitos

- Node.js v24+ (ver `.nvmrc`)
- Docker + docker compose

## Instalación

El repositorio tiene dos aplicaciones: `backend/` (API, puerto `3001`) y `frontend/` (web, puerto `3000`).

```bash
# 1. API: instalar dependencias
cd backend
npm install
# 2. Variables de entorno
cp .env.example .env
# 3. Levantar PostgreSQL, pgAdmin y MailDev
docker compose up -d
# 4. Generar el cliente de Prisma y ejecutar las migraciones
npm run prisma:sync
# 5. Seed de datos de prueba
npm run prisma:seed
# 6. Arrancar la API en modo desarrollo (con live reload)
npm run dev
```

En otra terminal:

```bash
# 7. Web: instalar dependencias
cd frontend
npm install
# 8. Variables de entorno
printf 'API_URL=http://localhost:3001\n' > .env.local
# 9. Arrancar la web
npm run dev
```

La web queda en <http://localhost:3000> y la API en <http://localhost:3001>.

## Infraestructura (Docker)

El archivo `backend/docker-compose.yml` levanta los siguientes servicios:

| Servicio      | Imagen           | Puerto         | Descripción                    |
| ------------- | ---------------- | -------------- | ------------------------------ |
| PostgreSQL 16 | `postgres:16`    | `5432`         | Base de datos                  |
| pgAdmin       | `dpage/pgadmin4` | `8081`         | Interfaz gráfica para Postgres |
| MailDev       | `maildev/maildev`| `1080`, `1025` | Servidor SMTP de desarrollo    |

Credenciales de pgAdmin (las de `.env.example`): `admin@admin.com` / `admin123`

Los emails enviados en local pueden visualizarse en <http://localhost:1080>.

## Variables de entorno

### Backend (`backend/.env`)

| Variable         | Descripción                                        | Ejemplo                                                  |
| ---------------- | -------------------------------------------------- | -------------------------------------------------------- |
| `DATABASE_URL`   | Cadena de conexión de PostgreSQL                   | `postgresql://admin:admin123@localhost:5432/WelldoneApi` |
| `JWT_SECRET`     | Clave secreta para firmar JWTs                     | `cambia-esto-por-un-secreto-largo-y-aleatorio`           |
| `NODE_ENV`       | Entorno (`local`, `staging`, `production`, `test`) | `local`                                                  |
| `PORT`           | Puerto del servidor HTTP                           | `3001`                                                   |
| `FRONTEND_URL`   | Origen de la web, usado en el enlace de reset      | `http://localhost:3000`                                  |
| `MAILDEV_HOST`   | Host del servidor SMTP (MailDev). Solo local       | `localhost`                                              |
| `MAILDEV_PORT`   | Puerto del servidor SMTP. Solo local               | `1025`                                                   |
| `SMTP_HOST`      | Host SMTP de producción                            | `smtp.gmail.com`                                         |
| `SMTP_PORT`      | Puerto SMTP de producción                          | `465`                                                    |
| `SMTP_SECURE`    | TLS en el SMTP de producción (`true` o `false`)    | `true`                                                   |
| `SMTP_USER`      | Usuario SMTP. Obligatorio en `production`          |                                                          |
| `SMTP_PASS`      | Contraseña de aplicación. Obligatorio en `production` |                                                       |
| `MAIL_FROM`      | Remitente visible. Obligatorio en `production`     | `WellDone <no-reply@gmail.com>`                          |

`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `PGADMIN_EMAIL` y `PGADMIN_PASSWORD` las consume Docker Compose. No las lee la API.

### Frontend (`frontend/.env.local`)

| Variable  | Descripción                         | Ejemplo                   |
| --------- | ----------------------------------- | ------------------------- |
| `API_URL` | Origen de la API, sin barra final   | `http://localhost:3001`   |

## Scripts

### Backend

| Script                 | Descripción                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Arranca en modo desarrollo con hot reload         |
| `npm start`            | Arranca el build de `dist/`                       |
| `npm run build`        | Genera Prisma, compila TypeScript y resuelve alias |
| `npm test`             | Ejecuta tests (Jest)                              |
| `npm run typecheck`    | Chequeo de tipos (tsc --noEmit)                   |
| `npm run lint`         | ESLint sobre `src/`                               |
| `npm run prettier`     | Verifica formato con Prettier                     |
| `npm run prisma:sync`  | Ejecuta migraciones pendientes                    |
| `npm run prisma:seed`  | Puebla la base de datos con datos de prueba       |
| `npm run prisma:reset` | Reinicia la base de datos (borra todos los datos) |

### Frontend

| Script            | Descripción                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Arranca Next.js en modo desarrollo   |
| `npm run build`   | Compila la aplicación                |
| `npm start`       | Sirve el build de producción         |
| `npm run lint`    | ESLint                               |
| `npm run typecheck` | Chequeo de tipos (tsc --noEmit)    |

## Endpoints

La API cuelga de `/api`. Las rutas marcadas con Auth exigen `Authorization: Bearer <token>`.

### Salud

| Método | Ruta          | Descripción        | Auth |
| ------ | ------------- | ------------------ | ---- |
| GET    | `/api/health` | Comprueba que la API responde | No   |

### Usuarios

| Método | Ruta                         | Descripción                              | Auth |
| ------ | ---------------------------- | ---------------------------------------- | ---- |
| POST   | `/api/users/register`        | Registrar usuario                        | No   |
| POST   | `/api/users/login`           | Iniciar sesión con email o username y obtener JWT | No |
| GET    | `/api/users/availability`    | Comprobar si email o username están libres | No |
| GET    | `/api/users/me`              | Perfil del usuario autenticado           | Sí   |
| PATCH  | `/api/users/me`              | Actualizar perfil                        | Sí   |
| DELETE | `/api/users/me`              | Eliminar la cuenta y sus datos           | Sí   |
| GET    | `/api/users/profile/:username` | Perfil público                         | No   |
| POST   | `/api/users/forgot-password` | Enviar enlace de recuperación            | No   |
| POST   | `/api/users/reset-password`  | Establecer una contraseña nueva          | No   |

`GET /api/users/availability` recibe `field` (`email` o `username`) y `value`.

El login acepta email o username en `identifier`. Una credencial incorrecta responde siempre igual, sin indicar cuál de los dos falló. Hay límite de intentos durante 15 minutos: 10 logins fallidos por IP, 5 contraseñas fallidas por cuenta, 5 solicitudes de recuperación y 10 restablecimientos. El username tiene entre 3 y 20 caracteres y solo admite letras, números, puntos y guiones bajos.

### Artículos

| Método | Ruta                                          | Descripción                                      | Auth |
| ------ | --------------------------------------------- | ------------------------------------------------ | ---- |
| GET    | `/api/articles`                               | Listar artículos publicados                      | No   |
| POST   | `/api/articles`                               | Crear artículo                                   | Sí   |
| GET    | `/api/articles/me`                            | Listar mis artículos (borrador y publicados)     | Sí   |
| GET    | `/api/articles/me/favorites`                  | Listar mis favoritos                             | Sí   |
| GET    | `/api/articles/me/:slug`                      | Ver un artículo propio, incluido borrador        | Sí   |
| GET    | `/api/articles/:authorUsername/:slug`         | Detalle público de un artículo                   | No   |
| PATCH  | `/api/articles/:authorUsername/:slug`         | Actualizar artículo propio                       | Sí   |
| DELETE | `/api/articles/:authorUsername/:slug`         | Eliminar artículo propio                         | Sí   |
| GET    | `/api/articles/:authorUsername/:slug/comments`| Listar comentarios                               | No   |
| POST   | `/api/articles/:authorUsername/:slug/comments`| Crear comentario o respuesta                     | Sí   |
| POST   | `/api/articles/:authorUsername/:slug/favorites` | Marcar favorito                                | Sí   |
| DELETE | `/api/articles/:authorUsername/:slug/favorites` | Quitar favorito                                | Sí   |

Parámetros de consulta de `GET /api/articles` y `GET /api/articles/me`:

| Parámetro        | Descripción                                      | Ejemplo                    |
| ---------------- | ------------------------------------------------ | -------------------------- |
| `page`           | Número de página                                 | `?page=2`                  |
| `limit`          | Artículos por página (por defecto 6, máximo 12)  | `?limit=10`                |
| `search`         | Búsqueda por texto (mínimo 3 caracteres)         | `?search=arquitectura`     |
| `category`       | Slug de categoría                                | `?category=desarrollo-web` |
| `order`          | Orden por fecha (`asc` o `desc`, por defecto `desc`) | `?order=asc`           |
| `authorUsername` | Filtrar por autor. Solo en el listado público    | `?authorUsername=jdoe`     |
| `status`         | `PUBLISHED` o `DRAFT`. Solo en `/me`             | `?status=DRAFT`            |

El listado público omite borradores y artículos con `publishedAt` en el futuro.

`GET .../comments` acepta `page` y `limit` (por defecto 5, máximo 20).

Categorías: `desarrollo-web`, `arquitectura-de-software`, `diseno-ux-ui`, `devops`, `inteligencia-artificial`, `ciberseguridad`.

## Web

Las páginas viven bajo el locale (`/es` o `/en`; el idioma por defecto es español).

| Ruta                                      | Descripción                          |
| ----------------------------------------- | ------------------------------------ |
| `/{locale}`                               | Portada                              |
| `/{locale}/articles`                      | Catálogo de artículos publicados     |
| `/{locale}/articles/{username}`           | Artículos de un autor                |
| `/{locale}/articles/{username}/{slug}`    | Detalle, comentarios y favoritos     |
| `/{locale}/login`                         | Inicio de sesión                     |
| `/{locale}/register`                      | Alta                                 |
| `/{locale}/forgot-password`               | Solicitar recuperación               |
| `/{locale}/reset-password`                | Nueva contraseña                     |
| `/{locale}/dashboard`                     | Área privada                         |
| `/{locale}/dashboard/create`              | Redactar artículo                    |
| `/{locale}/dashboard/edit/{slug}`         | Editar artículo propio               |
| `/{locale}/dashboard/favorites`           | Favoritos                            |
| `/{locale}/dashboard/settings`            | Cuenta, perfil y baja                |

## Usuarios de prueba

El seed genera dos usuarios con la contraseña `Seed1234!`:

| Email              | Usuario | Contraseña  |
| ------------------ | ------- | ----------- |
| `john@example.com` | `jdoe`  | `Seed1234!` |
| `ana@example.com`  | `aruiz` | `Seed1234!` |

También crea las seis categorías, artículos de ambos autores (publicados, borradores y alguno con fecha futura) y comentarios de ejemplo, incluido un hilo con respuesta.

## Arquitectura

El backend sigue Clean Architecture con tres capas:

```
domain/         → Entidades, casos de uso, interfaces
infrastructure/ → Adaptadores concretos (Prisma, Nodemailer)
ui/             → Controladores, rutas, validadores, middleware
```

- **Validación**: Zod v4 sobre los inputs HTTP antes de llegar a los casos de uso
- **Contenido**: el HTML de artículos y la bio se sanean antes de persistirse
- **Errores**: jerarquía de errores de dominio mapeada a códigos HTTP por el error handler middleware
- **Auth**: JWT en cabecera `Authorization: Bearer`. Las contraseñas se guardan con bcrypt. Login, recuperación y restablecimiento llevan límite de intentos (`express-rate-limit`); los fallos de login por cuenta se cuentan en memoria
- **Email**: Nodemailer contra MailDev en local y contra SMTP en producción. El enlace de reset apunta a `FRONTEND_URL`

El frontend es Next.js (App Router) con `next-intl` para español e inglés, HeroUI y Tailwind. Las llamadas a la API se hacen en el servidor y la sesión se guarda en la cookie `accessToken`.

## Estructura del proyecto

```
backend/src/
├── domain/                           # Capa de dominio
│   ├── shared/                         # Entidad base, paginación
│   ├── errors/                         # Errores de dominio
│   ├── article/                        # Artículo + casos de uso
│   ├── category/                       # Catálogo fijo de categorías
│   ├── comment/                        # Comentarios e hilos
│   ├── favorite/                       # Favoritos
│   └── user/                           # Usuario, auth y reset de contraseña
├── infrastructure/                   # Capa de infraestructura
│   ├── shared/                         # Prisma y EnvironmentService
│   ├── article/                        # PrismaArticleRepository, sanitizado HTML
│   ├── comment/
│   ├── favorite/
│   └── user/                           # Prisma, JWT, Nodemailer
├── ui/                               # Capa HTTP
│   ├── shared/middlewares/             # Error handler
│   ├── article/                        # Rutas, controladores, validadores
│   └── user/                           # Rutas, controladores, JWT y rate limit
├── index.ts                          # Punto de entrada
└── api.ts                            # Configuración de Express

frontend/src/
├── app/[locale]/                     # Rutas por idioma
│   ├── (auth)/                         # Login, registro, recuperación
│   ├── (site)/articles/                # Catálogo, perfil y detalle
│   ├── (site)/dashboard/               # Área privada y editor
│   └── components/                     # UI compartida
├── i18n/                             # Locales es / en
├── lib/                              # Tipos y utilidades de dominio
└── messages/                         # Copys es.json y en.json
```
