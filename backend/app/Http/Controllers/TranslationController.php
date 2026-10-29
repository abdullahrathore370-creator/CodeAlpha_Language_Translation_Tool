<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TranslationController extends Controller
{
    public function translate(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
            'source_language' => 'required|string',
            'target_language' => 'required|string',
        ]);

        $prompt = "Translate the following text from {$request->source_language} to {$request->target_language}.
Return ONLY the translated text. Do not add explanations, quotation marks, or extra text.

Text:
{$request->text}";

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=' . config('services.gemini.api_key'),
            [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => $prompt,
                            ],
                        ],
                    ],
                ],
            ]
        );

        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Gemini API request failed.',
                'error' => $response->json(),
            ], 500);
        }

        $translation = $response->json('candidates.0.content.parts.0.text');

        return response()->json([
            'success' => true,
            'translation' => trim($translation),
        ]);
    }
}