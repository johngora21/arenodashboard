<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('auth-token')->plainTextToken;

        // Get user roles and permissions
        $userRoles = UserRole::where('user_id', $user->id)->with('role.permissions')->get();
        $permissions = collect();
        
        foreach ($userRoles as $userRole) {
            if ($userRole->role && $userRole->role->permissions) {
                $permissions = $permissions->merge($userRole->role->permissions);
            }
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $userRoles->first()->role->name ?? 'User',
                'roleId' => $userRoles->first()->role->id ?? null,
                'permissions' => $permissions->pluck('name')->unique()->values(),
                'status' => $user->status,
                'department' => $user->department,
                'position' => $user->position,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'lastLogin' => $user->last_login_at,
                'createdAt' => $user->created_at,
                'updatedAt' => $user->updated_at
            ],
            'token' => $token
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|exists:roles,id'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => 'active'
        ]);

        // Assign role
        UserRole::create([
            'user_id' => $user->id,
            'role_id' => $request->role_id
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        $userRoles = UserRole::where('user_id', $user->id)->with('role.permissions')->get();
        $permissions = collect();
        
        foreach ($userRoles as $userRole) {
            if ($userRole->role && $userRole->role->permissions) {
                $permissions = $permissions->merge($userRole->role->permissions);
            }
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $userRoles->first()->role->name ?? 'User',
            'roleId' => $userRoles->first()->role->id ?? null,
            'permissions' => $permissions->pluck('name')->unique()->values(),
            'status' => $user->status,
            'department' => $user->department,
            'position' => $user->position,
            'phone' => $user->phone,
            'avatar' => $user->avatar,
            'lastLogin' => $user->last_login_at,
            'createdAt' => $user->created_at,
            'updatedAt' => $user->updated_at
        ]);
    }
}
