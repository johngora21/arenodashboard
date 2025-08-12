<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'module',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get roles that have this permission
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permissions')
                    ->wherePivot('is_active', true)
                    ->withTimestamps();
    }

    /**
     * Scope for active permissions
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for permissions by module
     */
    public function scopeByModule($query, $module)
    {
        return $query->where('module', $module);
    }

    /**
     * Scope for view permissions
     */
    public function scopeViewPermissions($query)
    {
        return $query->where('name', 'like', 'view_%');
    }

    /**
     * Scope for manage permissions
     */
    public function scopeManagePermissions($query)
    {
        return $query->where('name', 'like', 'manage_%');
    }

    /**
     * Check if permission is for viewing
     */
    public function isViewPermission()
    {
        return str_starts_with($this->name, 'view_');
    }

    /**
     * Check if permission is for managing
     */
    public function isManagePermission()
    {
        return str_starts_with($this->name, 'manage_');
    }

    /**
     * Get the base module name from permission
     */
    public function getModuleName()
    {
        if ($this->isViewPermission()) {
            return str_replace('view_', '', $this->name);
        }
        if ($this->isManagePermission()) {
            return str_replace('manage_', '', $this->name);
        }
        return $this->name;
    }
}
