<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Matches the fruitcake/laravel-cors defaults so that API clients receive
    | the standard Access-Control-Allow-* headers for every JSON response.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [env('CORS_ALLOWED_ORIGINS', '*')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['*'],

    'max_age' => 3600,

    'supports_credentials' => false,
];
