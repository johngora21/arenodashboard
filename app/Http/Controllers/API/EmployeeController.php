<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Position;
use App\Models\Branch;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['department', 'position', 'branch']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('employee_id', 'like', '%' . $request->search . '%');
        }

        // Department filter
        if ($request->has('department_id') && $request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $employees = $query->get()->map(function ($employee) {
            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->email,
                'employeeId' => $employee->employee_id,
                'phone' => $employee->phone,
                'department' => $employee->department ? $employee->department->name : 'N/A',
                'position' => $employee->position ? $employee->position->name : 'N/A',
                'branch' => $employee->branch ? $employee->branch->name : 'N/A',
                'hireDate' => $employee->hire_date,
                'salary' => $employee->salary,
                'status' => $employee->status,
                'avatar' => $employee->avatar,
                'createdAt' => $employee->created_at,
                'updatedAt' => $employee->updated_at
            ];
        });

        return response()->json($employees);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees',
            'employee_id' => 'required|string|unique:employees',
            'phone' => 'required|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'branch_id' => 'required|exists:branches,id',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive,terminated,on_leave'
        ]);

        $employee = Employee::create($request->all());

        return response()->json([
            'id' => $employee->id,
            'message' => 'Employee created successfully'
        ], 201);
    }

    public function show(string $id)
    {
        $employee = Employee::with(['department', 'position', 'branch'])->findOrFail($id);
        
        return response()->json([
            'id' => $employee->id,
            'name' => $employee->name,
            'email' => $employee->email,
            'employeeId' => $employee->employee_id,
            'phone' => $employee->phone,
            'department' => $employee->department ? $employee->department->name : 'N/A',
            'position' => $employee->position ? $employee->position->name : 'N/A',
            'branch' => $employee->branch ? $employee->branch->name : 'N/A',
            'hireDate' => $employee->hire_date,
            'salary' => $employee->salary,
            'status' => $employee->status,
            'avatar' => $employee->avatar,
            'createdAt' => $employee->created_at,
            'updatedAt' => $employee->updated_at
        ]);
    }

    public function update(Request $request, string $id)
    {
        $employee = Employee::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:employees,email,' . $id,
            'employee_id' => 'sometimes|required|string|unique:employees,employee_id,' . $id,
            'phone' => 'sometimes|required|string|max:20',
            'department_id' => 'sometimes|required|exists:departments,id',
            'position_id' => 'sometimes|required|exists:positions,id',
            'branch_id' => 'sometimes|required|exists:branches,id',
            'hire_date' => 'sometimes|required|date',
            'salary' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:active,inactive,terminated,on_leave'
        ]);

        $employee->update($request->all());

        return response()->json([
            'message' => 'Employee updated successfully'
        ]);
    }

    public function destroy(string $id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return response()->json([
            'message' => 'Employee deleted successfully'
        ]);
    }

    public function stats()
    {
        $stats = [
            'totalEmployees' => Employee::count(),
            'activeEmployees' => Employee::where('status', 'active')->count(),
            'employeesByDepartment' => Employee::select('departments.name as department_name', DB::raw('count(*) as count'))
                ->join('departments', 'employees.department_id', '=', 'departments.id')
                ->groupBy('departments.id', 'departments.name')
                ->get(),
            'employeesByPosition' => Employee::select('positions.name as position_name', DB::raw('count(*) as count'))
                ->join('positions', 'employees.position_id', '=', 'positions.id')
                ->groupBy('positions.id', 'positions.name')
                ->get(),
            'employeesByStatus' => [
                'active' => Employee::where('status', 'active')->count(),
                'inactive' => Employee::where('status', 'inactive')->count(),
                'terminated' => Employee::where('status', 'terminated')->count(),
                'on_leave' => Employee::where('status', 'on_leave')->count()
            ],
            'salaryStats' => [
                'average' => Employee::where('status', 'active')->avg('salary') ?? 0,
                'min' => Employee::where('status', 'active')->min('salary') ?? 0,
                'max' => Employee::where('status', 'active')->max('salary') ?? 0
            ],
            'hireDateDistribution' => Employee::select(
                DB::raw('YEAR(hire_date) as year'),
                DB::raw('count(*) as count')
            )
                ->groupBy('year')
                ->orderBy('year', 'desc')
                ->limit(5)
                ->get()
        ];

        return response()->json($stats);
    }
}
