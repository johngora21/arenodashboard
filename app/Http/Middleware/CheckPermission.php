<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Admin bypasses all permission checks
        if ($user->isAdmin()) {
            return $next($request);
        }

        // Check if user has the required permission
        if (!$user->hasPermission($permission)) {
            // If it's an API request, return JSON response
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Access Denied',
                    'message' => 'You do not have permission to access this resource.',
                    'required_permission' => $permission
                ], 403);
            }

            // For web requests, redirect with error message
            return redirect()->back()->with('error', 'Access Denied: You do not have permission to perform this action.');
        }

        return $next($request);
    }
}
