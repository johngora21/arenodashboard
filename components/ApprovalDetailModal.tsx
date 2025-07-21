import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Users, 
  Truck, 
  User, 
  Calendar, 
  MapPin, 
  Package, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Clock4,
  UserCheck,
  UserX
} from 'lucide-react'
import { getEnhancedApprovalData } from '../lib/firebase-service'

interface ApprovalDetailModalProps {
  isOpen: boolean
  onClose: () => void
  approvalId: string | null
  onApprove: (approvalId: string) => void
  onReject: (approvalId: string) => void
}

export default function ApprovalDetailModal({ 
  isOpen, 
  onClose, 
  approvalId, 
  onApprove, 
  onReject 
}: ApprovalDetailModalProps) {
  const [approvalData, setApprovalData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && approvalId) {
      loadApprovalData()
    }
  }, [isOpen, approvalId])

  const loadApprovalData = async () => {
    if (!approvalId) return
    
    setLoading(true)
    try {
      const data = await getEnhancedApprovalData(approvalId)
      setApprovalData(data)
    } catch (error) {
      console.error('Error loading approval data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date instanceof Date ? date : date.toDate()
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'Currently Assigned':
        return 'bg-yellow-100 text-yellow-800'
      case 'On Leave':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getWorkloadColor = (assignments: number) => {
    if (assignments <= 3) return 'text-green-600'
    if (assignments <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const renderTeamMemberCard = (member: any, role: string) => {
    if (!member) return null

    return (
      <Card key={member.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <p className="text-sm text-slate-600">{role}</p>
              </div>
            </div>
            <Badge className={getAvailabilityColor(member.availability?.availabilityStatus)}>
              {member.availability?.availabilityStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Workload */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Workload (This Month)
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Assignments:</span>
                  <span className={getWorkloadColor(member.workload?.totalAssignments)}>
                    {member.workload?.totalAssignments || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Driver:</span>
                  <span>{member.workload?.driverAssignments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Supervisor:</span>
                  <span>{member.workload?.supervisorAssignments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Worker:</span>
                  <span>{member.workload?.workerAssignments || 0}</span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Star className="h-4 w-4" />
                Performance (3 Months)
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Average Rating:</span>
                  <span className={getPerformanceColor(member.performance?.averageRating)}>
                    {member.performance?.averageRating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tasks Completed:</span>
                  <span>{member.performance?.completedTasks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>On-Time Delivery:</span>
                  <span>{(member.performance?.onTimeDelivery * 100)?.toFixed(0) || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Satisfaction:</span>
                  <span>{(member.performance?.customerSatisfaction * 100)?.toFixed(0) || 0}%</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Current Status
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className={member.availability?.isAvailable ? 'text-green-600' : 'text-red-600'}>
                    {member.availability?.isAvailable ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Assignments:</span>
                  <span>{member.availability?.currentAssignments || 0}</span>
                </div>
                {member.availability?.isOnLeave && (
                  <div className="text-red-600 text-xs">
                    On leave until {formatDate(member.availability?.leaveDetails?.endDate)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Team Assignment Approval Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading approval details...</span>
          </div>
        ) : approvalData ? (
          <div className="space-y-6">
            {/* Shipment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Shipment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {approvalData.enhancedData?.shipmentDetails ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div><span className="font-medium">Tracking Number:</span> {approvalData.shipmentNumber}</div>
                      <div><span className="font-medium">Origin:</span> {approvalData.enhancedData.shipmentDetails.origin}</div>
                      <div><span className="font-medium">Destination:</span> {approvalData.enhancedData.shipmentDetails.destination}</div>
                      <div><span className="font-medium">Service Type:</span> {approvalData.enhancedData.shipmentDetails.serviceType}</div>
                    </div>
                    <div className="space-y-2">
                      <div><span className="font-medium">Created:</span> {formatDate(approvalData.enhancedData.shipmentDetails.createdAt)}</div>
                      <div><span className="font-medium">Status:</span> {approvalData.enhancedData.shipmentDetails.status}</div>
                      <div><span className="font-medium">Priority:</span> {approvalData.enhancedData.shipmentDetails.priority}</div>
                      <div><span className="font-medium">Requested By:</span> {approvalData.requestedBy}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500">Shipment details not available</div>
                )}
              </CardContent>
            </Card>

            {/* Team Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Member Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="driver">Driver</TabsTrigger>
                    <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
                    <TabsTrigger value="workers">Workers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Summary Stats */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {approvalData.enhancedData?.memberDetails?.driver ? 1 : 0}
                            </div>
                            <div className="text-sm text-slate-600">Driver</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {approvalData.enhancedData?.memberDetails?.supervisor ? 1 : 0}
                            </div>
                            <div className="text-sm text-slate-600">Supervisor</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {approvalData.enhancedData?.memberDetails?.workers?.length || 0}
                            </div>
                            <div className="text-sm text-slate-600">Workers</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Availability Summary */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Availability Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <span>Available: {approvalData.enhancedData?.memberDetails?.driver?.availability?.isAvailable ? 1 : 0} + {approvalData.enhancedData?.memberDetails?.supervisor?.availability?.isAvailable ? 1 : 0} + {approvalData.enhancedData?.memberDetails?.workers?.filter((w: any) => w.availability?.isAvailable).length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserX className="h-4 w-4 text-red-600" />
                          <span>Unavailable: {approvalData.enhancedData?.memberDetails?.driver?.availability?.isAvailable ? 0 : 1} + {approvalData.enhancedData?.memberDetails?.supervisor?.availability?.isAvailable ? 0 : 1} + {approvalData.enhancedData?.memberDetails?.workers?.filter((w: any) => !w.availability?.isAvailable).length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock4 className="h-4 w-4 text-yellow-600" />
                          <span>On Leave: {approvalData.enhancedData?.memberDetails?.driver?.availability?.isOnLeave ? 1 : 0} + {approvalData.enhancedData?.memberDetails?.supervisor?.availability?.isOnLeave ? 1 : 0} + {approvalData.enhancedData?.memberDetails?.workers?.filter((w: any) => w.availability?.isOnLeave).length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="driver">
                    {approvalData.enhancedData?.memberDetails?.driver ? (
                      renderTeamMemberCard(approvalData.enhancedData.memberDetails.driver, 'Driver')
                    ) : (
                      <div className="text-center py-8 text-slate-500">No driver assigned</div>
                    )}
                  </TabsContent>

                  <TabsContent value="supervisor">
                    {approvalData.enhancedData?.memberDetails?.supervisor ? (
                      renderTeamMemberCard(approvalData.enhancedData.memberDetails.supervisor, 'Supervisor')
                    ) : (
                      <div className="text-center py-8 text-slate-500">No supervisor assigned</div>
                    )}
                  </TabsContent>

                  <TabsContent value="workers">
                    {approvalData.enhancedData?.memberDetails?.workers?.length > 0 ? (
                      <div className="space-y-4">
                        {approvalData.enhancedData.memberDetails.workers.map((worker: any) => 
                          renderTeamMemberCard(worker, 'Worker')
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">No workers assigned</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Approval Actions */}
            {approvalData.status === 'pending' && (
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  onClick={() => onReject(approvalData.id)}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => onApprove(approvalData.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            Failed to load approval details
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 