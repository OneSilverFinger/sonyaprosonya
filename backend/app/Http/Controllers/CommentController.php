<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Article $article)
    {
        $data = $request->validate([
            'author_name' => ['required', 'string', 'max:100'],
            'content' => ['required', 'string'],
        ]);

        $comment = $article->comments()->create($data);

        return response()->json($comment, 201);
    }
}
