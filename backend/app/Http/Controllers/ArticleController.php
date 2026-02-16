<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max($request->integer('per_page') ?? 6, 1), 50);

        $articles = Article::withCount('comments')
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'data' => $articles->items(),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
            ],
            'links' => [
                'first' => $articles->url(1),
                'last' => $articles->url($articles->lastPage()),
                'prev' => $articles->previousPageUrl(),
                'next' => $articles->nextPageUrl(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $article = Article::create($data);

        return response()->json($article, 201);
    }

    public function show(Article $article)
    {
        $article->load(['comments' => function ($query) {
            $query->latest();
        }]);

        $article->loadCount('comments');

        return response()->json($article);
    }

    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['sometimes', 'required', 'string'],
        ]);

        $article->update($data);

        return response()->json($article);
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return response()->json(null, 204);
    }
}
