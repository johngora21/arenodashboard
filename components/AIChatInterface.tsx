'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  FileText,
  Truck,
  Users,
  TrendingUp
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'shipment_analysis' | 'customer_support' | 'report_generation' | 'route_optimization';
}

interface AIChatInterfaceProps {
  className?: string;
}

export default function AIChatInterface({ className }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI logistics assistant. I can help you with shipment analysis, customer support, report generation, and route optimization. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    {
      title: 'Analyze Shipments',
      description: 'Get insights on shipment performance',
      icon: <Truck className="h-4 w-4" />,
      type: 'shipment_analysis' as const
    },
    {
      title: 'Customer Support',
      description: 'Generate support responses',
      icon: <Users className="h-4 w-4" />,
      type: 'customer_support' as const
    },
    {
      title: 'Generate Report',
      description: 'Create detailed reports',
      icon: <FileText className="h-4 w-4" />,
      type: 'report_generation' as const
    },
    {
      title: 'Optimize Routes',
      description: 'Get route optimization suggestions',
      icon: <TrendingUp className="h-4 w-4" />,
      type: 'route_optimization' as const
    }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string, type?: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: type as any
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type || 'customer_support',
          data: type === 'customer_support' ? { query: content } : { data: content },
          context: type
        }),
      });

      const result = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.success ? result.result : 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: type as any
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting. Please check your internet connection and try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    const message = `Please help me with ${action.title.toLowerCase()}.`;
    sendMessage(message, action.type);
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl">AI Logistics Assistant</CardTitle>
            <p className="text-blue-100 text-sm">Powered by ChatGPT</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Quick Actions */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-center gap-2 text-xs"
                onClick={() => handleQuickAction(action)}
                disabled={isLoading}
              >
                {action.icon}
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-gray-500 text-xs">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs opacity-70">
                        {message.sender === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      {message.type && (
                        <Badge variant="secondary" className="text-xs">
                          {message.type.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Form */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about logistics, shipments, or reports..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 