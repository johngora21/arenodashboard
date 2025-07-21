import {
  Users,
  Building,
  DollarSign,
  Truck,
  Package,
  Car,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Share,
  Eye,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Map,
  Navigation,
  Compass,
  Target,
  Zap,
  Battery,
  Fuel,
  Route,
  Box,
  Palette,
  Home,
  Warehouse,
  Store,
  Factory
} from "lucide-react"

export interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: any
  fields: string[]
  defaultFilters: any
  availableFilters: string[]
  dataSources: string[]
  roles: string[] // Which roles can use this template
  requiredFields: string[] // Fields that must be filled
  optionalFields: string[] // Optional fields
  taskSpecific?: boolean // Whether this is for specific tasks
  clientSpecific?: boolean // Whether this requires client information
}

export const reportTemplates: ReportTemplate[] = [
  // Admin Templates (can create any report)
  {
    id: '1',
    name: 'Employee Performance Report',
    description: 'Comprehensive analysis of employee performance metrics including task completion, response times, and customer satisfaction',
    category: 'performance',
    icon: Users,
    fields: ['employee', 'department', 'period', 'metrics'],
    defaultFilters: { department: 'all', period: 'last_month' },
    availableFilters: ['employee', 'department', 'period', 'status'],
    dataSources: ['employees', 'shipments', 'transactions'],
    roles: ['admin', 'manager', 'supervisor'],
    requiredFields: ['employee', 'period'],
    optionalFields: ['department', 'metrics', 'comparison']
  },
  {
    id: '2',
    name: 'Department Performance Report',
    description: 'Department-wise performance and productivity analysis with revenue and project completion metrics',
    category: 'department',
    icon: Building,
    fields: ['department', 'period', 'metrics', 'comparison'],
    defaultFilters: { period: 'last_month' },
    availableFilters: ['department', 'period', 'comparison_type'],
    dataSources: ['departments', 'employees', 'shipments', 'transactions'],
    roles: ['admin', 'manager'],
    requiredFields: ['department', 'period'],
    optionalFields: ['metrics', 'comparison']
  },
  {
    id: '3',
    name: 'Financial Performance Report',
    description: 'Revenue, expenses, and profitability analysis with growth trends and projections',
    category: 'financial',
    icon: DollarSign,
    fields: ['period', 'category', 'comparison', 'projections'],
    defaultFilters: { period: 'last_quarter', category: 'all' },
    availableFilters: ['period', 'category', 'comparison_type', 'include_projections'],
    dataSources: ['transactions', 'shipments', 'customers'],
    roles: ['admin', 'finance_manager'],
    requiredFields: ['period'],
    optionalFields: ['category', 'comparison', 'projections']
  },
  {
    id: '4',
    name: 'Operational Efficiency Report',
    description: 'Logistics operations and delivery performance analysis with regional breakdowns',
    category: 'operational',
    icon: Truck,
    fields: ['region', 'service_type', 'period', 'metrics'],
    defaultFilters: { serviceType: 'all', period: 'last_month' },
    availableFilters: ['region', 'service_type', 'period', 'delivery_status'],
    dataSources: ['shipments', 'drivers', 'vehicles'],
    roles: ['admin', 'operations_manager', 'supervisor'],
    requiredFields: ['period'],
    optionalFields: ['region', 'service_type', 'metrics']
  },

  // Role-Specific Templates
  // Moving Service Templates
  {
    id: 'moving_task_report',
    name: 'Moving Service Task Report',
    description: 'Detailed report for moving service tasks including team details, materials used, and client feedback',
    category: 'task_specific',
    icon: Home,
    fields: [
      'task_id', 'client_name', 'team_members', 'materials_used', 'expenses',
      'items_moved', 'challenges', 'completeness', 'start_time', 'end_time',
      'client_complaints', 'notes', 'photos'
    ],
    defaultFilters: { service_type: 'moving' },
    availableFilters: ['task_id', 'client_name', 'team_members', 'date'],
    dataSources: ['tasks', 'clients', 'employees', 'materials'],
    roles: ['moving_manager', 'moving_supervisor', 'team_leader'],
    requiredFields: ['task_id', 'client_name', 'team_members', 'start_time', 'end_time'],
    optionalFields: ['materials_used', 'expenses', 'items_moved', 'challenges', 'client_complaints', 'notes', 'photos'],
    taskSpecific: true,
    clientSpecific: true
  },
  {
    id: 'moving_team_report',
    name: 'Moving Team Performance Report',
    description: 'Team performance analysis for moving services with efficiency metrics',
    category: 'performance',
    icon: Users,
    fields: ['team_id', 'period', 'tasks_completed', 'efficiency_metrics', 'client_satisfaction'],
    defaultFilters: { period: 'last_month' },
    availableFilters: ['team_id', 'period', 'efficiency_metric'],
    dataSources: ['teams', 'tasks', 'clients', 'feedback'],
    roles: ['moving_manager', 'moving_supervisor'],
    requiredFields: ['team_id', 'period'],
    optionalFields: ['tasks_completed', 'efficiency_metrics', 'client_satisfaction']
  },

  // Freight Service Templates
  {
    id: 'freight_task_report',
    name: 'Freight Service Task Report',
    description: 'Comprehensive freight service report including cargo details, route information, and delivery status',
    category: 'task_specific',
    icon: Package,
    fields: [
      'task_id', 'client_name', 'cargo_details', 'route_info', 'vehicle_used',
      'driver_details', 'expenses', 'delivery_status', 'challenges', 'start_time',
      'end_time', 'client_feedback', 'notes'
    ],
    defaultFilters: { service_type: 'freight' },
    availableFilters: ['task_id', 'client_name', 'driver', 'route'],
    dataSources: ['tasks', 'clients', 'drivers', 'vehicles', 'routes'],
    roles: ['freight_supervisor', 'freight_manager', 'logistics_coordinator'],
    requiredFields: ['task_id', 'client_name', 'cargo_details', 'start_time', 'end_time'],
    optionalFields: ['route_info', 'vehicle_used', 'driver_details', 'expenses', 'challenges', 'client_feedback', 'notes'],
    taskSpecific: true,
    clientSpecific: true
  },
  {
    id: 'freight_route_report',
    name: 'Freight Route Efficiency Report',
    description: 'Route efficiency analysis for freight services with cost and time optimization',
    category: 'operational',
    icon: Route,
    fields: ['route_id', 'period', 'efficiency_metrics', 'cost_analysis', 'time_optimization'],
    defaultFilters: { period: 'last_month' },
    availableFilters: ['route_id', 'period', 'efficiency_metric'],
    dataSources: ['routes', 'shipments', 'vehicles', 'drivers'],
    roles: ['freight_supervisor', 'freight_manager'],
    requiredFields: ['route_id', 'period'],
    optionalFields: ['efficiency_metrics', 'cost_analysis', 'time_optimization']
  },

  // Courier Service Templates
  {
    id: 'courier_task_report',
    name: 'Courier Service Task Report',
    description: 'Quick delivery report for courier services with package details and delivery confirmation',
    category: 'task_specific',
    icon: Package,
    fields: [
      'task_id', 'client_name', 'package_details', 'pickup_location', 'delivery_location',
      'courier_details', 'delivery_time', 'status', 'client_signature', 'notes'
    ],
    defaultFilters: { service_type: 'courier' },
    availableFilters: ['task_id', 'client_name', 'courier', 'status'],
    dataSources: ['tasks', 'clients', 'couriers', 'packages'],
    roles: ['courier_supervisor', 'courier_manager'],
    requiredFields: ['task_id', 'client_name', 'package_details', 'delivery_time'],
    optionalFields: ['pickup_location', 'delivery_location', 'courier_details', 'client_signature', 'notes'],
    taskSpecific: true,
    clientSpecific: true
  },

  // Driver Templates
  {
    id: 'driver_daily_report',
    name: 'Driver Daily Report',
    description: 'Daily activity report for drivers including routes, deliveries, fuel consumption, and vehicle status',
    category: 'operational',
    icon: Car,
    fields: [
      'driver_id', 'date', 'routes_completed', 'deliveries_made', 'fuel_consumed',
      'vehicle_status', 'issues_encountered', 'client_feedback', 'notes'
    ],
    defaultFilters: { date: 'today' },
    availableFilters: ['driver_id', 'date', 'route'],
    dataSources: ['drivers', 'routes', 'deliveries', 'vehicles'],
    roles: ['driver', 'driver_supervisor'],
    requiredFields: ['driver_id', 'date'],
    optionalFields: ['routes_completed', 'deliveries_made', 'fuel_consumed', 'vehicle_status', 'issues_encountered', 'client_feedback', 'notes']
  },
  {
    id: 'driver_vehicle_report',
    name: 'Driver Vehicle Maintenance Report',
    description: 'Vehicle maintenance and performance report for drivers',
    category: 'operational',
    icon: Wrench,
    fields: ['vehicle_id', 'driver_id', 'maintenance_issues', 'fuel_efficiency', 'performance_metrics'],
    defaultFilters: { period: 'last_month' },
    availableFilters: ['vehicle_id', 'driver_id', 'maintenance_type'],
    dataSources: ['vehicles', 'drivers', 'maintenance'],
    roles: ['driver', 'driver_supervisor', 'fleet_manager'],
    requiredFields: ['vehicle_id', 'driver_id'],
    optionalFields: ['maintenance_issues', 'fuel_efficiency', 'performance_metrics']
  },

  // Warehouse/Inventory Templates
  {
    id: 'warehouse_inventory_report',
    name: 'Warehouse Inventory Report',
    description: 'Inventory levels, stock movements, and warehouse efficiency analysis',
    category: 'operational',
    icon: Warehouse,
    fields: [
      'warehouse_id', 'inventory_levels', 'stock_movements', 'efficiency_metrics',
      'storage_utilization', 'issues', 'recommendations'
    ],
    defaultFilters: { period: 'last_month' },
    availableFilters: ['warehouse_id', 'inventory_type', 'period'],
    dataSources: ['warehouses', 'inventory', 'stock_movements'],
    roles: ['warehouse_manager', 'inventory_supervisor'],
    requiredFields: ['warehouse_id'],
    optionalFields: ['inventory_levels', 'stock_movements', 'efficiency_metrics', 'storage_utilization', 'issues', 'recommendations']
  },

  // Customer Service Templates
  {
    id: 'customer_service_report',
    name: 'Customer Service Report',
    description: 'Customer interactions, complaints, and satisfaction metrics',
    category: 'custom',
    icon: MessageSquare,
    fields: [
      'agent_id', 'period', 'interactions_handled', 'complaints_resolved',
      'satisfaction_scores', 'response_times', 'escalations'
    ],
    defaultFilters: { period: 'last_month' },
    availableFilters: ['agent_id', 'period', 'interaction_type'],
    dataSources: ['agents', 'interactions', 'feedback'],
    roles: ['customer_service_manager', 'customer_service_supervisor'],
    requiredFields: ['agent_id', 'period'],
    optionalFields: ['interactions_handled', 'complaints_resolved', 'satisfaction_scores', 'response_times', 'escalations']
  },

  // General Templates (for all roles)
  {
    id: 'general_task_report',
    name: 'General Task Report',
    description: 'Standard task report template for any service or role',
    category: 'task_specific',
    icon: Clipboard,
    fields: [
      'task_id', 'task_type', 'client_name', 'team_members', 'start_time', 'end_time',
      'materials_used', 'expenses', 'challenges', 'completeness', 'client_feedback', 'notes'
    ],
    defaultFilters: {},
    availableFilters: ['task_id', 'task_type', 'client_name', 'date'],
    dataSources: ['tasks', 'clients', 'employees'],
    roles: ['admin', 'manager', 'supervisor', 'team_leader'],
    requiredFields: ['task_id', 'task_type', 'start_time', 'end_time'],
    optionalFields: ['client_name', 'team_members', 'materials_used', 'expenses', 'challenges', 'completeness', 'client_feedback', 'notes'],
    taskSpecific: true,
    clientSpecific: true
  }
]

export const getTemplatesByCategory = (category: string) => {
  return reportTemplates.filter(template => template.category === category)
}

export const getTemplateById = (id: string) => {
  return reportTemplates.find(template => template.id === id)
}

export const getTemplatesByRole = (role: string) => {
  return reportTemplates.filter(template => template.roles.includes(role))
}

export const getAvailableFilters = (templateId: string) => {
  const template = getTemplateById(templateId)
  return template?.availableFilters || []
}

export const getDataSources = (templateId: string) => {
  const template = getTemplateById(templateId)
  return template?.dataSources || []
}

export const getRequiredFields = (templateId: string) => {
  const template = getTemplateById(templateId)
  return template?.requiredFields || []
}

export const getOptionalFields = (templateId: string) => {
  const template = getTemplateById(templateId)
  return template?.optionalFields || []
}

// Role definitions for better organization
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  TEAM_LEADER: 'team_leader',
  DRIVER: 'driver',
  DRIVER_SUPERVISOR: 'driver_supervisor',
  FLEET_MANAGER: 'fleet_manager',
  MOVING_MANAGER: 'moving_manager',
  MOVING_SUPERVISOR: 'moving_supervisor',
  FREIGHT_SUPERVISOR: 'freight_supervisor',
  FREIGHT_MANAGER: 'freight_manager',
  LOGISTICS_COORDINATOR: 'logistics_coordinator',
  COURIER_SUPERVISOR: 'courier_supervisor',
  COURIER_MANAGER: 'courier_manager',
  WAREHOUSE_MANAGER: 'warehouse_manager',
  INVENTORY_SUPERVISOR: 'inventory_supervisor',
  CUSTOMER_SERVICE_MANAGER: 'customer_service_manager',
  CUSTOMER_SERVICE_SUPERVISOR: 'customer_service_supervisor',
  FINANCE_MANAGER: 'finance_manager',
  OPERATIONS_MANAGER: 'operations_manager'
} 