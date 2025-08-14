<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\InventoryController;
use App\Http\Controllers\API\ApprovalController;
use App\Http\Controllers\API\ReportController;
use App\Http\Controllers\API\PasswordResetController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/password/email', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);
Route::post('/password/verify', [PasswordResetController::class, 'verifyToken']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Departments
    Route::apiResource('departments', DepartmentController::class);
    Route::get('/departments/stats', [DepartmentController::class, 'stats']);
    
    // Employees
    Route::apiResource('employees', EmployeeController::class);
    Route::get('/employees/stats', [EmployeeController::class, 'stats']);
    
    // Inventory
    Route::apiResource('inventory', InventoryController::class);
    Route::get('/inventory/stats', [InventoryController::class, 'stats']);
    
    // Approvals
    Route::apiResource('approvals', ApprovalController::class);
    
    // Reports
    Route::get('/reports/financial', [ReportController::class, 'financial']);
    Route::get('/reports/hr', [ReportController::class, 'hr']);
    Route::get('/reports/inventory', [ReportController::class, 'inventory']);
    Route::get('/reports/sales', [ReportController::class, 'sales']);
    
    // Dashboard
    Route::get('/dashboard/stats', [ReportController::class, 'dashboardStats']);
});
