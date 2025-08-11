"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  ArrowLeft,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  FileText,
  UserPlus,
  Settings,
  BarChart3,
  Calendar,
  MapPin,
  Star,
  Award,
  Target,
  Lightbulb,
  Zap,
  Shield,
  Heart,
  Brain,
  Briefcase,
  Globe,
  Video,
  Headphones,
  Monitor,
  Book,
  Certificate
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

export default function TrainingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const trainingPrograms = [
    {
      id: "1",
      title: "Leadership Development Program",
      description: "Comprehensive leadership training for managers",
      category: "leadership",
      duration: 40,
      trainer: "Dr. Sarah Johnson",
      status: "upcoming",
      participants: 15,
      maxParticipants: 20
    },
    {
      id: "2",
      title: "Advanced Excel Skills",
      description: "Master Excel for data analysis",
      category: "technical",
      duration: 16,
      trainer: "Mike Chen",
      status: "ongoing",
      participants: 12,
      maxParticipants: 15
    },
    {
      id: "3",
      title: "Communication Skills Workshop",
      description: "Improve interpersonal communication",
      category: "soft_skills",
      duration: 8,
      trainer: "Lisa Wilson",
      status: "completed",
      participants: 22,
      maxParticipants: 25
    }
  ]

  const trainers = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialization: ["Leadership", "Management"],
      experience: 15,
      rating: 4.8,
      totalCourses: 45
    },
    {
      id: "2",
      name: "Mike Chen",
      specialization: ["Technical Skills", "Data Analysis"],
      experience: 8,
      rating: 4.6,
      totalCourses: 32
    },
    {
      id: "3",
      name: "Lisa Wilson",
      specialization: ["Communication", "Soft Skills"],
      experience: 12,
      rating: 4.7,
      totalCourses: 38
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "leadership":
        return "bg-blue-100 text-blue-800"
      case "technical":
        return "bg-green-100 text-green-800"
      case "soft_skills":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-0">
        <Header />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/hr')}
                    className="text-slate-600 hover:text-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Training Management</h1>
                    <p className="text-slate-600">Training programs, trainers, and staff development</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Program
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="programs">Training Programs</TabsTrigger>
                <TabsTrigger value="trainers">Trainers</TabsTrigger>
                <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Programs</p>
                          <p className="text-2xl font-bold text-slate-900">{trainingPrograms.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <GraduationCap className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Active Programs</p>
                          <p className="text-2xl font-bold text-green-600">
                            {trainingPrograms.filter(p => p.status === 'ongoing').length}
                          </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Trainers</p>
                          <p className="text-2xl font-bold text-purple-600">{trainers.length}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Participants</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {trainingPrograms.reduce((sum, p) => sum + p.participants, 0)}
                          </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg">
                          <UserPlus className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Training Programs List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Recent Training Programs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trainingPrograms.map((program) => (
                          <div key={program.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{program.title}</p>
                              <p className="text-sm text-slate-600">{program.trainer}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{program.participants}/{program.maxParticipants}</p>
                              <Badge className={getStatusColor(program.status)}>
                                {program.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Top Trainers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trainers.map((trainer) => (
                          <div key={trainer.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{trainer.name}</p>
                              <p className="text-sm text-slate-600">{trainer.specialization.join(', ')}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{trainer.rating}/5.0</span>
                              </div>
                              <p className="text-sm text-slate-600">{trainer.totalCourses} courses</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="programs" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {trainingPrograms.map((program) => (
                    <Card key={program.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{program.title}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">{program.description}</p>
                          </div>
                          <Badge className={getStatusColor(program.status)}>
                            {program.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(program.category)}>
                            {program.category.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Trainer</p>
                            <p className="font-medium">{program.trainer}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Duration</p>
                            <p className="font-medium">{program.duration} hours</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Participants</p>
                            <p className="font-medium">{program.participants}/{program.maxParticipants}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trainers" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainers.map((trainer) => (
                    <Card key={trainer.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mx-auto mb-3">
                            {trainer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <h3 className="font-semibold text-slate-900">{trainer.name}</h3>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Experience:</span>
                            <span className="font-medium">{trainer.experience} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{trainer.rating}/5.0</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Courses:</span>
                            <span className="font-medium">{trainer.totalCourses}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm text-slate-600 mb-2">Specializations:</p>
                          <div className="flex flex-wrap gap-1">
                            {trainer.specialization.map((spec, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="enrollments" className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Training Enrollments</h2>
                  <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Enrollment Management</h3>
                    <p className="text-slate-500">Track and manage employee training enrollments</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
