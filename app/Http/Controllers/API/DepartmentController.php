<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Branch;
use Illuminate\Support\Facades\DB;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Department::with(['branch', 'manager']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $departments = $query->get()->map(function ($department) {
            // Count employees in this department
            $employeeCount = Employee::where('department_id', $department->id)->count();
            
            return [
                'id' => $department->id,
                'name' => $department->name,
                'branchId' => $department->branch_id,
                'branchName' => $department->branch ? $department->branch->name : 'N/A',
                'code' => $department->code,
                'location' => $department->location,
                'description' => $department->description,
                'manager' => $department->manager ? $department->manager->name : 'N/A',
                'budget' => $department->budget ?? 0,
                'employeeCount' => $employeeCount,
                'status' => $department->status,
                'createdAt' => $department->created_at,
                'updatedAt' => $department->updated_at
            ];
        });

        return response()->json($departments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'branch_id' => 'required|exists:branches,id',
            'code' => 'required|string|max:10|unique:departments',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'manager_id' => 'nullable|exists:employees,id',
            'budget' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,inactive,restructuring'
        ]);

        $department = Department::create($request->all());

        return response()->json([
            'id' => $department->id,
            'message' => 'Department created successfully'
        ], 201);
    }

    public function show(string $id)
    {
        $department = Department::with(['branch', 'manager', 'employees'])->findOrFail($id);
        
        $employeeCount = $department->employees->count();
        
        return response()->json([
            'id' => $department->id,
            'name' => $department->name,
            'branchId' => $department->branch_id,
            'branchName' => $department->branch ? $department->branch->name : 'N/A',
            'code' => $department->code,
            'location' => $department->location,
            'description' => $department->description,
            'manager' => $department->manager ? $department->manager->name : 'N/A',
            'budget' => $department->budget ?? 0,
            'employeeCount' => $employeeCount,
            'status' => $department->status,
            'createdAt' => $department->created_at,
            'updatedAt' => $department->updated_at
        ]);
    }

    public function update(Request $request, string $id)
    {
        $department = Department::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'branch_id' => 'sometimes|required|exists:branches,id',
            'code' => 'sometimes|required|string|max:10|unique:departments,code,' . $id,
            'location' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'manager_id' => 'nullable|exists:employees,id',
            'budget' => 'nullable|numeric|min:0',
            'status' => 'sometimes|required|in:active,inactive,restructuring'
        ]);

        $department->update($request->all());

        return response()->json([
            'message' => 'Department updated successfully'
        ]);
    }

    public function destroy(string $id)
    {
        $department = Department::findOrFail($id);
        
        // Check if department has employees
        if ($department->employees()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete department with employees'
            ], 400);
        }

        $department->delete();

        return response()->json([
            'message' => 'Department deleted successfully'
        ]);
    }

    public function stats()
    {
        $stats = [
            'totalDepartments' => Department::count(),
            'activeDepartments' => Department::where('status', 'active')->count(),
            'totalEmployees' => Employee::count(),
            'averageBudget' => Department::where('status', 'active')->avg('budget') ?? 0,
            'departmentsByStatus' => [
                'active' => Department::where('status', 'active')->count(),
                'inactive' => Department::where('status', 'inactive')->count(),
                'restructuring' => Department::where('status', 'restructuring')->count()
            ],
            'departmentsByBranch' => Department::select('branches.name as branch_name', DB::raw('count(*) as count'))
                ->join('branches', 'departments.branch_id', '=', 'branches.id')
                ->groupBy('branches.id', 'branches.name')
                ->get(),
            'budgetDistribution' => Department::select('name', 'budget')
                ->where('status', 'active')
                ->orderBy('budget', 'desc')
                ->limit(10)
                ->get()
        ];

        return response()->json($stats);
    }
}
