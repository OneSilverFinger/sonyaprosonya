<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Comment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_paginated_articles_with_comment_counts(): void
    {
        Article::factory()
            ->count(3)
            ->has(Comment::factory()->count(2))
            ->create();

        $response = $this->getJson('/api/articles?per_page=2');

        $response
            ->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta'])
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.per_page', 2);

        $this->assertSame(2, $response->json('data')[0]['comments_count']);
    }

    public function test_it_can_create_article(): void
    {
        $payload = [
            'title' => 'Новое тестовое название',
            'content' => 'Тело статьи для тестов.',
        ];

        $response = $this->postJson('/api/articles', $payload);

        $response
            ->assertCreated()
            ->assertJsonFragment($payload);

        $this->assertDatabaseHas('articles', $payload);
    }

    public function test_it_shows_single_article_with_comments(): void
    {
        $article = Article::factory()
            ->has(Comment::factory()->count(2))
            ->create();

        $response = $this->getJson("/api/articles/{$article->id}");

        $response
            ->assertOk()
            ->assertJsonPath('id', $article->id)
            ->assertJsonPath('comments_count', 2)
            ->assertJsonCount(2, 'comments');
    }

    public function test_it_validates_comment_payload(): void
    {
        $article = Article::factory()->create();

        $response = $this->postJson("/api/articles/{$article->id}/comments", []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['author_name', 'content']);
    }

    public function test_it_adds_comment_to_article(): void
    {
        $article = Article::factory()->create();

        $payload = [
            'author_name' => 'Комментатор',
            'content' => 'Отличная статья!',
        ];

        $response = $this->postJson("/api/articles/{$article->id}/comments", $payload);

        $response
            ->assertCreated()
            ->assertJsonFragment($payload)
            ->assertJsonPath('article_id', $article->id);

        $this->assertDatabaseHas('comments', [
            'article_id' => $article->id,
            'author_name' => $payload['author_name'],
            'content' => $payload['content'],
        ]);
    }
}
