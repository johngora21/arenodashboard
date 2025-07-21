'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Users, 
  FileText, 
  Truck,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import AIChatInterface from '@/components/AIChatInterface';

export default function AIAssistantPage() {
  const features = [
    {
      icon: <Truck className="h-6 w-6 text-blue-600" />,
      title: 'Shipment Analysis',
      description: 'Get AI-powered insights on shipment performance, delays, and optimization opportunities.',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: 'Customer Support',
      description: 'Generate professional responses to customer inquiries and support requests.',
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      title: 'Report Generation',
      description: 'Create detailed reports with executive summaries and actionable recommendations.',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      title: 'Route Optimization',
      description: 'Get suggestions for optimizing delivery routes and reducing costs.',
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Instant Insights',
      description: 'Get immediate analysis and recommendations'
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Secure & Private',
      description: 'Your data stays protected and confidential'
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: '24/7 Availability',
      description: 'AI assistant available anytime you need help'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <div className="flex-1 lg:ml-0 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">AI Assistant</h1>
                  <p className="text-slate-600">Powered by ChatGPT for intelligent logistics management</p>
                </div>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI Powered
                </Badge>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card key={index} className={`border-2 ${feature.color} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {feature.icon}
                      <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Why Use AI Assistant?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">{benefit.title}</h3>
                      <p className="text-slate-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat Interface */}
            <AIChatInterface />
          </div>
        </main>
      </div>
    </div>
  );
} 