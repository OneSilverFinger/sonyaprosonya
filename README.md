# Простой блог (Laravel + React)

Стек: Laravel API, MySQL, Nginx, React (Vite). Docker Compose используется для локального запуска.

## Требования
- Запущенный Docker Desktop (или совместимый движок)
- Docker Compose v2

## Быстрый старт
```bash
# 1) скопировать env
cp backend/.env.example backend/.env

# 2) собрать и поднять контейнеры
docker compose up --build -d

# 3) установить зависимости бэкенда внутри PHP-контейнера
docker compose exec app composer install

# 4) сгенерировать ключ приложения
docker compose exec app php artisan key:generate

# 5) применить миграции и сиды
docker compose exec app php artisan migrate --seed
```

Сервисы:
- API: http://localhost:8080/api/articles
- Frontend (Vite dev server): http://localhost:5173

Фронтенд использует `VITE_API_URL` (задано в `docker-compose.yml`) для общения с API. Если запускать фронтенд вне Docker, задайте `VITE_API_URL=http://localhost:8080/api` в `frontend/.env`.

## Полезные команды
- Логи Laravel: `docker compose exec app tail -f storage/logs/laravel.log`
- Тесты: `docker compose exec app php artisan test`
- Остановка стека: `docker compose down`

## Что внутри
- REST-эндпоинты для статей (CRUD) и добавления комментариев под `/api`.
- Миграции для таблиц `articles` и `comments`.
- Сид с несколькими тестовыми статьями и комментариями.
- React UI: список статей, страница статьи с комментариями и формы добавления статей/комментариев.
