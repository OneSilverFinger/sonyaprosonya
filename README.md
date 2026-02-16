# Простой блог (Laravel + React)

Стек: Laravel API, MySQL, Nginx, React (Vite). Docker Compose поднимает production-подобное окружение: Nginx раздаёт собранный фронт из `frontend/dist`, а `/api` проксируется на PHP-FPM.

## Требования
- Запущенный Docker Desktop (или совместимый движок)
- Docker Compose v2

## Быстрый старт
```bash
# 1) Скопировать env
cp backend/.env.example backend/.env

# 2) Поднять стек и собрать фронт (frontend-build отработает автоматически)
docker compose up --build -d

# 3) Установить зависимости бэкенда
docker compose exec app composer install --no-interaction

# 4) Сгенерировать ключ приложения
docker compose exec app php artisan key:generate --ansi

# 5) Применить миграции и сиды
docker compose exec app php artisan migrate --seed
```

URL:
- Frontend (статика из Nginx): http://localhost:8080/
- API: http://localhost:8080/api/articles

## Полезные команды
- Логи Laravel: `docker compose exec app tail -f storage/logs/laravel.log`
- Запуск тестов: `docker compose exec -e APP_ENV=testing -e DB_CONNECTION=sqlite -e DB_DATABASE=:memory: app php artisan test`
- Пересобрать фронт вручную: `docker compose run --rm frontend-build`
- Остановить стек: `docker compose down`

## Что внутри
- REST API для статей (CRUD) и комментариев под `/api`, пагинация на списке.
- Миграции + сидер на 3–5 статей с комментариями.
- CORS включён (HandleCors, config/cors.php) и возвращает Access-Control-Allow-* для API.
- React UI: список с пагинацией, страница статьи с комментариями, формы добавления статьи/комментария, всплывающие ошибки.
- GitHub Actions (`.github/workflows/ci.yml`) прогоняет PHP feature-тесты и сборку фронтенда.
