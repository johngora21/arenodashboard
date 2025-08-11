"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  ArrowLeft,
  Save,
  FileText,
  Download
} from "lucide-react"
import { FilterIcon } from "@/components/ui/filter-icon"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

export default function EventsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("calendar")
  const [showScheduleEvent, setShowScheduleEvent] = useState(false)
  const [showSubmitMeeting, setShowSubmitMeeting] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Events & Meetings</h1>
                <p className="text-slate-600 mt-1 text-base">Schedule events and submit meetings for admin review</p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setShowScheduleEvent(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Schedule Event
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white hover:bg-slate-50"
                  onClick={() => setShowSubmitMeeting(true)}
                >
                  <Upload className="h-4 w-4 mr-2" /> Submit Minutes
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="minutes">Minutes</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Events</p>
                        <p className="text-2xl font-bold text-slate-900">45</p>
                        <p className="text-xs text-green-600">+8 this month</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Today Events</p>
                        <p className="text-2xl font-bold text-slate-900">6</p>
                        <p className="text-xs text-green-600">2 upcoming</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Meetings</p>
                        <p className="text-2xl font-bold text-slate-900">23</p>
                        <p className="text-xs text-blue-600">This week</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Attendees</p>
                        <p className="text-2xl font-bold text-slate-900">156</p>
                        <p className="text-xs text-green-600">+12% attendance</p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Today Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${i === 1 ? "bg-red-500" : i === 2 ? "bg-blue-500" : "bg-green-500"}`}></div>
                            <div>
                              <p className="font-semibold">Event {i}</p>
                              <p className="text-sm text-slate-600">
                                {i === 1 ? "Team Meeting" : i === 2 ? "Client Call" : "Training Session"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {i === 1 ? "10:00 AM" : i === 2 ? "2:00 PM" : "4:00 PM"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              i === 1 ? "bg-red-100 text-red-800" : 
                              i === 2 ? "bg-blue-100 text-blue-800" : 
                              "bg-green-100 text-green-800"
                            }>
                              {i === 1 ? "In Progress" : i === 2 ? "Upcoming" : "Completed"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div>
                            <span className="font-medium">Daily Standup</span>
                            <p className="text-xs text-slate-600">9:00 AM - 9:15 AM</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Next</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div>
                            <span className="font-medium">Client Meeting</span>
                            <p className="text-xs text-slate-600">2:00 PM - 3:00 PM</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <div>
                            <span className="font-medium">Team Review</span>
                            <p className="text-xs text-slate-600">4:30 PM - 5:00 PM</p>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">Later</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Daily Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div>
                            <span className="font-medium">Daily Standup</span>
                            <p className="text-xs text-slate-600">9:00 AM • Team sync</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div>
                            <span className="font-medium">Team Check-in</span>
                            <p className="text-xs text-slate-600">11:00 AM • Updates</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <div>
                            <span className="font-medium">Client Update</span>
                            <p className="text-xs text-slate-600">2:00 PM • Communication</p>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Weekly Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <div>
                            <span className="font-medium">Weekly Team Meeting</span>
                            <p className="text-xs text-slate-600">Monday 10:00 AM</p>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Recurring</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <div>
                            <span className="font-medium">Project Review</span>
                            <p className="text-xs text-slate-600">Wednesday 2:00 PM</p>
                          </div>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-800">Recurring</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                          <div>
                            <span className="font-medium">Training Session</span>
                            <p className="text-xs text-slate-600">Friday 3:00 PM</p>
                          </div>
                        </div>
                        <Badge className="bg-teal-100 text-teal-800">Recurring</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Monthly Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Monthly All-Hands</h4>
                      <p className="text-sm text-slate-600 mb-2">Company-wide updates</p>
                      <p className="text-xs text-slate-500">First Monday 2:00 PM</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Board Meeting</h4>
                      <p className="text-sm text-slate-600 mb-2">Strategic decisions</p>
                      <p className="text-xs text-slate-500">Second Friday 10:00 AM</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Quarterly Review</h4>
                      <p className="text-sm text-slate-600 mb-2">Performance review</p>
                      <p className="text-xs text-slate-500">Third Wednesday 3:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

                        <TabsContent value="meetings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Submitted Minutes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Video className="h-5 w-5 text-blue-600" />
                          <div>
                            <span className="font-medium">Team Standup Minutes</span>
                            <p className="text-xs text-slate-600">Submitted by John Doe</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-green-600" />
                          <div>
                            <span className="font-medium">Client Call Minutes</span>
                            <p className="text-xs text-slate-600">Submitted by Jane Smith</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Approved</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-purple-600" />
                          <div>
                            <span className="font-medium">Project Review Minutes</span>
                            <p className="text-xs text-slate-600">Submitted by Mike Johnson</p>
                          </div>
                        </div>
                        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Meeting Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Approved</span>
                        </div>
                        <span className="font-semibold">18</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-orange-600" />
                          <span>Pending Review</span>
                        </div>
                        <span className="font-semibold">5</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span>Rejected</span>
                        </div>
                        <span className="font-semibold">2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="minutes" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Meeting Minutes Details</CardTitle>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <Input 
                          placeholder="Search minutes..." 
                          className="pl-10 pr-4 h-9 w-64 border-slate-200 focus:border-blue-500"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      >
                        <FilterIcon className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Daily Standup Minutes */}
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Video className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">Daily Standup Minutes</h3>
                              <p className="text-xs text-slate-600">John Doe</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Approved</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Date</span>
                              <span className="text-sm font-medium text-slate-900">March 15, 2024</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Time</span>
                              <span className="text-sm font-medium text-slate-900">9:00 AM - 9:15 AM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Attendees</span>
                              <span className="text-sm font-medium text-slate-900">3 people</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Status</span>
                              <span className="text-sm font-medium text-slate-900">Approved</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:bg-slate-50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Project Review Minutes */}
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">Project Review Minutes</h3>
                              <p className="text-xs text-slate-600">Jane Smith</p>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Date</span>
                              <span className="text-sm font-medium text-slate-900">March 14, 2024</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Time</span>
                              <span className="text-sm font-medium text-slate-900">2:00 PM - 3:30 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Attendees</span>
                              <span className="text-sm font-medium text-slate-900">3 people</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Status</span>
                              <span className="text-sm font-medium text-slate-900">Pending Review</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:bg-slate-50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Client Call Minutes */}
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Phone className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">Client Call Minutes</h3>
                              <p className="text-xs text-slate-600">Mike Johnson</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Approved</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Date</span>
                              <span className="text-sm font-medium text-slate-900">March 13, 2024</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Time</span>
                              <span className="text-sm font-medium text-slate-900">11:00 AM - 12:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Attendees</span>
                              <span className="text-sm font-medium text-slate-900">4 people</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Status</span>
                              <span className="text-sm font-medium text-slate-900">Approved</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:bg-slate-50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Team Meeting Minutes */}
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Users className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">Team Meeting Minutes</h3>
                              <p className="text-xs text-slate-600">Sarah Wilson</p>
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Date</span>
                              <span className="text-sm font-medium text-slate-900">March 12, 2024</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Time</span>
                              <span className="text-sm font-medium text-slate-900">3:00 PM - 4:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Attendees</span>
                              <span className="text-sm font-medium text-slate-900">5 people</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Status</span>
                              <span className="text-sm font-medium text-slate-900">Rejected</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:bg-slate-50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sprint Planning Minutes */}
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">Sprint Planning Minutes</h3>
                              <p className="text-xs text-slate-600">John Doe</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Approved</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Date</span>
                              <span className="text-sm font-medium text-slate-900">March 11, 2024</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Time</span>
                              <span className="text-sm font-medium text-slate-900">10:00 AM - 11:30 AM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Attendees</span>
                              <span className="text-sm font-medium text-slate-900">6 people</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Status</span>
                              <span className="text-sm font-medium text-slate-900">Approved</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:bg-slate-50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Schedule Event Dialog */}
          {showScheduleEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Schedule Event</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowScheduleEvent(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" placeholder="Enter event title" />
                  </div>
                  
                  <div>
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea id="event-description" placeholder="Enter event description" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date">Date</Label>
                      <Input id="event-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="event-time">Time</Label>
                      <Input id="event-time" type="time" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="event-location">Location</Label>
                    <Input id="event-location" placeholder="Enter location or meeting link" />
                  </div>
                  
                  <div>
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowScheduleEvent(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                      <Save className="h-4 w-4 mr-2" />
                      Schedule Event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Meeting Dialog */}
          {showSubmitMeeting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Submit Minutes for Review</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowSubmitMeeting(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meeting-title">Meeting Title</Label>
                    <Input id="meeting-title" placeholder="Enter meeting title" />
                  </div>
                  
                  <div>
                    <Label htmlFor="meeting-date">Meeting Date</Label>
                    <Input id="meeting-date" type="date" />
                  </div>
                  
                  <div>
                    <Label htmlFor="meeting-minutes">Meeting Minutes</Label>
                    <Textarea id="meeting-minutes" placeholder="Enter meeting minutes, key points, decisions, and action items" className="min-h-[120px]" />
                  </div>
                  
                  <div>
                    <Label htmlFor="meeting-attendees">Attendees</Label>
                    <Input id="meeting-attendees" placeholder="Enter attendee names" />
                  </div>
                  
                  <div>
                    <Label htmlFor="meeting-actions">Action Items</Label>
                    <Textarea id="meeting-actions" placeholder="List action items and responsible persons" />
                  </div>
                  
                  <div>
                    <Label htmlFor="meeting-next">Next Meeting</Label>
                    <Input id="meeting-next" placeholder="Date/time of next meeting (if applicable)" />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowSubmitMeeting(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Minutes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
