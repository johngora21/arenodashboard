<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get all roles for the user
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
                    ->wherePivot('is_active', true)
                    ->withTimestamps();
    }

    /**
     * Get all permissions for the user through their roles
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_roles', 'user_id', 'permission_id')
                    ->join('roles', 'user_roles.role_id', '=', 'roles.id')
                    ->join('role_permissions', 'roles.id', '=', 'role_permissions.role_id')
                    ->where('user_roles.is_active', true)
                    ->where('role_permissions.is_active', true)
                    ->where('roles.is_active', true)
                    ->select('permissions.*')
                    ->distinct();
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission($permission)
    {
        if (is_string($permission)) {
            return $this->permissions()->where('name', $permission)->exists();
        }
        return $this->permissions()->where('id', $permission->id)->exists();
    }

    /**
     * Check if user has any of the given permissions
     */
    public function hasAnyPermission($permissions)
    {
        if (is_string($permissions)) {
            $permissions = [$permissions];
        }
        return $this->permissions()->whereIn('name', $permissions)->exists();
    }

    /**
     * Check if user has all of the given permissions
     */
    public function hasAllPermissions($permissions)
    {
        if (is_string($permissions)) {
            $permissions = [$permissions];
        }
        $userPermissions = $this->permissions()->whereIn('name', $permissions)->pluck('name')->toArray();
        return count(array_diff($permissions, $userPermissions)) === 0;
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles()->where('name', $role)->exists();
        }
        return $this->roles()->where('id', $role->id)->exists();
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole($roles)
    {
        if (is_string($roles)) {
            $roles = [$roles];
        }
        return $this->roles()->whereIn('name', $roles)->exists();
    }

    /**
     * Check if user is admin (highest hierarchy level)
     */
    public function isAdmin()
    {
        return $this->roles()->where('hierarchy_level', 0)->exists();
    }

    /**
     * Check if user is HR (hierarchy level 1)
     */
    public function isHR()
    {
        return $this->roles()->where('hierarchy_level', 1)->exists();
    }

    /**
     * Check if user can manage a specific module
     */
    public function canManageModule($module)
    {
        return $this->hasPermission("manage_{$module}");
    }

    /**
     * Check if user can view a specific module
     */
    public function canViewModule($module)
    {
        return $this->hasPermission("view_{$module}") || $this->hasPermission("manage_{$module}");
    }

    /**
     * Get user's highest hierarchy level
     */
    public function getHighestHierarchyLevel()
    {
        return $this->roles()->min('hierarchy_level') ?? 999;
    }
}
