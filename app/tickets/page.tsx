"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Ticket, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  MessageSquare, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Settings, 
  Priority, 
  Calendar 
} from "lucide-react"
import { FilterIcon } from "@/components/ui/filter-icon"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Support Tickets</h1>
                <p className="text-slate-600 mt-1 text-base">Manage support tickets and issue tracking</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="bg-white hover:bg-slate-50">
                  <FilterIcon className="h-4 w-4 mr-2" /> Filter
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" /> New Ticket
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tickets">All Tickets</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Tickets</p>
                        <p className="text-2xl font-bold text-slate-900">156</p>
                        <p className="text-xs text-green-600">+12% from last week</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Ticket className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Open Tickets</p>
                        <p className="text-2xl font-bold text-slate-900">23</p>
                        <p className="text-xs text-orange-600">15% of total</p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Resolved</p>
                        <p className="text-2xl font-bold text-slate-900">89</p>
                        <p className="text-xs text-green-600">57% resolution rate</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Avg Response</p>
                        <p className="text-2xl font-bold text-slate-900">2.3h</p>
                        <p className="text-xs text-green-600">-15% improvement</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Recent Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${i === 1 ? "bg-red-500" : i === 2 ? "bg-orange-500" : i === 3 ? "bg-yellow-500" : "bg-green-500"}`}></div>
                            <div>
                              <p className="font-semibold">Ticket #{i}00{i}</p>
                              <p className="text-sm text-slate-600">Issue {i} description</p>
                              <p className="text-xs text-slate-500">Created {i} hour{i > 1 ? "s" : ""} ago</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              i === 1 ? "bg-red-100 text-red-800" : 
                              i === 2 ? "bg-orange-100 text-orange-800" : 
                              i === 3 ? "bg-yellow-100 text-yellow-800" : 
                              "bg-green-100 text-green-800"
                            }>
                              {i === 1 ? "High" : i === 2 ? "Medium" : i === 3 ? "Low" : "Resolved"}
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
                        <span className="text-sm">New Ticket</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <Search className="h-6 w-6" />
                        <span className="text-sm">Search</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <FilterIcon className="h-6 w-6" />
                        <span className="text-sm">Filter</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <Settings className="h-6 w-6" />
                        <span className="text-sm">Settings</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tickets" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Tickets</CardTitle>
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
                          <div className={`w-4 h-4 rounded-full ${i % 4 === 0 ? "bg-red-500" : i % 4 === 1 ? "bg-orange-500" : i % 4 === 2 ? "bg-yellow-500" : "bg-green-500"}`}></div>
                          <div>
                            <p className="font-semibold">Ticket #{i}00{i}</p>
                            <p className="text-sm text-slate-600">Issue {i} - Technical problem description</p>
                            <p className="text-xs text-slate-500">Created by User {i} • {i} hour{i > 1 ? "s" : ""} ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={
                            i % 4 === 0 ? "bg-red-100 text-red-800" : 
                            i % 4 === 1 ? "bg-orange-100 text-orange-800" : 
                            i % 4 === 2 ? "bg-yellow-100 text-yellow-800" : 
                            "bg-green-100 text-green-800"
                          }>
                            {i % 4 === 0 ? "High" : i % 4 === 1 ? "Medium" : i % 4 === 2 ? "Low" : "Resolved"}
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

            <TabsContent value="support" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Support Channels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                          <span>Live Chat</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-green-600" />
                          <span>Email Support</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-purple-600" />
                          <span>Phone Support</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Support Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              S{i}
                            </div>
                            <div>
                              <p className="font-medium">Support Agent {i}</p>
                              <p className="text-sm text-slate-600">Online</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{i * 5} tickets</p>
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="management" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Ticket Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Ticket Status</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Open</span>
                          <span className="font-semibold">23</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">In Progress</span>
                          <span className="font-semibold">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Pending</span>
                          <span className="font-semibold">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Resolved</span>
                          <span className="font-semibold">89</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Priority Levels</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">High</span>
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Medium</span>
                          <span className="font-semibold">25</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Low</span>
                          <span className="font-semibold">18</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button className="w-full" variant="outline">
                          Assign Tickets
                        </Button>
                        <Button className="w-full" variant="outline">
                          Update Status
                        </Button>
                        <Button className="w-full" variant="outline">
                          Generate Report
                        </Button>
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
