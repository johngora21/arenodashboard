<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'hierarchy_level',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'hierarchy_level' => 'integer',
    ];

    /**
     * Get users with this role
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles')
                    ->wherePivot('is_active', true)
                    ->withTimestamps();
    }

    /**
     * Get permissions for this role
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permissions')
                    ->wherePivot('is_active', true)
                    ->withTimestamps();
    }

    /**
     * Check if role has a specific permission
     */
    public function hasPermission($permission)
    {
        if (is_string($permission)) {
            return $this->permissions()->where('name', $permission)->exists();
        }
        return $this->permissions()->where('id', $permission->id)->exists();
    }

    /**
     * Check if role can manage a specific module
     */
    public function canManageModule($module)
    {
        return $this->hasPermission("manage_{$module}");
    }

    /**
     * Check if role can view a specific module
     */
    public function canViewModule($module)
    {
        return $this->hasPermission("view_{$module}") || $this->hasPermission("manage_{$module}");
    }

    /**
     * Scope for active roles
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for roles by hierarchy level
     */
    public function scopeByHierarchy($query, $level)
    {
        return $query->where('hierarchy_level', $level);
    }

    /**
     * Scope for roles at or above hierarchy level
     */
    public function scopeAtOrAboveHierarchy($query, $level)
    {
        return $query->where('hierarchy_level', '<=', $level);
    }
}
