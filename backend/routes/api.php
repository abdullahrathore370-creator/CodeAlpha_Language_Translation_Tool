<?php

use App\Http\Controllers\TranslationController;
use Illuminate\Support\Facades\Route;

Route::post('/translate', [TranslationController::class, 'translate']);