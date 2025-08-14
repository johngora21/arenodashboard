<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ApprovalRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ApprovalController extends Controller
{
    public function index(Request $request)
    {
        $query = ApprovalRequest::with(['requester', 'approver']);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Filter by requester
        if ($request->has('requester_id') && $request->requester_id) {
            $query->where('requester_id', $request->requester_id);
        }

        $approvals = $query->orderBy('created_at', 'desc')->get()->map(function ($approval) {
            return [
                'id' => $approval->id,
                'type' => $approval->type,
                'title' => $approval->title,
                'description' => $approval->description,
                'requester' => $approval->requester ? $approval->requester->name : 'N/A',
                'approver' => $approval->approver ? $approval->approver->name : 'N/A',
                'status' => $approval->status,
                'priority' => $approval->priority,
                'requestedAt' => $approval->created_at,
                'approvedAt' => $approval->approved_at,
                'notes' => $approval->notes
            ];
        });

        return response()->json($approvals);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'approver_id' => 'required|exists:users,id',
            'priority' => 'required|in:low,medium,high,critical',
            'notes' => 'nullable|string'
        ]);

        $approval = ApprovalRequest::create([
            'type' => $request->type,
            'title' => $request->title,
            'description' => $request->description,
            'requester_id' => Auth::id(),
            'approver_id' => $request->approver_id,
            'priority' => $request->priority,
            'status' => 'pending',
            'notes' => $request->notes
        ]);

        return response()->json([
            'id' => $approval->id,
            'message' => 'Approval request created successfully'
        ], 201);
    }

    public function show(string $id)
    {
        $approval = ApprovalRequest::with(['requester', 'approver'])->findOrFail($id);
        
        return response()->json([
            'id' => $approval->id,
            'type' => $approval->type,
            'title' => $approval->title,
            'description' => $approval->description,
            'requester' => $approval->requester ? $approval->requester->name : 'N/A',
            'approver' => $approval->approver ? $approval->approver->name : 'N/A',
            'status' => $approval->status,
            'priority' => $approval->priority,
            'requestedAt' => $approval->created_at,
            'approvedAt' => $approval->approved_at,
            'notes' => $approval->notes
        ]);
    }

    public function update(Request $request, string $id)
    {
        $approval = ApprovalRequest::findOrFail($id);
        
        // Only approver can update status
        if (Auth::id() !== $approval->approver_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'notes' => 'nullable|string'
        ]);

        $approval->update([
            'status' => $request->status,
            'notes' => $request->notes,
            'approved_at' => $request->status !== 'pending' ? now() : null
        ]);

        return response()->json([
            'message' => 'Approval request updated successfully'
        ]);
    }

    public function destroy(string $id)
    {
        $approval = ApprovalRequest::findOrFail($id);
        
        // Only requester can delete their own request if it's still pending
        if (Auth::id() !== $approval->requester_id || $approval->status !== 'pending') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $approval->delete();

        return response()->json([
            'message' => 'Approval request deleted successfully'
        ]);
    }
}
