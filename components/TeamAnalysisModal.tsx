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
  UserX,
  BarChart3,
  Target,
  Zap
} from 'lucide-react'
import { 
  getTeamMemberDetails, 
  getTeamMemberWorkload, 
  getTeamMemberPerformance, 
  getTeamMemberAvailability 
} from '../lib/firebase-service'

interface TeamAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  approvalData: any
}

export default function TeamAnalysisModal({ isOpen, onClose, approvalData }: TeamAnalysisModalProps) {
  const [teamAnalysis, setTeamAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && approvalData) {
      loadTeamAnalysis()
    }
  }, [isOpen, approvalData])

  const loadTeamAnalysis = async () => {
    if (!approvalData) return
    
    setLoading(true)
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      const analysis = {
        shipment: approvalData,
        teamMembers: {},
        currentMonth
      }

      // Analyze driver
      if (approvalData.teamData?.assignedDriver) {
        const driverDetails = await getTeamMemberDetails(approvalData.teamData.assignedDriver)
        const driverWorkload = await getTeamMemberWorkload(approvalData.teamData.assignedDriver, currentMonth)
        const driverPerformance = await getTeamMemberPerformance(approvalData.teamData.assignedDriver)
        const driverAvailability = await getTeamMemberAvailability(approvalData.teamData.assignedDriver)
        
        analysis.teamMembers.driver = {
          ...driverDetails,
          workload: driverWorkload,
          performance: driverPerformance,
          availability: driverAvailability
        }
      }

      // Analyze supervisor
      if (approvalData.teamData?.assignedSupervisor) {
        const supervisorDetails = await getTeamMemberDetails(approvalData.teamData.assignedSupervisor)
        const supervisorWorkload = await getTeamMemberWorkload(approvalData.teamData.assignedSupervisor, currentMonth)
        const supervisorPerformance = await getTeamMemberPerformance(approvalData.teamData.assignedSupervisor)
        const supervisorAvailability = await getTeamMemberAvailability(approvalData.teamData.assignedSupervisor)
        
        analysis.teamMembers.supervisor = {
          ...supervisorDetails,
          workload: supervisorWorkload,
          performance: supervisorPerformance,
          availability: supervisorAvailability
        }
      }

      // Analyze workers
      if (approvalData.teamData?.workerDetails?.length > 0) {
        analysis.teamMembers.workers = []
        
        for (const worker of approvalData.teamData.workerDetails) {
          const workerDetails = await getTeamMemberDetails(worker.id)
          const workerWorkload = await getTeamMemberWorkload(worker.id, currentMonth)
          const workerPerformance = await getTeamMemberPerformance(worker.id)
          const workerAvailability = await getTeamMemberAvailability(worker.id)
          
          analysis.teamMembers.workers.push({
            ...workerDetails,
            workload: workerWorkload,
            performance: workerPerformance,
            availability: workerAvailability
          })
        }
      }

      setTeamAnalysis(analysis)
    } catch (error) {
      console.error('Error loading team analysis:', error)
    } finally {
      setLoading(false)
    }
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

  const renderMemberCard = (member: any, role: string) => {
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
                <p className="text-sm text-slate-600">{role} • {member.department}</p>
              </div>
            </div>
            <Badge className={getAvailabilityColor(member.availability?.availabilityStatus)}>
              {member.availability?.availabilityStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Workload Analysis */}
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
                  <span>Driver Roles:</span>
                  <span>{member.workload?.driverAssignments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Supervisor Roles:</span>
                  <span>{member.workload?.supervisorAssignments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Worker Roles:</span>
                  <span>{member.workload?.workerAssignments || 0}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
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

            {/* Availability Status */}
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
                    On leave until {member.availability?.leaveDetails?.endDate}
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
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comprehensive Team Analysis
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Analyzing team members...</span>
          </div>
        ) : teamAnalysis ? (
          <div className="space-y-6">
            {/* Shipment Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Shipment Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div><span className="font-medium">Tracking Number:</span> {approvalData.shipmentNumber}</div>
                    <div><span className="font-medium">Origin:</span> {approvalData.origin || 'N/A'}</div>
                    <div><span className="font-medium">Destination:</span> {approvalData.destination || 'N/A'}</div>
                    <div><span className="font-medium">Service Type:</span> {approvalData.serviceType || 'N/A'}</div>
                  </div>
                  <div className="space-y-2">
                    <div><span className="font-medium">Requested By:</span> {approvalData.requestedBy}</div>
                    <div><span className="font-medium">Request Date:</span> {approvalData.requestedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</div>
                    <div><span className="font-medium">Team Size:</span> {
                      (approvalData.teamData?.assignedDriver ? 1 : 0) + 
                      (approvalData.teamData?.assignedSupervisor ? 1 : 0) + 
                      (approvalData.teamData?.workerDetails?.length || 0)
                    } members</div>
                  </div>
                </div>
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
                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {teamAnalysis.teamMembers.driver ? 1 : 0}
                            </div>
                            <div className="text-sm text-slate-600">Driver</div>
                            {teamAnalysis.teamMembers.driver && (
                              <Badge className={`mt-2 ${getAvailabilityColor(teamAnalysis.teamMembers.driver.availability?.availabilityStatus)}`}>
                                {teamAnalysis.teamMembers.driver.availability?.availabilityStatus}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {teamAnalysis.teamMembers.supervisor ? 1 : 0}
                            </div>
                            <div className="text-sm text-slate-600">Supervisor</div>
                            {teamAnalysis.teamMembers.supervisor && (
                              <Badge className={`mt-2 ${getAvailabilityColor(teamAnalysis.teamMembers.supervisor.availability?.availabilityStatus)}`}>
                                {teamAnalysis.teamMembers.supervisor.availability?.availabilityStatus}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {teamAnalysis.teamMembers.workers?.length || 0}
                            </div>
                            <div className="text-sm text-slate-600">Workers</div>
                            {teamAnalysis.teamMembers.workers?.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {teamAnalysis.teamMembers.workers.map((worker: any, index: number) => (
                                  <Badge key={index} className={`text-xs ${getAvailabilityColor(worker.availability?.availabilityStatus)}`}>
                                    {worker.availability?.availabilityStatus}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {teamAnalysis.currentMonth}
                            </div>
                            <div className="text-sm text-slate-600">Analysis Period</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Workload Distribution */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Workload Distribution Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Available Members:</span>
                          <div className="text-xs text-slate-600 mt-1">
                            {[
                              teamAnalysis.teamMembers.driver,
                              teamAnalysis.teamMembers.supervisor,
                              ...(teamAnalysis.teamMembers.workers || [])
                            ].filter(member => member?.availability?.isAvailable).length} out of {
                              [teamAnalysis.teamMembers.driver, teamAnalysis.teamMembers.supervisor, ...(teamAnalysis.teamMembers.workers || [])].filter(Boolean).length
                            } members
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Average Monthly Assignments:</span>
                          <div className="text-xs text-slate-600 mt-1">
                            {(() => {
                              const members = [teamAnalysis.teamMembers.driver, teamAnalysis.teamMembers.supervisor, ...(teamAnalysis.teamMembers.workers || [])].filter(Boolean)
                              const totalAssignments = members.reduce((sum, member) => sum + (member?.workload?.totalAssignments || 0), 0)
                              return `${(totalAssignments / members.length).toFixed(1)} per member`
                            })()}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Performance Rating:</span>
                          <div className="text-xs text-slate-600 mt-1">
                            {(() => {
                              const members = [teamAnalysis.teamMembers.driver, teamAnalysis.teamMembers.supervisor, ...(teamAnalysis.teamMembers.workers || [])].filter(Boolean)
                              const avgRating = members.reduce((sum, member) => sum + (member?.performance?.averageRating || 0), 0) / members.length
                              return `${avgRating.toFixed(1)}/5.0 average`
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="driver">
                    {teamAnalysis.teamMembers.driver ? (
                      renderMemberCard(teamAnalysis.teamMembers.driver, 'Driver')
                    ) : (
                      <div className="text-center py-8 text-slate-500">No driver assigned</div>
                    )}
                  </TabsContent>

                  <TabsContent value="supervisor">
                    {teamAnalysis.teamMembers.supervisor ? (
                      renderMemberCard(teamAnalysis.teamMembers.supervisor, 'Supervisor')
                    ) : (
                      <div className="text-center py-8 text-slate-500">No supervisor assigned</div>
                    )}
                  </TabsContent>

                  <TabsContent value="workers">
                    {teamAnalysis.teamMembers.workers?.length > 0 ? (
                      <div className="space-y-4">
                        {teamAnalysis.teamMembers.workers.map((worker: any) => 
                          renderMemberCard(worker, 'Worker')
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">No workers assigned</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  HR Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
                    const recommendations = []
                    const members = [teamAnalysis.teamMembers.driver, teamAnalysis.teamMembers.supervisor, ...(teamAnalysis.teamMembers.workers || [])].filter(Boolean)
                    
                    // Check availability
                    const unavailableMembers = members.filter(member => !member?.availability?.isAvailable)
                    if (unavailableMembers.length > 0) {
                      recommendations.push({
                        type: 'warning',
                        message: `${unavailableMembers.length} team member(s) are currently unavailable. Consider reassigning.`
                      })
                    }
                    
                    // Check workload
                    const overloadedMembers = members.filter(member => (member?.workload?.totalAssignments || 0) > 6)
                    if (overloadedMembers.length > 0) {
                      recommendations.push({
                        type: 'warning',
                        message: `${overloadedMembers.length} team member(s) have high workload (${overloadedMembers.map(m => m.workload.totalAssignments).join(', ')} assignments this month).`
                      })
                    }
                    
                    // Check performance
                    const lowPerformers = members.filter(member => (member?.performance?.averageRating || 0) < 3.5)
                    if (lowPerformers.length > 0) {
                      recommendations.push({
                        type: 'warning',
                        message: `${lowPerformers.length} team member(s) have below-average performance ratings.`
                      })
                    }
                    
                    if (recommendations.length === 0) {
                      recommendations.push({
                        type: 'success',
                        message: 'Team composition looks good! All members are available and have reasonable workload.'
                      })
                    }
                    
                    return recommendations
                  })().map((rec, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      rec.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {rec.type === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        <span className="text-sm">{rec.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            Failed to load team analysis
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 