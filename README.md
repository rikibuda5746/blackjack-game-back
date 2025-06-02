# 🚀 NestJS Starter — TypeORM + MySQL

This is a starter template for projects using **NestJS**, **TypeORM**, and **MySQL**. It provides a solid foundation
for building scalable server-side applications, with optional database support and built-in structure for real-world APIs.

---

## 📦 Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
# Copy the example .env file to create your local environment configuration
cp .env.example .env
```

3. Fill in database credentials and `JWT_SECRET` in the `.env` file.

4. Run the project:

```bash
npm run start       # Start in production mode
npm run start:dev   # Start in development mode with hot-reload
npm run build       # Build the project
```

---

## ⚙️ Running Without Database

If you want to run the project without TypeORM/MySQL:

- Delete the `database/` folder
- Remove `DatabaseModule` import from `CoreModule` (`src/core`)
- Delete the `data-source.ts` file in the root
- Delete the `scripts/` folder (migration scripts)
- Remove repository usage in the `users` module and its dependencies
- You can then integrate your own database if needed

---

## 🛠 Configuration

- Environment variables are configured in `.env`
- Additional settings and validation can be found in:
  - `config/`
  - `validation.schema.ts` (Joi schema for `.env` validation)

---

## 🧩 Project Structure

### Core (`src/core/`)

Global features and modules:

- `exceptions/` — global error handling with readable responses
- `guards/` — built-in JWT authentication for all routes
- `interceptors/`:
  - `logger.interceptor.ts` — logs requests and responses
  - `timeout.interceptor.ts` — handles response timeouts
- `logger/` — Winston-based logging
- `core.module.ts` — registers global modules like JWT, Schedule, and TypeORM

### Common (`src/common/`)

Reusable utilities and decorators:

- `decorators/`:
  - `@CurrentUser()` — extract user from JWT
  - `@CustomTimeout()` — set a custom timeout for a route
  - `@Public()` — make route publicly accessible (no auth)
  - `@Roles()` — restrict access based on user roles
- `dto/` — token payload types
- `enums/` — enums like user roles
- `base-repository.ts` — extended TypeORM repository with reusable query helpers

### Database (`src/database/`)

For managing migrations and seeders:

- `migration/` — stores generated migrations
- `seeders/` — manually created seed data
- Migration scripts are located in `scripts/`

> 🛠 **To generate a migration:**
>
> 1. Ensure your DB is running and configured
> 2. Create an `Entity` in a module (e.g. `users`)
> 3. Run:
>
> ```bash
> npm run migration <MigrationName>
> ```
>
> 4. Rename the generated file to include `.migration.ts` suffix:
>    `123456789-test.ts` → `123456789-test.migration.ts`
> 5. Restart the project — migration will run automatically

---

### Shared (`src/shared/`)

Shared utilities and helpers:

- `api-manager/` — for internal server-to-server API requests
- `dtos/`, `transformers/`, `types/` — pagination and data transformation tools

See `users` module for an example.

---

## 📘 Logging

This project comes with a built-in and pre-configured logging service based on [Winston](https://github.com/winstonjs/winston).

It supports the following log levels, listed from most to least verbose:

- `debug`
- `info`
- `warn`
- `error`

You can control which levels are output by setting the `LOG_LEVEL` variable in your `.env` file:

Only messages at this level and above will be shown.

## 💾File Logging

To enable writing logs to files, use the LOG_TO_FILE environment variable:

When enabled, logs will be saved in the logs/ directory:

logs/combined.log — contains all logs (info and above)

logs/error.log — contains only error logs

---

### Modules (`src/modules/`)

Every module follows this standard structure:

```
/users
├── controller.ts     # API endpoints
├── service.ts        # Business logic
├── repository.ts     # DB layer (if used)
├── entities/         # TypeORM entities
├── dto/
│   ├── queries/      # GET queries, filters, pagination
│   ├── requests/     # POST/PUT/PATCH requests
│   └── response/     # Output DTOs using class-transformer
├── interfaces/       # Shared and internal types used in the module
├── users.module.ts   # Main module file
```

> ⚠️ **Module Guidelines:**
>
> - A module may import:
>   - its own services, controllers, repositories
>   - other modules entirely
> - A module **must not import** services or repositories from other modules
> - Only services should be exported

More on [NestJS Modules](https://docs.nestjs.com/modules)

---

## 📍 Entry Point

The `main.ts` file bootstraps the application and applies global middleware, pipes, and logging.

---

## ✅ Author

**Vitaliy Drapkin**

---

## 💡 Good Luck!
