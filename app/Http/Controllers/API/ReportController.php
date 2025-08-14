<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Employee;
use App\Models\InventoryItem;
use App\Models\FinancialReport;
use App\Models\Transaction;
use App\Models\Project;
use App\Models\LeaveRequest;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function dashboardStats()
    {
        $stats = [
            'overview' => [
                'totalEmployees' => Employee::count(),
                'totalDepartments' => Department::count(),
                'totalInventoryItems' => InventoryItem::count(),
                'totalProjects' => Project::count()
            ],
            'employeeStats' => [
                'activeEmployees' => Employee::where('status', 'active')->count(),
                'employeesOnLeave' => Employee::where('status', 'on_leave')->count(),
                'newHiresThisMonth' => Employee::whereMonth('hire_date', now()->month)->count(),
                'employeesByDepartment' => Employee::select('departments.name as department_name', DB::raw('count(*) as count'))
                    ->join('departments', 'employees.department_id', '=', 'departments.id')
                    ->groupBy('departments.id', 'departments.name')
                    ->get()
            ],
            'financialStats' => [
                'totalBudget' => Department::sum('budget'),
                'averageSalary' => Employee::where('status', 'active')->avg('salary') ?? 0,
                'totalInventoryValue' => InventoryItem::sum(DB::raw('quantity * unit_price')),
                'monthlyExpenses' => Transaction::whereMonth('created_at', now()->month)
                    ->where('type', 'expense')
                    ->sum('amount')
            ],
            'inventoryStats' => [
                'itemsInStock' => InventoryItem::where('status', 'in_stock')->count(),
                'lowStockItems' => InventoryItem::where('quantity', '<=', DB::raw('min_quantity'))->count(),
                'outOfStockItems' => InventoryItem::where('status', 'out_of_stock')->count(),
                'topCategories' => InventoryItem::select('inventory_categories.name as category_name', DB::raw('count(*) as count'))
                    ->join('inventory_categories', 'inventory_items.category_id', '=', 'inventory_categories.id')
                    ->groupBy('inventory_categories.id', 'inventory_categories.name')
                    ->orderBy('count', 'desc')
                    ->limit(5)
                    ->get()
            ]
        ];

        return response()->json($stats);
    }

    public function financial()
    {
        $reports = [
            'monthlyRevenue' => Transaction::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expense'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE -amount END) as profit')
            )
                ->whereYear('created_at', now()->year)
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get(),
            
            'departmentBudgets' => Department::select('name', 'budget')
                ->where('status', 'active')
                ->orderBy('budget', 'desc')
                ->get(),
            
            'expenseCategories' => Transaction::select('transaction_categories.name as category', DB::raw('SUM(amount) as total'))
                ->join('transaction_categories', 'transactions.category_id', '=', 'transaction_categories.id')
                ->where('type', 'expense')
                ->whereYear('created_at', now()->year)
                ->groupBy('transaction_categories.id', 'transaction_categories.name')
                ->orderBy('total', 'desc')
                ->limit(10)
                ->get(),
            
            'profitTrends' => Transaction::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE -amount END) as daily_profit')
            )
                ->whereBetween('created_at', [now()->subDays(30), now()])
                ->groupBy('date')
                ->orderBy('date')
                ->get()
        ];

        return response()->json($reports);
    }

    public function hr()
    {
        $reports = [
            'employeeDistribution' => [
                'byDepartment' => Employee::select('departments.name as department', DB::raw('count(*) as count'))
                    ->join('departments', 'employees.department_id', '=', 'departments.id')
                    ->groupBy('departments.id', 'departments.name')
                    ->get(),
                'byPosition' => Employee::select('positions.name as position', DB::raw('count(*) as count'))
                    ->join('positions', 'employees.position_id', '=', 'positions.id')
                    ->groupBy('positions.id', 'positions.name')
                    ->get(),
                'byStatus' => Employee::select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->get()
            ],
            'salaryAnalysis' => [
                'byDepartment' => Employee::select('departments.name as department', DB::raw('AVG(salary) as avg_salary'))
                    ->join('departments', 'employees.department_id', '=', 'departments.id')
                    ->where('employees.status', 'active')
                    ->groupBy('departments.id', 'departments.name')
                    ->get(),
                'salaryRanges' => [
                    'low' => Employee::where('status', 'active')->where('salary', '<', 50000)->count(),
                    'medium' => Employee::where('status', 'active')->whereBetween('salary', [50000, 100000])->count(),
                    'high' => Employee::where('status', 'active')->where('salary', '>', 100000)->count()
                ]
            ],
            'hiringTrends' => Employee::select(
                DB::raw('YEAR(hire_date) as year'),
                DB::raw('MONTH(hire_date) as month'),
                DB::raw('count(*) as hires')
            )
                ->whereYear('hire_date', '>=', now()->subYears(2))
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get(),
            'leaveAnalysis' => LeaveRequest::select(
                'leave_types.name as leave_type',
                DB::raw('count(*) as count'),
                DB::raw('AVG(DATEDIFF(end_date, start_date)) as avg_duration')
            )
                ->join('leave_types', 'leave_requests.leave_type_id', '=', 'leave_types.id')
                ->whereYear('start_date', now()->year)
                ->groupBy('leave_types.id', 'leave_types.name')
                ->get()
        ];

        return response()->json($reports);
    }

    public function inventory()
    {
        $reports = [
            'stockLevels' => [
                'byStatus' => InventoryItem::select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->get(),
                'byCategory' => InventoryItem::select('inventory_categories.name as category', DB::raw('count(*) as count'))
                    ->join('inventory_categories', 'inventory_items.category_id', '=', 'inventory_categories.id')
                    ->groupBy('inventory_categories.id', 'inventory_categories.name')
                    ->get()
            ],
            'valueAnalysis' => [
                'totalValue' => InventoryItem::sum(DB::raw('quantity * unit_price')),
                'byCategory' => InventoryItem::select(
                    'inventory_categories.name as category',
                    DB::raw('SUM(quantity * unit_price) as total_value'),
                    DB::raw('AVG(unit_price) as avg_price')
                )
                    ->join('inventory_categories', 'inventory_items.category_id', '=', 'inventory_categories.id')
                    ->groupBy('inventory_categories.id', 'inventory_categories.name')
                    ->orderBy('total_value', 'desc')
                    ->get(),
                'topValueItems' => InventoryItem::select('name', 'quantity', 'unit_price', DB::raw('quantity * unit_price as total_value'))
                    ->orderBy(DB::raw('quantity * unit_price'), 'desc')
                    ->limit(10)
                    ->get()
            ],
            'stockMovements' => [
                'lowStockItems' => InventoryItem::where('quantity', '<=', DB::raw('min_quantity'))
                    ->with('category')
                    ->limit(10)
                    ->get(['id', 'name', 'quantity', 'min_quantity', 'category_id']),
                'recentUpdates' => InventoryItem::orderBy('updated_at', 'desc')
                    ->limit(10)
                    ->get(['id', 'name', 'quantity', 'updated_at'])
            ]
        ];

        return response()->json($reports);
    }

    public function sales()
    {
        $reports = [
            'salesPerformance' => [
                'monthlySales' => Transaction::select(
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('YEAR(created_at) as year'),
                    DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as revenue')
                )
                    ->where('type', 'income')
                    ->whereYear('created_at', now()->year)
                    ->groupBy('year', 'month')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get(),
                'topProducts' => InventoryItem::select('name', 'quantity', 'unit_price')
                    ->orderBy('quantity', 'desc')
                    ->limit(10)
                    ->get()
            ],
            'customerAnalysis' => [
                'topCustomers' => Transaction::select('customers.name as customer', DB::raw('SUM(amount) as total_spent'))
                    ->join('customers', 'transactions.customer_id', '=', 'customers.id')
                    ->where('type', 'income')
                    ->groupBy('customers.id', 'customers.name')
                    ->orderBy('total_spent', 'desc')
                    ->limit(10)
                    ->get()
            ]
        ];

        return response()->json($reports);
    }
}
