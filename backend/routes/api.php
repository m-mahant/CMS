<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\BlogController;

Route::post('login', [UserAuthController::class, 'login']);
Route::post('register', [UserAuthController::class, 'register']);
Route::post('logout', [UserAuthController::class, 'logout']);
Route::get('/users', [UserAuthController::class, 'getUsers']);

Route::post('/create-blog', [BlogController::class, 'create']);
Route::post('/update-blog/{id}', [BlogController::class, 'update']);
Route::get('/blog-posts', [BlogController::class, 'index']);
Route::get('/blog-posts/{id}', [BlogController::class, 'show']);

