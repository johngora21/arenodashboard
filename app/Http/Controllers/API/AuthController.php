<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * User login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'roles' => $user->roles->map(function($role) {
                            return [
                                'id' => $role->id,
                                'name' => $role->name,
                                'display_name' => $role->display_name,
                                'hierarchy_level' => $role->hierarchy_level,
                            ];
                        }),
                        'permissions' => $user->permissions->map(function($permission) {
                            return [
                                'id' => $permission->id,
                                'name' => $permission->name,
                                'display_name' => $permission->display_name,
                                'module' => $permission->module,
                            ];
                        }),
                        'is_admin' => $user->isAdmin(),
                        'is_hr' => $user->isHR(),
                        'highest_hierarchy_level' => $user->getHighestHierarchyLevel(),
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer',
                ]
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    /**
     * Get authenticated user info
     */
    public function me(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->map(function($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                            'display_name' => $role->display_name,
                            'hierarchy_level' => $role->hierarchy_level,
                        ];
                    }),
                    'permissions' => $user->permissions->map(function($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'display_name' => $permission->display_name,
                            'module' => $permission->module,
                        ];
                    }),
                    'is_admin' => $user->isAdmin(),
                    'is_hr' => $user->isHR(),
                    'highest_hierarchy_level' => $user->getHighestHierarchyLevel(),
                ]
            ]
        ]);
    }

    /**
     * Get user navigation based on permissions
     */
    public function navigation(Request $request)
    {
        $user = $request->user();
        
        // Get navigation based on user permissions
        $navigation = $this->getUserNavigation($user);
        
        return response()->json([
            'success' => true,
            'data' => [
                'navigation' => $navigation,
                'user_permissions' => $user->permissions->pluck('name')->toArray(),
            ]
        ]);
    }

    /**
     * User logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Check if user has specific permission
     */
    public function checkPermission(Request $request, $permission)
    {
        $user = $request->user();
        $hasPermission = $user->hasPermission($permission);

        return response()->json([
            'success' => true,
            'data' => [
                'permission' => $permission,
                'has_permission' => $hasPermission,
                'user_id' => $user->id,
            ]
        ]);
    }

    /**
     * Get user navigation based on permissions
     */
    private function getUserNavigation($user)
    {
        // Admin sees everything
        if ($user->isAdmin()) {
            return $this->getAdminNavigation();
        }

        // HR sees management features
        if ($user->isHR()) {
            return $this->getHRNavigation($user);
        }

        // Regular users see only authorized features
        return $this->getUserAuthorizedNavigation($user);
    }

    /**
     * Admin navigation - sees everything
     */
    private function getAdminNavigation()
    {
        return [
            [
                'name' => 'Dashboard',
                'href' => '/dashboard',
                'icon' => 'HomeIcon',
                'module' => 'dashboard',
                'children' => []
            ],
            [
                'name' => 'HR Management',
                'href' => '/hr',
                'icon' => 'UsersIcon',
                'module' => 'hr',
                'children' => [
                    ['name' => 'Employees', 'href' => '/hr/employees'],
                    ['name' => 'Departments', 'href' => '/hr/departments'],
                    ['name' => 'Positions', 'href' => '/hr/positions'],
                    ['name' => 'Attendance', 'href' => '/hr/attendance'],
                    ['name' => 'Leave Management', 'href' => '/hr/leave'],
                    ['name' => 'Training', 'href' => '/hr/training'],
                    ['name' => 'Performance', 'href' => '/hr/performance'],
                ]
            ],
            [
                'name' => 'Finance',
                'href' => '/finance',
                'icon' => 'CurrencyDollarIcon',
                'module' => 'finance',
                'children' => [
                    ['name' => 'Accounts', 'href' => '/finance/accounts'],
                    ['name' => 'Transactions', 'href' => '/finance/transactions'],
                    ['name' => 'Budgets', 'href' => '/finance/budgets'],
                    ['name' => 'Reports', 'href' => '/finance/reports'],
                ]
            ],
            [
                'name' => 'Sales',
                'href' => '/sales',
                'icon' => 'ChartBarIcon',
                'module' => 'sales',
                'children' => [
                    ['name' => 'Leads', 'href' => '/sales/leads'],
                    ['name' => 'Deals', 'href' => '/sales/deals'],
                    ['name' => 'Customers', 'href' => '/sales/customers'],
                    ['name' => 'Activities', 'href' => '/sales/activities'],
                ]
            ],
            [
                'name' => 'Inventory',
                'href' => '/inventory',
                'icon' => 'CubeIcon',
                'module' => 'inventory',
                'children' => [
                    ['name' => 'Items', 'href' => '/inventory/items'],
                    ['name' => 'Categories', 'href' => '/inventory/categories'],
                    ['name' => 'Suppliers', 'href' => '/inventory/suppliers'],
                    ['name' => 'Transactions', 'href' => '/inventory/transactions'],
                ]
            ],
            [
                'name' => 'Projects',
                'href' => '/projects',
                'icon' => 'FolderIcon',
                'module' => 'projects',
                'children' => [
                    ['name' => 'All Projects', 'href' => '/projects'],
                    ['name' => 'My Projects', 'href' => '/projects/my-projects'],
                    ['name' => 'Create Project', 'href' => '/projects/create'],
                ]
            ],
            [
                'name' => 'Tasks',
                'href' => '/tasks',
                'icon' => 'CheckCircleIcon',
                'module' => 'tasks',
                'children' => [
                    ['name' => 'All Tasks', 'href' => '/tasks'],
                    ['name' => 'My Tasks', 'href' => '/tasks/my-tasks'],
                    ['name' => 'Create Task', 'href' => '/tasks/create'],
                ]
            ],
            [
                'name' => 'Chat',
                'href' => '/chat',
                'icon' => 'ChatBubbleLeftIcon',
                'module' => 'chat',
                'children' => [
                    ['name' => 'Direct Messages', 'href' => '/chat/direct'],
                    ['name' => 'Group Chats', 'href' => '/chat/groups'],
                ]
            ],
            [
                'name' => 'Notifications',
                'href' => '/notifications',
                'icon' => 'BellIcon',
                'module' => 'notifications',
                'children' => []
            ],
            [
                'name' => 'Approvals',
                'href' => '/approvals',
                'icon' => 'ClipboardDocumentCheckIcon',
                'module' => 'approvals',
                'children' => [
                    ['name' => 'Pending', 'href' => '/approvals/pending'],
                    ['name' => 'Approved', 'href' => '/approvals/approved'],
                    ['name' => 'Rejected', 'href' => '/approvals/rejected'],
                ]
            ],
            [
                'name' => 'Settings',
                'href' => '/settings',
                'icon' => 'Cog6ToothIcon',
                'module' => 'settings',
                'children' => [
                    ['name' => 'Personal', 'href' => '/settings/personal'],
                    ['name' => 'System', 'href' => '/settings/system'],
                    ['name' => 'Users & Roles', 'href' => '/settings/users-roles'],
                ]
            ],
        ];
    }

    /**
     * HR navigation - sees management features
     */
    private function getHRNavigation($user)
    {
        $navigation = [
            [
                'name' => 'Dashboard',
                'href' => '/dashboard',
                'icon' => 'HomeIcon',
                'module' => 'dashboard',
                'children' => []
            ],
            [
                'name' => 'HR Management',
                'href' => '/hr',
                'icon' => 'UsersIcon',
                'module' => 'hr',
                'children' => [
                    ['name' => 'Employees', 'href' => '/hr/employees'],
                    ['name' => 'Departments', 'href' => '/hr/departments'],
                    ['name' => 'Positions', 'href' => '/hr/positions'],
                    ['name' => 'Attendance', 'href' => '/hr/attendance'],
                    ['name' => 'Leave Management', 'href' => '/hr/leave'],
                    ['name' => 'Training', 'href' => '/hr/training'],
                    ['name' => 'Performance', 'href' => '/hr/performance'],
                ]
            ],
        ];

        // Add other modules based on HR permissions
        if ($user->canViewModule('finance')) {
            $navigation[] = [
                'name' => 'Finance',
                'href' => '/finance',
                'icon' => 'CurrencyDollarIcon',
                'module' => 'finance',
                'children' => [
                    ['name' => 'Accounts', 'href' => '/finance/accounts'],
                    ['name' => 'Transactions', 'href' => '/finance/transactions'],
                    ['name' => 'Budgets', 'href' => '/finance/budgets'],
                    ['name' => 'Reports', 'href' => '/finance/reports'],
                ]
            ];
        }

        if ($user->canViewModule('sales')) {
            $navigation[] = [
                'name' => 'Sales',
                'href' => '/sales',
                'icon' => 'ChartBarIcon',
                'module' => 'sales',
                'children' => [
                    ['name' => 'Leads', 'href' => '/sales/leads'],
                    ['name' => 'Deals', 'href' => '/sales/deals'],
                    ['name' => 'Customers', 'href' => '/sales/customers'],
                    ['name' => 'Activities', 'href' => '/sales/activities'],
                ]
            ];
        }

        if ($user->canViewModule('inventory')) {
            $navigation[] = [
                'name' => 'Inventory',
                'href' => '/inventory',
                'icon' => 'CubeIcon',
                'module' => 'inventory',
                'children' => [
                    ['name' => 'Items', 'href' => '/inventory/items'],
                    ['name' => 'Categories', 'href' => '/inventory/categories'],
                    ['name' => 'Suppliers', 'href' => '/inventory/suppliers'],
                    ['name' => 'Transactions', 'href' => '/inventory/transactions'],
                ]
            ];
        }

        if ($user->canViewModule('projects')) {
            $navigation[] = [
                'name' => 'Projects',
                'href' => '/projects',
                'icon' => 'FolderIcon',
                'module' => 'projects',
                'children' => [
                    ['name' => 'All Projects', 'href' => '/projects'],
                    ['name' => 'My Projects', 'href' => '/projects/my-projects'],
                    ['name' => 'Create Project', 'href' => '/projects/create'],
                ]
            ];
        }

        if ($user->canViewModule('tasks')) {
            $navigation[] = [
                'name' => 'Tasks',
                'href' => '/tasks',
                'icon' => 'CheckCircleIcon',
                'module' => 'tasks',
                'children' => [
                    ['name' => 'All Tasks', 'href' => '/tasks'],
                    ['name' => 'My Tasks', 'href' => '/tasks/my-tasks'],
                    ['name' => 'Create Task', 'href' => '/tasks/create'],
                ]
            ];
        }

        if ($user->canViewModule('chat')) {
            $navigation[] = [
                'name' => 'Chat',
                'href' => '/chat',
                'icon' => 'ChatBubbleLeftIcon',
                'module' => 'chat',
                'children' => [
                    ['name' => 'Direct Messages', 'href' => '/chat/direct'],
                    ['name' => 'Group Chats', 'href' => '/chat/groups'],
                ]
            ];
        }

        if ($user->canViewModule('notifications')) {
            $navigation[] = [
                'name' => 'Notifications',
                'href' => '/notifications',
                'icon' => 'BellIcon',
                'module' => 'notifications',
                'children' => []
            ];
        }

        if ($user->canViewModule('approvals')) {
            $navigation[] = [
                'name' => 'Approvals',
                'href' => '/approvals',
                'icon' => 'ClipboardDocumentCheckIcon',
                'module' => 'approvals',
                'children' => [
                    ['name' => 'Pending', 'href' => '/approvals/pending'],
                    ['name' => 'Approved', 'href' => '/approvals/approved'],
                    ['name' => 'Rejected', 'href' => '/approvals/rejected'],
                ]
            ];
        }

        if ($user->canViewModule('settings')) {
            $navigation[] = [
                'name' => 'Settings',
                'href' => '/settings',
                'icon' => 'Cog6ToothIcon',
                'module' => 'settings',
                'children' => [
                    ['name' => 'Personal', 'href' => '/settings/personal'],
                    ['name' => 'System', 'href' => '/settings/system'],
                    ['name' => 'Users & Roles', 'href' => '/settings/users-roles'],
                ]
            ];
        }

        return $navigation;
    }

    /**
     * Regular user navigation - only authorized features
     */
    private function getUserAuthorizedNavigation($user)
    {
        $navigation = [
            [
                'name' => 'Dashboard',
                'href' => '/dashboard',
                'icon' => 'HomeIcon',
                'module' => 'dashboard',
                'children' => []
            ],
        ];

        // Only add modules the user has permission to view
        if ($user->canViewModule('hr')) {
            $navigation[] = [
                'name' => 'HR',
                'href' => '/hr',
                'icon' => 'UsersIcon',
                'module' => 'hr',
                'children' => [
                    ['name' => 'My Profile', 'href' => '/hr/profile'],
                    ['name' => 'My Attendance', 'href' => '/hr/attendance'],
                    ['name' => 'My Leave', 'href' => '/hr/leave'],
                ]
            ];
        }

        if ($user->canViewModule('finance')) {
            $navigation[] = [
                'name' => 'Finance',
                'href' => '/finance',
                'icon' => 'CurrencyDollarIcon',
                'module' => 'finance',
                'children' => [
                    ['name' => 'My Expenses', 'href' => '/finance/expenses'],
                    ['name' => 'My Budget', 'href' => '/finance/budget'],
                ]
            ];
        }

        if ($user->canViewModule('sales')) {
            $navigation[] = [
                'name' => 'Sales',
                'href' => '/sales',
                'icon' => 'ChartBarIcon',
                'module' => 'sales',
                'children' => [
                    ['name' => 'My Leads', 'href' => '/sales/leads'],
                    ['name' => 'My Deals', 'href' => '/sales/deals'],
                ]
            ];
        }

        if ($user->canViewModule('inventory')) {
            $navigation[] = [
                'name' => 'Inventory',
                'href' => '/inventory',
                'icon' => 'CubeIcon',
                'module' => 'inventory',
                'children' => [
                    ['name' => 'Browse Items', 'href' => '/inventory/items'],
                    ['name' => 'My Requests', 'href' => '/inventory/requests'],
                ]
            ];
        }

        if ($user->canViewModule('projects')) {
            $navigation[] = [
                'name' => 'Projects',
                'href' => '/projects',
                'icon' => 'FolderIcon',
                'module' => 'projects',
                'children' => [
                    ['name' => 'My Projects', 'href' => '/projects/my-projects'],
                ]
            ];
        }

        if ($user->canViewModule('tasks')) {
            $navigation[] = [
                'name' => 'Tasks',
                'href' => '/tasks',
                'icon' => 'CheckCircleIcon',
                'module' => 'tasks',
                'children' => [
                    ['name' => 'My Tasks', 'href' => '/tasks/my-tasks'],
                ]
            ];
        }

        if ($user->canViewModule('chat')) {
            $navigation[] = [
                'name' => 'Chat',
                'href' => '/chat',
                'icon' => 'ChatBubbleLeftIcon',
                'module' => 'chat',
                'children' => [
                    ['name' => 'Direct Messages', 'href' => '/chat/direct'],
                    ['name' => 'Group Chats', 'href' => '/chat/groups'],
                ]
            ];
        }

        if ($user->canViewModule('notifications')) {
            $navigation[] = [
                'name' => 'Notifications',
                'href' => '/notifications',
                'icon' => 'BellIcon',
                'module' => 'notifications',
                'children' => []
            ];
        }

        if ($user->canViewModule('approvals')) {
            $navigation[] = [
                'name' => 'Approvals',
                'href' => '/approvals',
                'icon' => 'ClipboardDocumentCheckIcon',
                'module' => 'approvals',
                'children' => [
                    ['name' => 'My Requests', 'href' => '/approvals/my-requests'],
                ]
            ];
        }

        if ($user->canViewModule('settings')) {
            $navigation[] = [
                'name' => 'Settings',
                'href' => '/settings',
                'icon' => 'Cog6ToothIcon',
                'module' => 'settings',
                'children' => [
                    ['name' => 'Personal', 'href' => '/settings/personal'],
                ]
            ];
        }

        return $navigation;
    }
}
