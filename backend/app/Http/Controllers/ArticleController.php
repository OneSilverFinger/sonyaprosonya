<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::withCount('comments')
            ->latest()
            ->get();

        return response()->json($articles);
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
        $article->load('comments');

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
