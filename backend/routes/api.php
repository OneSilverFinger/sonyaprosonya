<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;

// Лимитируем запросы, чтобы защитить API от спама: 60 запросов в минуту на операции со статьями,
// и 20 запросов в минуту на добавление комментариев.
Route::middleware('throttle:60,1')->group(function () {
    Route::apiResource('articles', ArticleController::class);
});

Route::post('articles/{article}/comments', [CommentController::class, 'store'])
    ->middleware('throttle:20,1');
