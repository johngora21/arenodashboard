"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  UserCheck, 
  Users, 
  FileText, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Mail, 
  Video, 
  Phone 
} from "lucide-react"
import { FilterIcon } from "@/components/ui/filter-icon"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jobs & Recruitment</h1>
                <p className="text-slate-600 mt-1 text-base">Manage job postings, recruitment, and applications</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="bg-white hover:bg-slate-50">
                  <FilterIcon className="h-4 w-4 mr-2" /> Filter
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" /> Post Job
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="postings">Job Postings</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Active Jobs</p>
                        <p className="text-2xl font-bold text-slate-900">24</p>
                        <p className="text-xs text-green-600">+3 this week</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <UserCheck className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Applications</p>
                        <p className="text-2xl font-bold text-slate-900">156</p>
                        <p className="text-xs text-green-600">+12 today</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Interviews</p>
                        <p className="text-2xl font-bold text-slate-900">18</p>
                        <p className="text-xs text-orange-600">5 scheduled</p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Hired</p>
                        <p className="text-2xl font-bold text-slate-900">8</p>
                        <p className="text-xs text-green-600">This month</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              A{i}
                            </div>
                            <div>
                              <p className="font-semibold">Applicant {i}</p>
                              <p className="text-sm text-slate-600">Software Developer</p>
                              <p className="text-xs text-slate-500">Applied {i} hour{i > 1 ? "s" : ""} ago</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              i === 1 ? "bg-green-100 text-green-800" : 
                              i === 2 ? "bg-yellow-100 text-yellow-800" : 
                              i === 3 ? "bg-blue-100 text-blue-800" : 
                              "bg-red-100 text-red-800"
                            }>
                              {i === 1 ? "Shortlisted" : i === 2 ? "Under Review" : i === 3 ? "Interview" : "Rejected"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <Plus className="h-6 w-6" />
                        <span className="text-sm">Post Job</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <Users className="h-6 w-6" />
                        <span className="text-sm">Review Apps</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <Calendar className="h-6 w-6" />
                        <span className="text-sm">Schedule Interview</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <Mail className="h-6 w-6" />
                        <span className="text-sm">Send Offers</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="postings" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Job Postings</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FilterIcon className="h-4 w-4 mr-2" /> Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" /> Search
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full ${i % 3 === 0 ? "bg-green-500" : i % 3 === 1 ? "bg-yellow-500" : "bg-red-500"}`}></div>
                          <div>
                            <p className="font-semibold">Job {i}</p>
                            <p className="text-sm text-slate-600">
                              {i % 3 === 0 ? "Software Developer" : i % 3 === 1 ? "Marketing Manager" : "Sales Representative"}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />Dar es Salaam
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />TZS {i * 500}K
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />Full-time
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={
                            i % 3 === 0 ? "bg-green-100 text-green-800" : 
                            i % 3 === 1 ? "bg-yellow-100 text-yellow-800" : 
                            "bg-red-100 text-red-800"
                          }>
                            {i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Closed"}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Job Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Application Status</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <span>New</span>
                          </div>
                          <span className="font-semibold">45</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <span>Under Review</span>
                          </div>
                          <span className="font-semibold">23</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-orange-600" />
                            <span>Interview</span>
                          </div>
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Hired</span>
                          </div>
                          <span className="font-semibold">8</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button className="w-full" variant="outline">
                          Review Applications
                        </Button>
                        <Button className="w-full" variant="outline">
                          Send Rejections
                        </Button>
                        <Button className="w-full" variant="outline">
                          Schedule Interviews
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Application Sources</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Website</span>
                          <span className="font-medium">45%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Job Boards</span>
                          <span className="font-medium">35%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Referrals</span>
                          <span className="font-medium">20%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interviews" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Interview Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Interview Schedule</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-slate-600">Software Developer</p>
                            <p className="text-xs text-slate-500">Today, 2:00 PM</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Jane Smith</p>
                            <p className="text-sm text-slate-600">Marketing Manager</p>
                            <p className="text-xs text-slate-500">Tomorrow, 10:00 AM</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Mike Johnson</p>
                            <p className="text-sm text-slate-600">Sales Rep</p>
                            <p className="text-xs text-slate-500">Yesterday, 3:00 PM</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Interview Types</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Video className="h-5 w-5 text-blue-600" />
                            <span>Video Interview</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">8</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5 text-green-600" />
                            <span>In-Person</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">5</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-purple-600" />
                            <span>Phone Call</span>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">3</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recruitment" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Recruitment Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Pipeline Stages</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900">Applications</h4>
                          <p className="text-2xl font-bold text-blue-900">156</p>
                          <p className="text-sm text-blue-700">New applications</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-semibold text-yellow-900">Screening</h4>
                          <p className="text-2xl font-bold text-yellow-900">45</p>
                          <p className="text-sm text-yellow-700">Under review</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h4 className="font-semibold text-orange-900">Interview</h4>
                          <p className="text-2xl font-bold text-orange-900">18</p>
                          <p className="text-sm text-orange-700">Scheduled</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-900">Hired</h4>
                          <p className="text-2xl font-bold text-green-900">8</p>
                          <p className="text-sm text-green-700">Successful hires</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
