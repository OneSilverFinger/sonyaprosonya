<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Старт блога',
                'content' => 'Демо показывает, как API и фронтенд работают вместе. Добавляйте свои статьи и комментарии, чтобы пройти весь цикл.',
                'comments' => [
                    ['author_name' => 'Админ', 'content' => 'Добро пожаловать!'],
                ],
            ],
            [
                'title' => 'Основы Laravel API',
                'content' => 'Laravel ускоряет создание JSON‑API: ресурсные маршруты, валидация и модели Eloquent. Здесь всё намеренно упрощено.',
                'comments' => [
                    ['author_name' => 'Нина', 'content' => 'Спасибо за короткий пример.'],
                    ['author_name' => 'Лёва', 'content' => 'Хочу покрутить это приложение.'],
                ],
            ],
            [
                'title' => 'Заметки по React',
                'content' => 'Фронтенд на Vite получает данные из API: список статей, детальная страница с комментариями и формы добавления.',
                'comments' => [
                    ['author_name' => 'Сэм', 'content' => 'UI выглядит аккуратно!'],
                ],
            ],
        ];

        foreach ($articles as $data) {
            $comments = $data['comments'] ?? [];
            unset($data['comments']);

            $article = Article::create($data);

            foreach ($comments as $comment) {
                $article->comments()->create($comment);
            }
        }
    }
}
