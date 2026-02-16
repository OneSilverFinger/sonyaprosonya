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
                'title' => 'Getting started with the blog',
                'content' => 'This demo blog shows how the API and frontend work together. Feel free to add your own posts and comments to see the flow end to end.',
                'comments' => [
                    ['author_name' => 'Admin', 'content' => 'Welcome aboard!'],
                ],
            ],
            [
                'title' => 'Laravel API basics',
                'content' => 'Laravel makes building JSON APIs fast with resource routing, validation, and Eloquent models. This sample keeps things intentionally simple.',
                'comments' => [
                    ['author_name' => 'Nina', 'content' => 'Thanks for the concise example.'],
                    ['author_name' => 'Leo', 'content' => 'Excited to hack on this.'],
                ],
            ],
            [
                'title' => 'React frontend notes',
                'content' => 'The React app uses Vite and fetches data from the API. It provides article listing, detail view with comments, and forms to add new content.',
                'comments' => [
                    ['author_name' => 'Sam', 'content' => 'UI looks clean!'],
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
