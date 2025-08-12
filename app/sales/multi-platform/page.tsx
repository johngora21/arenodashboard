'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Plus,
  Globe,
  Users,
  Mail,
  Phone,
  Building2,
  Target,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Image,
  Video,
  Clock,
  Share2,
  BarChart3,
  Brain,
  Activity,
  Smartphone
} from 'lucide-react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'

interface MultiPlatformCampaign {
  name: string
  description: string
  platforms: string[]
  content: string
  mediaType: 'text' | 'image' | 'video' | 'mixed'
  scheduledDate: string
  scheduledTime: string
  budget: number
  targetAudience: string
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  manager: string
  notes: string
  targetMarket: {
    demographics: Record<string, string[]>
    psychographics: Record<string, string[]>
    behavioral: Record<string, string[]>
    technographics: Record<string, string[]>
    business: Record<string, string[]>
  }
}

export default function MultiPlatformPostingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<MultiPlatformCampaign>({
    name: '',
    description: '',
    platforms: [],
    content: '',
    mediaType: 'text',
    scheduledDate: '',
    scheduledTime: '',
    budget: 0,
    targetAudience: '',
    status: 'draft',
    manager: '',
    notes: '',
    targetMarket: {
      demographics: {},
      psychographics: {},
      behavioral: {},
      technographics: {},
      business: {}
    }
  })

  const [aiOptimization, setAiOptimization] = useState({
    gpt4Content: false,
    claudeStrategy: false,
    googleTrends: false,
    metaOptimization: false,
    copilotRefinement: false,
    allAiIntegration: false
  })

  const [aiGeneratedContent, setAiGeneratedContent] = useState({
    gpt4Content: '',
    claudeStrategy: '',
    googleTrends: '',
    metaOptimization: '',
    copilotRefinement: '',
    finalOptimizedContent: '',
    suggestedHashtags: [],
    optimalTiming: '',
    viralScore: 0,
    engagementPrediction: 0,
    amplificationStrategy: '',
    aiInsights: []
  })

  const availablePlatforms = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: <Users className="h-4 w-4" />,
      color: 'text-blue-600',
      features: ['Text Posts', 'Images', 'Videos', 'Stories']
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: <Image className="h-4 w-4" />,
      color: 'text-pink-600',
      features: ['Posts', 'Stories', 'Reels', 'IGTV']
    },
    { 
      id: 'twitter', 
      name: 'Twitter/X', 
      icon: <Share2 className="h-4 w-4" />,
      color: 'text-black',
      features: ['Tweets', 'Threads', 'Images', 'Videos']
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: <Building2 className="h-4 w-4" />,
      color: 'text-blue-700',
      features: ['Posts', 'Articles', 'Images', 'Videos']
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: <Video className="h-4 w-4" />,
      color: 'text-red-600',
      features: ['Videos', 'Shorts', 'Live Streams']
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-black',
      features: ['Videos', 'Duets', 'Lives'],
      note: 'Manual posting required'
    }
  ]

  const targetAudiences = [
    'Technology Companies',
    'Manufacturing Companies',
    'Healthcare Organizations',
    'Financial Institutions',
    'Retail Businesses',
    'Educational Institutions',
    'Government Agencies',
    'Startups',
    'Enterprise Companies',
    'Small & Medium Businesses'
  ]

  // Comprehensive target market factors
  const targetMarketFactors = {
    demographics: {
      age: ['Gen Z (16-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Baby Boomers (57-75)', 'All Ages'],
      gender: ['Male', 'Female', 'All Genders'],
      income: ['Low Income', 'Middle Income', 'High Income', 'All Income Levels'],
      education: ['High School', 'College', 'Graduate', 'Professional', 'All Education Levels'],
      occupation: ['Students', 'Professionals', 'Entrepreneurs', 'Executives', 'Freelancers', 'All Occupations'],
      location: ['Urban', 'Suburban', 'Rural', 'All Locations']
    },
    psychographics: {
      lifestyle: ['Active/Health-conscious', 'Luxury-oriented', 'Minimalist', 'Tech-savvy', 'Traditional', 'All Lifestyles'],
      interests: ['Technology', 'Sports', 'Travel', 'Fashion', 'Food', 'Entertainment', 'Business', 'All Interests'],
      values: ['Environmental', 'Social Responsibility', 'Family-oriented', 'Career-focused', 'All Values'],
      personality: ['Extroverted', 'Introverted', 'Risk-takers', 'Conservative', 'All Personalities']
    },
    behavioral: {
      purchaseBehavior: ['Frequent Buyers', 'Occasional Buyers', 'First-time Buyers', 'All Buyers'],
      brandLoyalty: ['High Loyalty', 'Medium Loyalty', 'Low Loyalty', 'All Loyalty Levels'],
      usageRate: ['Heavy Users', 'Medium Users', 'Light Users', 'All Usage Levels'],
      benefitsSought: ['Quality', 'Price', 'Convenience', 'Status', 'All Benefits']
    },
    technographics: {
      techAdoption: ['Early Adopters', 'Mainstream', 'Late Adopters', 'All Adoption Levels'],
      deviceUsage: ['Mobile-first', 'Desktop-first', 'Multi-device', 'All Devices'],
      socialMedia: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'All Platforms'],
      onlineBehavior: ['Online Shoppers', 'Content Consumers', 'Social Media Active', 'All Online Behaviors']
    },
    business: {
      companySize: ['Startups (1-10)', 'Small (11-50)', 'Medium (51-200)', 'Large (201-1000)', 'Enterprise (1000+)', 'All Sizes'],
      industry: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'All Industries'],
      decisionRole: ['Decision Makers', 'Influencers', 'End Users', 'All Roles'],
      businessStage: ['Startup', 'Growth', 'Mature', 'All Stages']
    }
  }

  const managers = [
    'Sarah Johnson',
    'Mike Wilson',
    'Emma Davis',
    'David Brown',
    'Lisa Chen'
  ]

  const handlePlatformToggle = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const handleTargetMarketSelection = (category: string, factor: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      targetMarket: {
        ...prev.targetMarket,
        [category]: {
          ...prev.targetMarket[category as keyof typeof prev.targetMarket],
          [factor]: prev.targetMarket[category as keyof typeof prev.targetMarket][factor]?.includes(value)
            ? prev.targetMarket[category as keyof typeof prev.targetMarket][factor].filter(v => v !== value)
            : [...(prev.targetMarket[category as keyof typeof prev.targetMarket][factor] || []), value]
        }
      }
    }))
  }

  const isTargetMarketSelected = (category: string, factor: string, value: string) => {
    return formData.targetMarket[category as keyof typeof formData.targetMarket]?.[factor]?.includes(value) || false
  }

  const getSelectedTargetMarketCount = () => {
    let count = 0
    Object.values(formData.targetMarket).forEach(category => {
      Object.values(category).forEach(factors => {
        count += factors.length
      })
    })
    return count
  }



  const generateAiContent = () => {
    // Simulate AI content generation
    const optimizedContent = `🚀 Exciting news! We're revolutionizing the way businesses connect with their audience through AI-powered organic marketing.

Our innovative approach combines cutting-edge technology with human creativity to deliver results that outperform traditional paid advertising.

Key benefits:
✅ Higher engagement rates
✅ Better ROI than paid ads
✅ Authentic brand building
✅ Viral potential
✅ Long-term value

Ready to transform your marketing strategy? Let's connect! 💡

#AI #Marketing #Innovation #OrganicGrowth #DigitalMarketing #BusinessGrowth #Technology #FutureOfMarketing`
    
    setAiGeneratedContent({
      optimizedContent,
      suggestedHashtags: ['#AI', '#Marketing', '#Innovation', '#OrganicGrowth', '#DigitalMarketing'],
      optimalTiming: 'Today at 2:00 PM (Peak engagement time)',
      viralScore: 87,
      engagementPrediction: 92,
      amplificationStrategy: 'Cross-platform posting with influencer engagement and community building'
    })
  }

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleAiOptimization = async (type: string) => {
    // Simulate AI processing
    console.log(`AI optimizing: ${type}`)
    
    if (type === 'content') {
      const optimized = `🚀 ${formData.content}\n\n💡 Pro tip: This content is optimized for maximum engagement!\n\n#${formData.targetAudience.replace(/\s+/g, '')} #AIOptimized #ViralContent`
      setAiGeneratedContent(prev => ({ ...prev, optimizedContent: optimized }))
    }
    
    if (type === 'hashtags') {
      const hashtags = ['#ViralContent', '#Trending', '#Engagement', '#SocialMedia', '#DigitalMarketing']
      setAiGeneratedContent(prev => ({ ...prev, suggestedHashtags: hashtags }))
    }
    
    if (type === 'timing') {
      setAiGeneratedContent(prev => ({ ...prev, optimalTiming: 'Best time: 7-9 PM on weekdays' }))
    }
    
    if (type === 'viral') {
      const score = Math.floor(Math.random() * 40) + 60 // 60-100
      setAiGeneratedContent(prev => ({ ...prev, viralScore: score }))
    }
    
    if (type === 'engagement') {
      const prediction = Math.floor(Math.random() * 30) + 15 // 15-45%
      setAiGeneratedContent(prev => ({ ...prev, engagementPrediction: prediction }))
    }
    
    if (type === 'amplification') {
      const strategy = 'Cross-platform amplification: Start with LinkedIn for credibility, then amplify on Twitter for reach, and engage on Instagram for visual impact.'
      setAiGeneratedContent(prev => ({ ...prev, amplificationStrategy: strategy }))
    }
  }

  const toggleAiOptimization = (type: keyof typeof aiOptimization) => {
    setAiOptimization(prev => ({ ...prev, [type]: !prev[type] }))
    if (!aiOptimization[type]) {
      handleAiOptimization(type)
    }
  }

  const handleInputChange = (field: keyof MultiPlatformCampaign, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Multi-Platform Campaign Data:', formData)
    // Here you would typically make an API call to save the campaign
    router.push('/sales')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-4">
              {/* Back Button */}
              <div className="flex justify-start">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sales
                </Button>
              </div>
              
              {/* Page Title */}
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Multi-Platform Posting</h1>
                <p className="text-slate-600 mt-1 text-base">Create campaigns that post to multiple social media platforms simultaneously</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {/* Campaign Information */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-500" />
                  Campaign Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Q1 Product Launch Campaign"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Campaign Manager</Label>
                    <Select value={formData.manager} onValueChange={(value) => handleInputChange('manager', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager} value={manager}>
                            {manager}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Campaign Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the campaign objectives and target audience..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-green-500" />
                  Select Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePlatforms.map((platform) => (
                    <div
                      key={platform.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.platforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Checkbox
                          checked={formData.platforms.includes(platform.id)}
                          onChange={() => handlePlatformToggle(platform.id)}
                        />
                        <div className={`${platform.color}`}>
                          {platform.icon}
                        </div>
                        <span className="font-semibold">{platform.name}</span>
                      </div>
                      <div className="space-y-1">
                        {platform.features.map((feature, index) => (
                          <p key={index} className="text-xs text-slate-600">• {feature}</p>
                        ))}
                        {platform.note && (
                          <p className="text-xs text-orange-600 font-medium">{platform.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Creation */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Content Creation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                                 <div className="space-y-2">
                   <Label htmlFor="mediaType">Content Type</Label>
                   <Select value={formData.mediaType} onValueChange={(value) => handleInputChange('mediaType', value)}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="text">Text Only</SelectItem>
                       <SelectItem value="image">Image Post</SelectItem>
                       <SelectItem value="video">Video Post</SelectItem>
                       <SelectItem value="mixed">Mixed Media</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Campaign Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your campaign message here. Use #hashtags and @mentions as needed..."
                    rows={6}
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Character count: {formData.content.length} 
                    {formData.platforms.includes('twitter') && ` (Twitter limit: 280)`}
                  </p>
                </div>

                {(formData.mediaType === 'image' || formData.mediaType === 'video' || formData.mediaType === 'mixed') && (
                  <div className="space-y-2">
                    <Label>Media Upload</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {formData.mediaType === 'image' ? (
                          <Image className="h-8 w-8 text-slate-400" />
                        ) : (
                          <Video className="h-8 w-8 text-slate-400" />
                        )}
                        <p className="text-sm text-slate-600">
                          Click to upload {formData.mediaType === 'image' ? 'images' : 'videos'} or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">
                          Supported formats: {formData.mediaType === 'image' ? 'JPG, PNG, GIF' : 'MP4, MOV, AVI'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
                         </Card>

             {/* Target Market Selection */}
             <Card className="bg-white shadow-sm">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Target className="h-5 w-5 text-purple-500" />
                   Target Market Selection
                   {getSelectedTargetMarketCount() > 0 && (
                     <Badge variant="secondary" className="ml-2">
                       {getSelectedTargetMarketCount()} factors selected
                     </Badge>
                   )}
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* Demographics */}
                   <div className="space-y-4">
                     <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                       <Users className="h-4 w-4 text-blue-500" />
                       Demographics
                     </h4>
                     {Object.entries(targetMarketFactors.demographics).map(([factor, options]) => (
                       <div key={factor} className="space-y-2">
                         <Label className="text-sm font-medium capitalize">{factor.replace(/([A-Z])/g, ' $1')}</Label>
                         <div className="flex flex-wrap gap-2">
                           {options.map((option) => (
                             <Button
                               key={option}
                               variant={isTargetMarketSelected('demographics', factor, option) ? "default" : "outline"}
                               size="sm"
                               onClick={() => handleTargetMarketSelection('demographics', factor, option)}
                               className={isTargetMarketSelected('demographics', factor, option) ? "bg-blue-500 hover:bg-blue-600" : ""}
                             >
                               {option}
                             </Button>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Psychographics */}
                   <div className="space-y-4">
                     <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                       <Brain className="h-4 w-4 text-green-500" />
                       Psychographics
                     </h4>
                     {Object.entries(targetMarketFactors.psychographics).map(([factor, options]) => (
                       <div key={factor} className="space-y-2">
                         <Label className="text-sm font-medium capitalize">{factor.replace(/([A-Z])/g, ' $1')}</Label>
                         <div className="flex flex-wrap gap-2">
                           {options.map((option) => (
                             <Button
                               key={option}
                               variant={isTargetMarketSelected('psychographics', factor, option) ? "default" : "outline"}
                               size="sm"
                               onClick={() => handleTargetMarketSelection('psychographics', factor, option)}
                               className={isTargetMarketSelected('psychographics', factor, option) ? "bg-green-500 hover:bg-green-600" : ""}
                             >
                               {option}
                             </Button>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Behavioral */}
                   <div className="space-y-4">
                     <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                       <Activity className="h-4 w-4 text-orange-500" />
                       Behavioral
                     </h4>
                     {Object.entries(targetMarketFactors.behavioral).map(([factor, options]) => (
                       <div key={factor} className="space-y-2">
                         <Label className="text-sm font-medium capitalize">{factor.replace(/([A-Z])/g, ' $1')}</Label>
                         <div className="flex flex-wrap gap-2">
                           {options.map((option) => (
                             <Button
                               key={option}
                               variant={isTargetMarketSelected('behavioral', factor, option) ? "default" : "outline"}
                               size="sm"
                               onClick={() => handleTargetMarketSelection('behavioral', factor, option)}
                               className={isTargetMarketSelected('behavioral', factor, option) ? "bg-orange-500 hover:bg-orange-600" : ""}
                             >
                               {option}
                             </Button>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Technographics */}
                   <div className="space-y-4">
                     <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                       <Smartphone className="h-4 w-4 text-purple-500" />
                       Technographics
                     </h4>
                     {Object.entries(targetMarketFactors.technographics).map(([factor, options]) => (
                       <div key={factor} className="space-y-2">
                         <Label className="text-sm font-medium capitalize">{factor.replace(/([A-Z])/g, ' $1')}</Label>
                         <div className="flex flex-wrap gap-2">
                           {options.map((option) => (
                             <Button
                               key={option}
                               variant={isTargetMarketSelected('technographics', factor, option) ? "default" : "outline"}
                               size="sm"
                               onClick={() => handleTargetMarketSelection('technographics', factor, option)}
                               className={isTargetMarketSelected('technographics', factor, option) ? "bg-purple-500 hover:bg-purple-600" : ""}
                             >
                               {option}
                             </Button>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Business Factors */}
                 <div className="space-y-4">
                   <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                     <Building2 className="h-4 w-4 text-indigo-500" />
                     Business Factors
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {Object.entries(targetMarketFactors.business).map(([factor, options]) => (
                       <div key={factor} className="space-y-2">
                         <Label className="text-sm font-medium capitalize">{factor.replace(/([A-Z])/g, ' $1')}</Label>
                         <div className="flex flex-wrap gap-2">
                           {options.map((option) => (
                             <Button
                               key={option}
                               variant={isTargetMarketSelected('business', factor, option) ? "default" : "outline"}
                               size="sm"
                               onClick={() => handleTargetMarketSelection('business', factor, option)}
                               className={isTargetMarketSelected('business', factor, option) ? "bg-indigo-500 hover:bg-indigo-600" : ""}
                             >
                               {option}
                             </Button>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Target Market Summary */}
                 {getSelectedTargetMarketCount() > 0 && (
                   <div className="p-4 bg-blue-50 rounded-lg">
                     <h4 className="font-semibold text-blue-900 mb-2">Target Market Summary</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                       <div>
                         <p className="text-blue-600">Selected Factors</p>
                         <p className="font-semibold text-blue-900">{getSelectedTargetMarketCount()} factors across 5 categories</p>
                       </div>
                       <div>
                         <p className="text-blue-600">Estimated Reach</p>
                         <p className="font-semibold text-blue-900">
                           {Math.max(1000, getSelectedTargetMarketCount() * 2000)} - {Math.max(5000, getSelectedTargetMarketCount() * 5000)} users
                         </p>
                       </div>
                     </div>
                   </div>
                 )}
               </CardContent>
             </Card>

             {/* Scheduling & Budget */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Scheduling & Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Post Date</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Post Time</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Campaign Budget (TZS)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                      placeholder="0"
                    />
                    {formData.budget > 0 && (
                      <p className="text-sm text-slate-500">{formatCurrency(formData.budget)}</p>
                    )}
                  </div>
                </div>

                {formData.platforms.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Platform Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600">Selected Platforms</p>
                        <p className="font-semibold text-blue-900">{formData.platforms.length} platforms</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Estimated Reach</p>
                        <p className="font-semibold text-blue-900">
                          {formData.platforms.length * 5000} - {formData.platforms.length * 15000} users
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Campaign Notes & Instructions</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any special instructions, hashtag strategies, or platform-specific requirements..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleInputChange('status', 'draft')}
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Schedule Campaign
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
