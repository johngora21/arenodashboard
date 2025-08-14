<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InventoryItem;
use App\Models\InventoryCategory;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::with(['category', 'supplier']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Category filter
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $items = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'sku' => $item->sku,
                'category' => $item->category ? $item->category->name : 'N/A',
                'description' => $item->description,
                'supplier' => $item->supplier ? $item->supplier->name : 'N/A',
                'unit' => $item->unit,
                'quantity' => $item->quantity,
                'minQuantity' => $item->min_quantity,
                'maxQuantity' => $item->max_quantity,
                'unitPrice' => $item->unit_price,
                'location' => $item->location,
                'status' => $item->status,
                'lastUpdated' => $item->updated_at
            ];
        });

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:inventory_items',
            'category_id' => 'required|exists:inventory_categories,id',
            'description' => 'nullable|string',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'unit' => 'required|string|max:50',
            'quantity' => 'required|integer|min:0',
            'min_quantity' => 'required|integer|min:0',
            'max_quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'status' => 'required|in:in_stock,low_stock,out_of_stock,discontinued'
        ]);

        $item = InventoryItem::create($request->all());

        return response()->json([
            'id' => $item->id,
            'message' => 'Inventory item created successfully'
        ], 201);
    }

    public function show(string $id)
    {
        $item = InventoryItem::with(['category', 'supplier'])->findOrFail($id);
        
        return response()->json([
            'id' => $item->id,
            'name' => $item->name,
            'sku' => $item->sku,
            'category' => $item->category ? $item->category->name : 'N/A',
            'description' => $item->description,
            'supplier' => $item->supplier ? $item->supplier->name : 'N/A',
            'unit' => $item->unit,
            'quantity' => $item->quantity,
            'minQuantity' => $item->min_quantity,
            'maxQuantity' => $item->max_quantity,
            'unitPrice' => $item->unit_price,
            'location' => $item->location,
            'status' => $item->status,
            'lastUpdated' => $item->updated_at
        ]);
    }

    public function update(Request $request, string $id)
    {
        $item = InventoryItem::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'sku' => 'sometimes|required|string|unique:inventory_items,sku,' . $id,
            'category_id' => 'sometimes|required|exists:inventory_categories,id',
            'description' => 'nullable|string',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'unit' => 'sometimes|required|string|max:50',
            'quantity' => 'sometimes|required|integer|min:0',
            'min_quantity' => 'sometimes|required|integer|min:0',
            'max_quantity' => 'sometimes|required|integer|min:0',
            'unit_price' => 'sometimes|required|numeric|min:0',
            'location' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|in:in_stock,low_stock,out_of_stock,discontinued'
        ]);

        $item->update($request->all());

        return response()->json([
            'message' => 'Inventory item updated successfully'
        ]);
    }

    public function destroy(string $id)
    {
        $item = InventoryItem::findOrFail($id);
        $item->delete();

        return response()->json([
            'message' => 'Inventory item deleted successfully'
        ]);
    }

    public function stats()
    {
        $stats = [
            'totalItems' => InventoryItem::count(),
            'totalValue' => InventoryItem::sum(DB::raw('quantity * unit_price')),
            'itemsByStatus' => [
                'in_stock' => InventoryItem::where('status', 'in_stock')->count(),
                'low_stock' => InventoryItem::where('status', 'low_stock')->count(),
                'out_of_stock' => InventoryItem::where('status', 'out_of_stock')->count(),
                'discontinued' => InventoryItem::where('status', 'discontinued')->count()
            ],
            'itemsByCategory' => InventoryItem::select('inventory_categories.name as category_name', DB::raw('count(*) as count'))
                ->join('inventory_categories', 'inventory_items.category_id', '=', 'inventory_categories.id')
                ->groupBy('inventory_categories.id', 'inventory_categories.name')
                ->get(),
            'lowStockItems' => InventoryItem::where('quantity', '<=', DB::raw('min_quantity'))
                ->with('category')
                ->limit(10)
                ->get(['id', 'name', 'quantity', 'min_quantity', 'category_id']),
            'topValueItems' => InventoryItem::select('name', 'quantity', 'unit_price', DB::raw('quantity * unit_price as total_value'))
                ->orderBy(DB::raw('quantity * unit_price'), 'desc')
                ->limit(10)
                ->get(),
            'categoryValueDistribution' => InventoryItem::select(
                'inventory_categories.name as category_name',
                DB::raw('SUM(inventory_items.quantity * inventory_items.unit_price) as total_value')
            )
                ->join('inventory_categories', 'inventory_items.category_id', '=', 'inventory_categories.id')
                ->groupBy('inventory_categories.id', 'inventory_categories.name')
                ->orderBy('total_value', 'desc')
                ->get()
        ];

        return response()->json($stats);
    }
}
