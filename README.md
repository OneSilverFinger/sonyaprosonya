# Simple Blog (Laravel + React)

Stack: Laravel API, MySQL, Nginx, React (Vite). Docker Compose is used for local development.

## Prerequisites
- Docker Desktop (or compatible engine) running
- Docker Compose v2

## Quick start
```bash
# 1) copy env
cp backend/.env.example backend/.env

# 2) build & start containers
docker compose up --build -d

# 3) install backend dependencies inside the PHP container
docker compose exec app composer install

# 4) generate app key
docker compose exec app php artisan key:generate

# 5) run migrations & seed sample data
docker compose exec app php artisan migrate --seed
```

Services:
- API: http://localhost:8080/api/articles
- Frontend (Vite dev server): http://localhost:5173

The frontend uses `VITE_API_URL` (set in `docker-compose.yml`) to talk to the API. If you run the frontend outside Docker, set `VITE_API_URL=http://localhost:8080/api` in `frontend/.env`.

## Useful commands
- Tail Laravel logs: `docker compose exec app tail -f storage/logs/laravel.log`
- Run tests: `docker compose exec app php artisan test`
- Stop stack: `docker compose down`

## What’s included
- REST endpoints for articles (CRUD) and posting comments under `/api`.
- Migrations for `articles` and `comments`.
- Seeder with a few sample articles and comments.
- React UI: list, detail with comments, and forms to add articles/comments.
