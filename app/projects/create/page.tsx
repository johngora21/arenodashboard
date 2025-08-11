"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, Save, Plus, Users, Calendar, DollarSign, Target, 
  AlertTriangle, FileText, UserPlus, XCircle, BarChart3, Activity, Search
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface TeamMember {
  id: string
  name: string
  role: string
  tasks: string[]
  department: string
  skills: string[]
}

interface ProjectTask {
  id: string
  name: string
  description: string
  assignedTo: string
  startDate: string
  endDate: string
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface ProjectRole {
  id: string
  title: string
  responsibilities: string[]
}

interface ProjectForm {
  name: string
  description: string
  objectives: string[]
  scope: string
  department: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  startDate: string
  endDate: string
  budget: number
  manager: string
  projectRoles: ProjectRole[]
  teamMembers: TeamMember[]
  tasks: ProjectTask[]
  client?: string
  risks: Risk[]
  milestones: Milestone[]
  successCriteria: string[]
}

interface Risk {
  id: string
  description: string
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  mitigation: string
}

interface Milestone {
  id: string
  name: string
  date: string
  description: string
}

export default function CreateProjectPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [teamSearchTerm, setTeamSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [formData, setFormData] = useState<ProjectForm>({
    name: "",
    description: "",
    objectives: [""],
    scope: "",
    department: "",
    priority: "medium",
    startDate: "",
    endDate: "",
    budget: 0,
    manager: "",
    projectRoles: [],
    teamMembers: [],
    tasks: [],
    client: "",
    risks: [],
    milestones: [],
    successCriteria: [""]
  })

  const departments = ["IT", "Logistics", "Finance", "HR", "Sales", "Marketing", "Operations"]
  const priorities = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" }
  ]

  const mockTeamMembers = [
    { id: "1", name: "John Doe", role: "Senior Developer", department: "IT", skills: ["React", "Node.js"] },
    { id: "2", name: "Sarah Johnson", role: "Project Manager", department: "IT", skills: ["Project Management", "Agile"] },
    { id: "3", name: "Mike Wilson", role: "Backend Developer", department: "IT", skills: ["Java", "Spring Boot"] },
    { id: "4", name: "Lisa Chen", role: "UI/UX Designer", department: "IT", skills: ["Figma", "Adobe XD"] },
    { id: "5", name: "Alex Kim", role: "QA Engineer", department: "IT", skills: ["Testing", "Automation"] },
    { id: "6", name: "Emily Davis", role: "DevOps Engineer", department: "IT", skills: ["Docker", "Kubernetes"] }
  ]

  const availableRoles = [
    "Project Manager", "Senior Developer", "Backend Developer", "Frontend Developer", 
    "UI/UX Designer", "QA Engineer", "DevOps Engineer", "Business Analyst", 
    "Data Analyst", "Technical Lead", "Scrum Master", "Product Owner"
  ]

  const taskTemplates = [
    "Requirements Analysis", "System Design", "Database Design", "API Development", 
    "Frontend Development", "Backend Development", "UI/UX Design", "Testing", 
    "Deployment", "Documentation", "Code Review", "Performance Optimization"
  ]

  const mockManagers = [
    { id: "1", name: "Sarah Johnson", department: "IT" },
    { id: "2", name: "David Brown", department: "Logistics" },
    { id: "3", name: "Lisa Chen", department: "Finance" }
  ]

  const handleInputChange = (field: keyof ProjectForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: keyof ProjectForm, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof ProjectForm] as string[]).map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: keyof ProjectForm) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof ProjectForm] as string[]), ""]
    }))
  }

  const removeArrayItem = (field: keyof ProjectForm, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof ProjectForm] as string[]).filter((_, i) => i !== index)
    }))
  }

  const addTeamMember = (member: any, role: string) => {
    const newTeamMember: TeamMember = {
      id: member.id,
      name: member.name,
      role: role,
      tasks: [],
      department: member.department,
      skills: member.skills
    }
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newTeamMember]
    }))
  }

  const removeTeamMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== memberId)
    }))
  }

  const updateTeamMemberRole = (memberId: string, role: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === memberId ? { ...member, role } : member
      )
    }))
  }

  const addTaskToMember = (memberId: string, task: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === memberId ? { ...member, tasks: [...member.tasks, task] } : member
      )
    }))
  }

  const removeTaskFromMember = (memberId: string, taskIndex: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === memberId ? { ...member, tasks: member.tasks.filter((_, i) => i !== taskIndex) } : member
      )
    }))
  }

  const addProjectTask = () => {
    const newTask: ProjectTask = {
      id: Date.now().toString(),
      name: "",
      description: "",
      assignedTo: "",
      startDate: "",
      endDate: "",
      status: "not_started",
      priority: "medium"
    }
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }))
  }

  const updateProjectTask = (taskId: string, field: keyof ProjectTask, value: any) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, [field]: value } : task
      )
    }))
  }

  const removeProjectTask = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }))
  }

  const addProjectRole = () => {
    const newRole: ProjectRole = {
      id: Date.now().toString(),
      title: "",
      responsibilities: [""]
    }
    setFormData(prev => ({
      ...prev,
      projectRoles: [...prev.projectRoles, newRole]
    }))
  }

  const updateProjectRole = (roleId: string, field: keyof ProjectRole, value: any) => {
    setFormData(prev => ({
      ...prev,
      projectRoles: prev.projectRoles.map(role => 
        role.id === roleId ? { ...role, [field]: value } : role
      )
    }))
  }

  const removeProjectRole = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      projectRoles: prev.projectRoles.filter(role => role.id !== roleId)
    }))
  }

  const updateRoleResponsibility = (roleId: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      projectRoles: prev.projectRoles.map(role => 
        role.id === roleId ? {
          ...role,
          responsibilities: role.responsibilities.map((resp, i) => i === index ? value : resp)
        } : role
      )
    }))
  }

  const addRoleResponsibility = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      projectRoles: prev.projectRoles.map(role => 
        role.id === roleId ? {
          ...role,
          responsibilities: [...role.responsibilities, ""]
        } : role
      )
    }))
  }

  const removeRoleResponsibility = (roleId: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      projectRoles: prev.projectRoles.map(role => 
        role.id === roleId ? {
          ...role,
          responsibilities: role.responsibilities.filter((_, i) => i !== index)
        } : role
      )
    }))
  }

  const addRisk = () => {
    const newRisk: Risk = {
      id: Date.now().toString(),
      description: "",
      probability: "medium",
      impact: "medium",
      mitigation: ""
    }
    setFormData(prev => ({ ...prev, risks: [...prev.risks, newRisk] }))
  }

  const updateRisk = (index: number, field: keyof Risk, value: string) => {
    setFormData(prev => ({
      ...prev,
      risks: prev.risks.map((risk, i) => i === index ? { ...risk, [field]: value } : risk)
    }))
  }

  const removeRisk = (index: number) => {
    setFormData(prev => ({
      ...prev,
      risks: prev.risks.filter((_, i) => i !== index)
    }))
  }

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      name: "",
      date: "",
      description: ""
    }
    setFormData(prev => ({ ...prev, milestones: [...prev.milestones, newMilestone] }))
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => i === index ? { ...milestone, [field]: value } : milestone)
    }))
  }

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.description || !formData.department) {
      alert("Please fill in all required fields")
      return
    }
    
    console.log("Creating project:", formData)
    // Here you would typically save to database
    alert("Project created successfully!")
    router.push("/projects")
  }

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData)
    // Here you would typically save draft to database
    alert("Draft saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          <div className="mb-8">
            <div className="flex flex-col gap-4">
              {/* Back Button */}
              <div className="flex justify-start">
                <Button variant="ghost" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </div>
              
              {/* Page Title and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Project</h1>
                  <p className="text-slate-600 mt-1 text-base">Set up a comprehensive project with all necessary details</p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" className="bg-white hover:bg-slate-50" onClick={handleSaveDraft}>
                    <FileText className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSubmit}>
                    <Save className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="flow">Project Flow</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Project Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Project Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter project name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe the project objectives and goals"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Priority *</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>{priority.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Client (Optional)</label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => handleInputChange("client", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter client name"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Project Scope & Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Project Scope *</label>
                      <textarea
                        value={formData.scope}
                        onChange={(e) => handleInputChange("scope", e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Define the project scope and boundaries"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Objectives</label>
                      {formData.objectives.map((objective, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={objective}
                            onChange={(e) => handleArrayChange("objectives", index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter objective"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("objectives", index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addArrayItem("objectives")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Objective
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Success Criteria</label>
                      {formData.successCriteria.map((criterion, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={criterion}
                            onChange={(e) => handleArrayChange("successCriteria", index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter success criterion"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("successCriteria", index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addArrayItem("successCriteria")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Success Criterion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <div className="space-y-6">
                {/* Step 1: Define Project Roles */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Step 1: Define Project Roles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">First, define the roles needed for this project</p>
                        <Button variant="outline" size="sm" onClick={addProjectRole}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Role
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {formData.projectRoles.map((role) => (
                          <div key={role.id} className="p-4 border rounded-lg bg-slate-50">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-slate-900">{role.title || "New Role"}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeProjectRole(role.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Role Title</label>
                                <input
                                  type="text"
                                  value={role.title}
                                  onChange={(e) => updateProjectRole(role.id, "title", e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="e.g., Senior Developer, Project Manager"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Key Responsibilities</label>
                                <div className="space-y-2">
                                  {role.responsibilities.map((responsibility, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={responsibility}
                                        onChange={(e) => updateRoleResponsibility(role.id, index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter responsibility"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeRoleResponsibility(role.id, index)}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addRoleResponsibility(role.id)}
                                    className="w-full"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Responsibility
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {formData.projectRoles.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-slate-500">No roles defined yet</p>
                            <p className="text-sm text-slate-400">Add project roles to continue</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2: Assign Team Members */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Step 2: Assign Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Available Team Members</h3>
                        
                        {/* Search and Filter Controls */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                          <div className="flex-1">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search team members..."
                                value={teamSearchTerm}
                                onChange={(e) => setTeamSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                          </div>
                          <div className="sm:w-48">
                            <select
                              value={selectedDepartment}
                              onChange={(e) => setSelectedDepartment(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">All Departments</option>
                              {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {mockTeamMembers
                            .filter(member => {
                              const matchesSearch = member.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
                                                   member.skills.some(skill => skill.toLowerCase().includes(teamSearchTerm.toLowerCase()))
                              const matchesDepartment = !selectedDepartment || member.department === selectedDepartment
                              return matchesSearch && matchesDepartment
                            })
                            .map((member) => {
                              const isSelected = formData.teamMembers.some(tm => tm.id === member.id)
                              
                              return (
                                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <p className="font-medium text-slate-900">{member.name}</p>
                                    <p className="text-sm text-slate-600">{member.department}</p>
                                    <div className="flex gap-1 mt-1">
                                      {member.skills.slice(0, 2).map((skill, index) => (
                                        <Badge key={index} className="text-xs bg-blue-100 text-blue-800">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {!isSelected ? (
                                    <div className="flex gap-2">
                                      <select
                                        className="px-2 py-1 text-sm border rounded"
                                        onChange={(e) => {
                                          const selectedRole = formData.projectRoles.find(r => r.id === e.target.value)
                                          if (selectedRole) {
                                            addTeamMember(member, selectedRole.title)
                                          }
                                        }}
                                        defaultValue=""
                                      >
                                        <option value="" disabled>Select Role</option>
                                        {formData.projectRoles.map(role => (
                                          <option key={role.id} value={role.id}>{role.title}</option>
                                        ))}
                                      </select>
                                    </div>
                                  ) : (
                                    <Badge className="bg-green-100 text-green-800">Added</Badge>
                                  )}
                                </div>
                              )
                            })}
                          
                          {/* No results message */}
                          {mockTeamMembers.filter(member => {
                            const matchesSearch = member.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
                                                 member.skills.some(skill => skill.toLowerCase().includes(teamSearchTerm.toLowerCase()))
                            const matchesDepartment = !selectedDepartment || member.department === selectedDepartment
                            return matchesSearch && matchesDepartment
                          }).length === 0 && (
                            <div className="text-center py-8">
                              <p className="text-slate-500">No team members found</p>
                              <p className="text-sm text-slate-400">Try adjusting your search or department filter</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Assigned Team Members</h3>
                        <div className="space-y-3">
                          {formData.teamMembers.map((member) => (
                            <div key={member.id} className="border rounded-lg p-4 bg-blue-50">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-slate-900">{member.name}</h4>
                                  <p className="text-sm text-slate-600">{member.department} • {member.role}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeTeamMember(member.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-medium text-slate-700">Detailed Tasks</h5>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addTaskToMember(member.id, "")}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Task
                                  </Button>
                                </div>
                                
                                <div className="space-y-2">
                                  {member.tasks.map((task, index) => (
                                    <div key={index} className="p-2 bg-white rounded border">
                                      <textarea
                                        value={task}
                                        onChange={(e) => {
                                          const newTasks = [...member.tasks]
                                          newTasks[index] = e.target.value
                                          setFormData(prev => ({
                                            ...prev,
                                            teamMembers: prev.teamMembers.map(tm => 
                                              tm.id === member.id ? { ...tm, tasks: newTasks } : tm
                                            )
                                          }))
                                        }}
                                        rows={2}
                                        className="w-full px-2 py-1 text-sm border rounded resize-none"
                                        placeholder="Write detailed task description..."
                                      />
                                      <div className="flex justify-end mt-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeTaskFromMember(member.id, index)}
                                        >
                                          <XCircle className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {member.tasks.length === 0 && (
                                    <p className="text-xs text-slate-500 text-center py-2">No tasks assigned</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {formData.teamMembers.length === 0 && (
                            <div className="text-center py-8">
                              <p className="text-slate-500">No team members assigned yet</p>
                              <p className="text-sm text-slate-400">Define roles first, then assign team members</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Project Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">End Date *</label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Project Duration</label>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        {formData.startDate && formData.endDate ? (
                          <p className="text-slate-600">
                            {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        ) : (
                          <p className="text-slate-500">Select start and end dates to see duration</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {formData.milestones.map((milestone, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-slate-900">Milestone {index + 1}</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeMilestone(index)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={milestone.name}
                              onChange={(e) => updateMilestone(index, "name", e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Milestone name"
                            />
                            <input
                              type="date"
                              value={milestone.date}
                              onChange={(e) => updateMilestone(index, "date", e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <textarea
                              value={milestone.description}
                              onChange={(e) => updateMilestone(index, "description", e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Milestone description"
                            />
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addMilestone}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Milestone
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Budget Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Total Budget (TZS) *</label>
                        <input
                          type="number"
                          value={formData.budget}
                          onChange={(e) => handleInputChange("budget", parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter budget amount"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Budget Breakdown</label>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span className="text-slate-600">Personnel</span>
                            <span className="font-medium">60%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span className="text-slate-600">Equipment</span>
                            <span className="font-medium">20%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span className="text-slate-600">Materials</span>
                            <span className="font-medium">15%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span className="text-slate-600">Contingency</span>
                            <span className="font-medium">5%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Budget Summary</label>
                        <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total Budget:</span>
                            <span className="font-semibold">TZS {formData.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Personnel Cost:</span>
                            <span className="font-medium">TZS {(formData.budget * 0.6).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Equipment Cost:</span>
                            <span className="font-medium">TZS {(formData.budget * 0.2).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Materials Cost:</span>
                            <span className="font-medium">TZS {(formData.budget * 0.15).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Contingency:</span>
                            <span className="font-medium">TZS {(formData.budget * 0.05).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.risks.map((risk, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-900">Risk {index + 1}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeRisk(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Risk Description</label>
                            <textarea
                              value={risk.description}
                              onChange={(e) => updateRisk(index, "description", e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Describe the risk"
                            />
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Probability</label>
                              <select
                                value={risk.probability}
                                onChange={(e) => updateRisk(index, "probability", e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Impact</label>
                              <select
                                value={risk.impact}
                                onChange={(e) => updateRisk(index, "impact", e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Mitigation Strategy</label>
                          <textarea
                            value={risk.mitigation}
                            onChange={(e) => updateRisk(index, "mitigation", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe mitigation strategy"
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addRisk}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Risk
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flow" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Project Tasks & Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Project Tasks</h3>
                        <Button variant="outline" size="sm" onClick={addProjectTask}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.tasks.map((task) => (
                          <div key={task.id} className="p-4 border rounded-lg bg-slate-50">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-slate-900">{task.name || "New Task"}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeProjectTask(task.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Task Name</label>
                                <input
                                  type="text"
                                  value={task.name}
                                  onChange={(e) => updateProjectTask(task.id, "name", e.target.value)}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                  placeholder="Enter task name"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Assigned To</label>
                                <select
                                  value={task.assignedTo}
                                  onChange={(e) => updateProjectTask(task.id, "assignedTo", e.target.value)}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                >
                                  <option value="">Select Member</option>
                                  {formData.teamMembers.map(member => (
                                    <option key={member.id} value={member.name}>{member.name}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                                <input
                                  type="date"
                                  value={task.startDate}
                                  onChange={(e) => updateProjectTask(task.id, "startDate", e.target.value)}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                                <input
                                  type="date"
                                  value={task.endDate}
                                  onChange={(e) => updateProjectTask(task.id, "endDate", e.target.value)}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                                <select
                                  value={task.status}
                                  onChange={(e) => updateProjectTask(task.id, "status", e.target.value)}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                >
                                  <option value="not_started">Not Started</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                  <option value="on_hold">On Hold</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                                <select
                                  value={task.priority}
                                  onChange={(e) => updateProjectTask(task.id, "priority", e.target.value)}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                  <option value="critical">Critical</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                              <textarea
                                value={task.description}
                                onChange={(e) => updateProjectTask(task.id, "description", e.target.value)}
                                rows={2}
                                className="w-full px-2 py-1 text-sm border rounded"
                                placeholder="Task description"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {formData.tasks.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-slate-500">No tasks created yet</p>
                            <p className="text-sm text-slate-400">Add tasks to create your project timeline</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Gantt Chart Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-4">Project Timeline</h3>
                        
                        {formData.tasks.length > 0 ? (
                          <div className="space-y-3">
                            {formData.tasks.map((task) => {
                              const startDate = task.startDate ? new Date(task.startDate) : null
                              const endDate = task.endDate ? new Date(task.endDate) : null
                              const duration = startDate && endDate ? 
                                Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
                              
                              return (
                                <div key={task.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700">{task.name || "Unnamed Task"}</span>
                                    <span className="text-xs text-slate-500">{duration} days</span>
                                  </div>
                                  <div className="relative h-6 bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all ${
                                        task.status === 'completed' ? 'bg-green-500' :
                                        task.status === 'in_progress' ? 'bg-blue-500' :
                                        task.status === 'on_hold' ? 'bg-yellow-500' : 'bg-slate-400'
                                      }`}
                                      style={{ 
                                        width: `${Math.min(duration * 10, 100)}%`,
                                        minWidth: '20px'
                                      }}
                                    ></div>
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{task.startDate || "No start date"}</span>
                                    <span>{task.assignedTo || "Unassigned"}</span>
                                    <span>{task.endDate || "No end date"}</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-500">No timeline data</p>
                            <p className="text-sm text-slate-400">Add tasks to see the Gantt chart</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-slate-900 mb-2">Timeline Legend</h4>
                        <div className="flex gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-slate-400 rounded"></div>
                            <span>Not Started</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span>In Progress</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Completed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            <span>On Hold</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
