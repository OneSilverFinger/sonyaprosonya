<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Заполнение базы тестовыми данными.
     */
    public function run(): void
    {
        $this->call(ArticleSeeder::class);
    }
}
