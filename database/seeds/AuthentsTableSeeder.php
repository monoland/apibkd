<?php

use Illuminate\Database\Seeder;
use App\Models\Authent;

class AuthentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Authent::create(['name' => 'administrator']);
        // Authent::create(['name' => 'manager']);
        // Authent::create(['name' => 'operator']);
    }
}
