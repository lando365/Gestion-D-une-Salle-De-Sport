<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ordre d'exécution important pour maintenir les relations
        $this->call([
            UserSeeder::class,          // Utilisateurs (admin, manager, coaches)
            MemberSeeder::class,        // Membres
            ServiceSeeder::class,       // Services
            EquipmentSeeder::class,     // Équipements
            SubscriptionSeeder::class,  // Abonnements
            ReservationSeeder::class,   // Réservations
            PaymentSeeder::class,       // Paiements
        ]);
    }
}