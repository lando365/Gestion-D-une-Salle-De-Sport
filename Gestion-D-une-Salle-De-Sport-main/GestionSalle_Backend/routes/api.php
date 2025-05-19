<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\MemberController;
use App\Http\Controllers\API\SubscriptionController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\EquipmentController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);
    Route::post('/toggle-two-factor', [AuthController::class, 'toggleTwoFactor']);
    Route::get('/activity-log', [AuthController::class, 'getActivityLog']);
    
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    
    // Membres
    Route::apiResource('members', MemberController::class);
    Route::get('/active-members', [MemberController::class, 'getActiveMembers']);
    Route::get('/member-stats', [MemberController::class, 'getMemberStats']);
    
    // Abonnements
    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::get('/subscriptions/member/{memberId}', [SubscriptionController::class, 'getSubscriptionsByMember']);
    Route::get('/subscriptions/expiring', [SubscriptionController::class, 'getExpiringSubscriptions']);
    
    // Services
    Route::apiResource('services', ServiceController::class);
    Route::get('/active-services', [ServiceController::class, 'getActiveServices']);
    
    // Équipements
    Route::apiResource('equipments', EquipmentController::class);
    Route::get('/available-equipments', [EquipmentController::class, 'getAvailableEquipments']);
    Route::get('/maintenance-equipments', [EquipmentController::class, 'getEquipmentsForMaintenance']);
    
    // Réservations
    Route::apiResource('reservations', ReservationController::class);
    Route::get('/calendar-events', [ReservationController::class, 'getCalendarEvents']);
    Route::get('/upcoming-reservations', [ReservationController::class, 'getUpcomingReservations']);
    Route::get('/reservation-stats', [ReservationController::class, 'getReservationStats']);
    
    // Paiements
    Route::apiResource('payments', PaymentController::class);
    Route::get('/payments/{id}/generate-invoice', [PaymentController::class, 'generateInvoice']);
    Route::get('/financial-stats', [PaymentController::class, 'getFinancialStats']);
    
    // Utilisateurs (accès admin uniquement)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::post('/register', [AuthController::class, 'register']);
        Route::get('/users/coaches', [UserController::class, 'getCoaches']);
    });
});