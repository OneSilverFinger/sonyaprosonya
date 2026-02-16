<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;

Route::apiResource('articles', ArticleController::class);
Route::post('articles/{article}/comments', [CommentController::class, 'store']);
