"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Users, 
  Bot, 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Image, 
  File, 
  Smile, 
  Paperclip, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Settings 
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function ChatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chat & Communication</h1>
                <p className="text-slate-600 mt-1 text-base">Real-time messaging and team communication</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="bg-white hover:bg-slate-50">
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" /> New Chat
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="chats" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="teams">Team Communication</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="chats" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Recent Chats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              U{i}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">User {i}</p>
                              <p className="text-sm text-slate-600">Last message {i} minutes ago</p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-green-100 text-green-800">Online</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card className="bg-white shadow-sm h-96">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            U1
                          </div>
                          <div>
                            <p className="font-semibold">User 1</p>
                            <p className="text-sm text-slate-600">Online</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 overflow-y-auto space-y-3 mb-4">
                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                            <p className="text-sm">Hello! How can I help you today?</p>
                            <p className="text-xs opacity-75 mt-1">10:30 AM</p>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-slate-100 p-3 rounded-lg max-w-xs">
                            <p className="text-sm">Hi! I need help with the new project.</p>
                            <p className="text-xs text-slate-500 mt-1">10:32 AM</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                            <p className="text-sm">Sure! What specific questions do you have?</p>
                            <p className="text-xs opacity-75 mt-1">10:33 AM</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <File className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="Type your message..." 
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                        </div>
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Team Channels</CardTitle>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium"># general</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium"># projects</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-medium"># announcements</span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm font-medium"># support</span>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              M{i}
                            </div>
                            <div>
                              <p className="text-sm font-medium">Member {i}</p>
                              <p className="text-xs text-slate-600">Online</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        <Video className="h-4 w-4 mr-2" /> Start Video Call
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Phone className="h-4 w-4 mr-2" /> Start Voice Call
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Users className="h-4 w-4 mr-2" /> Create Group
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Settings className="h-4 w-4 mr-2" /> Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>AI Assistant</CardTitle>
                        <p className="text-sm text-slate-600">Powered by advanced AI</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-purple-500 text-white p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Hello! I am your AI assistant. How can I help you today?</p>
                          <p className="text-xs opacity-75 mt-1">Just now</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-slate-100 p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Can you help me with project management?</p>
                          <p className="text-xs text-slate-500 mt-1">Just now</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-purple-500 text-white p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Of course! I can help you with project planning, task management, team coordination, and much more. What specific aspect would you like to focus on?</p>
                          <p className="text-xs opacity-75 mt-1">Just now</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                      <input 
                        type="text" 
                        placeholder="Ask AI assistant..." 
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      />
                      <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>AI Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Bot className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Smart Responses</p>
                          <p className="text-sm text-slate-600">Context-aware replies</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Auto Translation</p>
                          <p className="text-sm text-slate-600">Multi-language support</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Search className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Smart Search</p>
                          <p className="text-sm text-slate-600">Find messages quickly</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Settings className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium">Customizable</p>
                          <p className="text-sm text-slate-600">Personalize your experience</p>
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
  );
}
