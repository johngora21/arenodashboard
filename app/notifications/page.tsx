"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Calendar, 
  DollarSign 
} from "lucide-react";
import { FilterIcon } from "@/components/ui/filter-icon";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
                <p className="text-slate-600 mt-1 text-base">Manage real-time notifications and alerts</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="bg-white hover:bg-slate-50">
                  <FilterIcon className="h-4 w-4 mr-2" /> Filter
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" /> New Alert
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="push">Push</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Notifications</p>
                        <p className="text-2xl font-bold text-slate-900">156</p>
                        <p className="text-xs text-green-600">+12 today</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Bell className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Unread</p>
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
                        <p className="text-sm font-medium text-slate-600">Email</p>
                        <p className="text-2xl font-bold text-slate-900">89</p>
                        <p className="text-xs text-green-600">57% of total</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">SMS</p>
                        <p className="text-2xl font-bold text-slate-900">45</p>
                        <p className="text-xs text-purple-600">29% of total</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${i === 1 ? "bg-red-500" : i === 2 ? "bg-blue-500" : i === 3 ? "bg-green-500" : "bg-yellow-500"}`}></div>
                            <div>
                              <p className="font-semibold">Notification {i}</p>
                              <p className="text-sm text-slate-600">
                                {i === 1 ? "System Alert" : i === 2 ? "Email Notification" : i === 3 ? "SMS Alert" : "Push Notification"}
                              </p>
                              <p className="text-xs text-slate-500">{i} minute{i > 1 ? "s" : ""} ago</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              i === 1 ? "bg-red-100 text-red-800" : 
                              i === 2 ? "bg-blue-100 text-blue-800" : 
                              i === 3 ? "bg-green-100 text-green-800" : 
                              "bg-yellow-100 text-yellow-800"
                            }>
                              {i === 1 ? "High" : i === 2 ? "Medium" : i === 3 ? "Low" : "Info"}
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
                        <span className="text-sm">New Alert</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <Mail className="h-6 w-6" />
                        <span className="text-sm">Email</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <MessageSquare className="h-6 w-6" />
                        <span className="text-sm">SMS</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col space-y-2">
                        <Smartphone className="h-6 w-6" />
                        <span className="text-sm">Push</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Email Notifications</CardTitle>
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
                          <div className={`w-4 h-4 rounded-full ${i % 3 === 0 ? "bg-green-500" : i % 3 === 1 ? "bg-blue-500" : "bg-yellow-500"}`}></div>
                          <div>
                            <p className="font-semibold">Email {i}</p>
                            <p className="text-sm text-slate-600">
                              {i % 3 === 0 ? "System Update" : i % 3 === 1 ? "User Activity" : "Security Alert"}
                            </p>
                            <p className="text-xs text-slate-500">Sent to user{i}@company.com • {i} hour{i > 1 ? "s" : ""} ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={
                            i % 3 === 0 ? "bg-green-100 text-green-800" : 
                            i % 3 === 1 ? "bg-blue-100 text-blue-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }>
                            {i % 3 === 0 ? "Sent" : i % 3 === 1 ? "Delivered" : "Pending"}
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

            <TabsContent value="sms" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>SMS Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">SMS Status</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Delivered</span>
                          </div>
                          <span className="font-semibold">32</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <span>Pending</span>
                          </div>
                          <span className="font-semibold">8</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span>Failed</span>
                          </div>
                          <span className="font-semibold">5</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button className="w-full" variant="outline">Send SMS</Button>
                        <Button className="w-full" variant="outline">Bulk SMS</Button>
                        <Button className="w-full" variant="outline">SMS Templates</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="push" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Push Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Push Status</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Sent</span>
                          </div>
                          <span className="font-semibold">45</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <span>Scheduled</span>
                          </div>
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span>Failed</span>
                          </div>
                          <span className="font-semibold">3</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Device Types</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="h-5 w-5 text-blue-600" />
                            <span>Mobile</span>
                          </div>
                          <span className="font-semibold">78</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Settings className="h-5 w-5 text-green-600" />
                            <span>Desktop</span>
                          </div>
                          <span className="font-semibold">34</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Settings className="h-5 w-5 text-purple-600" />
                            <span>Tablet</span>
                          </div>
                          <span className="font-semibold">12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Email Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>System Alerts</span>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>User Activity</span>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Security Alerts</span>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">SMS Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Emergency Alerts</span>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Daily Reports</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Disabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Weekly Summary</span>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Push Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Real-time Updates</span>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Marketing</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Disabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>News & Updates</span>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
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
  );
}
