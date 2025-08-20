'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, X, ArrowRight, ArrowLeft, Check, Pause, RotateCcw, Zap, Users, MessageCircle, Heart, Bookmark, Share2 } from 'lucide-react'
import { useDemoAnalytics } from '@/hooks/use-demo-analytics'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

const demoSteps = [
  {
    id: 1,
    title: 'Welcome to Community Platform',
    description: 'Discover a vibrant community where you can connect, share, and grow together.',
    image: '/demo/welcome.svg',
    features: ['Connect with like-minded people', 'Share your thoughts and experiences', 'Discover new perspectives'],
    interactive: {
      type: 'welcome',
      stats: { users: '10K+', posts: '50K+', communities: '100+' }
    }
  },
  {
    id: 2,
    title: 'Interactive Feed',
    description: 'Stay updated with posts from your community. Like, comment, share, and bookmark content that matters to you.',
    image: '/demo/feed.svg',
    features: ['Real-time updates', 'Smart filtering', 'Engaging interactions'],
    interactive: {
      type: 'feed',
      samplePost: {
        author: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        content: 'Just discovered this amazing community! The discussions here are so insightful.',
        likes: 24,
        comments: 8,
        timeAgo: '2h ago'
      }
    }
  },
  {
    id: 3,
    title: 'Profile & Connections',
    description: 'Build your profile, follow interesting people, and start meaningful conversations.',
    image: '/demo/profile.svg',
    features: ['Customizable profiles', 'Follow system', 'Direct messaging'],
    interactive: {
      type: 'profile',
      sampleProfile: {
        name: 'Alex Johnson',
        username: '@alexj',
        bio: 'Tech enthusiast | Coffee lover | Always learning',
        followers: 1234,
        following: 567,
        posts: 89
      }
    }
  },
  {
    id: 4,
    title: 'MBTI Integration',
    description: 'Connect with people who share your personality type and discover new perspectives.',
    image: '/demo/mbti.svg',
    features: ['Personality-based matching', 'Type-specific communities', 'Better understanding'],
    interactive: {
      type: 'mbti',
      personalityTypes: ['INTJ', 'ENFP', 'ISTP', 'ESFJ'],
      matchingScore: 85
    }
  },
  {
    id: 5,
    title: 'Real-time Chat',
    description: 'Engage in real-time conversations with individuals or groups.',
    image: '/demo/chat.svg',
    features: ['Instant messaging', 'Group chats', 'File sharing'],
    interactive: {
      type: 'chat',
      messages: [
        { sender: 'Emma', message: 'Hey! How\'s everyone doing?', time: '10:30 AM' },
        { sender: 'You', message: 'Great! Just finished the demo walkthrough', time: '10:32 AM' },
        { sender: 'Mike', message: 'This platform is amazing!', time: '10:33 AM' }
      ]
    }
  }
]

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playInterval, setPlayInterval] = useState<NodeJS.Timeout | null>(null)
  const [progress, setProgress] = useState(0)
  const [animatedLikes, setAnimatedLikes] = useState(0)
  const [showInteraction, setShowInteraction] = useState(false)
  const [demoStartTime, setDemoStartTime] = useState<number | null>(null)
  
  const analytics = useDemoAnalytics()

  const currentStepData = demoSteps[currentStep]

  // Track demo start when modal opens
  useEffect(() => {
    if (isOpen && !demoStartTime) {
      const startTime = Date.now()
      setDemoStartTime(startTime)
      analytics.trackDemoStart()
    }
  }, [isOpen, demoStartTime, analytics])

  // Track step changes
  useEffect(() => {
    if (isOpen && demoStartTime) {
      analytics.trackDemoStep(currentStep, demoSteps[currentStep]?.title || '')
    }
  }, [currentStep, isOpen, demoStartTime, analytics])

  // Reset animations when step changes
  useEffect(() => {
    setProgress(0)
    setAnimatedLikes(0)
    setShowInteraction(false)
    
    // Start animations after a short delay
    const timer = setTimeout(() => {
      setShowInteraction(true)
      if (currentStepData.interactive?.type === 'feed') {
        // Animate likes counter
        const targetLikes = currentStepData.interactive.samplePost?.likes || 0
        let current = 0
        const increment = targetLikes / 20
        const likeTimer = setInterval(() => {
          current += increment
          if (current >= targetLikes) {
            setAnimatedLikes(targetLikes)
            clearInterval(likeTimer)
          } else {
            setAnimatedLikes(Math.floor(current))
          }
        }, 50)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [currentStep, currentStepData])

  // Progress animation
  useEffect(() => {
    if (showInteraction) {
      const timer = setTimeout(() => {
        setProgress(100)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [showInteraction])

  const handleNext = useCallback(() => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === demoSteps.length - 1 && demoStartTime) {
      // Demo completed
      const totalDuration = Date.now() - demoStartTime
      analytics.trackDemoComplete(totalDuration)
    }
  }, [currentStep, demoStartTime, analytics])

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const handleStepClick = useCallback((stepIndex: number) => {
    if (!isPlaying) {
      setCurrentStep(stepIndex)
      analytics.trackInteraction(stepIndex, 'step_click')
    }
  }, [isPlaying, analytics])

  const handlePlayDemo = useCallback(() => {
    setIsPlaying(true)
    setCurrentStep(0)
    analytics.trackInteraction(currentStep, 'play_button')
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          setPlayInterval(null)
          return prev
        }
        return prev + 1
      })
    }, 4000)
    
    setPlayInterval(interval)
  }, [currentStep, analytics])

  const handlePauseDemo = useCallback(() => {
    if (playInterval) {
      clearInterval(playInterval)
      setPlayInterval(null)
    }
    setIsPlaying(false)
    analytics.trackDemoPause(currentStep)
  }, [playInterval, currentStep, analytics])

  const handleRestartDemo = useCallback(() => {
    if (playInterval) {
      clearInterval(playInterval)
      setPlayInterval(null)
    }
    setIsPlaying(false)
    setCurrentStep(0)
    setDemoStartTime(Date.now())
    analytics.trackDemoRestart()
  }, [playInterval, analytics])

  // Handle modal close with analytics
  const handleClose = useCallback(() => {
    if (demoStartTime) {
      const completed = currentStep === demoSteps.length - 1
      analytics.trackDemoExit(currentStep, completed)
    }
    setDemoStartTime(null)
    onClose()
  }, [currentStep, demoStartTime, analytics, onClose])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playInterval) {
        clearInterval(playInterval)
      }
    }
  }, [playInterval])

  // Interactive content renderers
  const renderInteractiveContent = () => {
    if (!currentStepData.interactive || !showInteraction) {
      return (
        <div className="bg-muted/30 rounded-lg p-8 mb-4 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive demo for {currentStepData.title}
            </p>
          </div>
        </div>
      )
    }

    const { interactive } = currentStepData

    switch (interactive.type) {
      case 'welcome':
        return (
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 mb-4 min-h-[300px]">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Zap className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Welcome to Our Community!</h3>
              <p className="text-muted-foreground">Join thousands of amazing people</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(interactive.stats).map(([key, value], index) => (
                <Card key={key} className={`text-center transform transition-all duration-500 ${showInteraction ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-primary">{value}</div>
                    <div className="text-sm text-muted-foreground capitalize">{key}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'feed':
        const post = interactive.samplePost
        return (
          <div className="bg-background rounded-lg border p-4 mb-4 min-h-[300px]">
            <div className="flex items-start space-x-3 mb-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post?.avatar} />
                <AvatarFallback>{post?.author?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold">{post?.author}</span>
                  <span className="text-sm text-muted-foreground">{post?.timeAgo}</span>
                </div>
                <p className="text-sm mb-3">{post?.content}</p>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 transition-colors">
                    <Heart className={`h-4 w-4 mr-1 ${showInteraction ? 'fill-red-500 text-red-500' : ''} transition-all duration-300`} />
                    <span className="transition-all duration-300">{animatedLikes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post?.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-yellow-500">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )

      case 'profile':
        const profile = interactive.sampleProfile
        return (
          <div className="bg-background rounded-lg border p-6 mb-4 min-h-[300px]">
            <div className="text-center mb-6">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl">{profile?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{profile?.name}</h3>
              <p className="text-muted-foreground">{profile?.username}</p>
              <p className="text-sm mt-2">{profile?.bio}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className={`transform transition-all duration-500 ${showInteraction ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="text-2xl font-bold">{profile?.posts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className={`transform transition-all duration-500 ${showInteraction ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                <div className="text-2xl font-bold">{profile?.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className={`transform transition-all duration-500 ${showInteraction ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                <div className="text-2xl font-bold">{profile?.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </div>
        )

      case 'mbti':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-4 min-h-[300px]">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">MBTI</div>
              <p className="text-muted-foreground">Personality-Based Connections</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {interactive.personalityTypes?.map((type, index) => (
                <Card key={type} className={`text-center cursor-pointer hover:shadow-md transition-all duration-300 ${showInteraction ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                  <CardContent className="p-4">
                    <div className="text-lg font-bold text-purple-600">{type}</div>
                    <div className="text-xs text-muted-foreground">Personality Type</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Compatibility Score</div>
              <div className="text-3xl font-bold text-green-600">{interactive.matchingScore}%</div>
            </div>
          </div>
        )

      case 'chat':
        return (
          <div className="bg-background rounded-lg border p-4 mb-4 min-h-[300px]">
            <div className="space-y-3">
              {interactive.messages?.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} transform transition-all duration-500 ${showInteraction ? 'translate-x-0 opacity-100' : msg.sender === 'You' ? 'translate-x-4 opacity-0' : '-translate-x-4 opacity-0'}`} style={{ transitionDelay: `${index * 300}ms` }}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs opacity-70 mt-1">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex-1 h-10 bg-muted rounded-lg flex items-center px-3">
                <span className="text-sm text-muted-foreground">Type a message...</span>
              </div>
              <Button size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Platform Demo
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Step Navigation */}
          <div className="lg:w-1/4 p-6 border-r bg-muted/30">
            <div className="space-y-2">
              {demoSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-colors',
                    'hover:bg-muted/50',
                    currentStep === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                      currentStep === index
                        ? 'bg-primary-foreground text-primary'
                        : currentStep > index
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {currentStep > index ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="h-full flex flex-col">
              {/* Step Content */}
              <div className="flex-1">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-2">
                    Step {currentStep + 1} of {demoSteps.length}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Interactive Demo Content */}
                {renderInteractiveContent()}

                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {currentStepData.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isPlaying}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {!isPlaying ? (
                    <>
                      <Button onClick={handlePlayDemo} variant="default">
                        <Play className="h-4 w-4 mr-2" />
                        Play Demo
                      </Button>
                      {currentStep > 0 && (
                        <Button onClick={handleRestartDemo} variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restart
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button onClick={handlePauseDemo} variant="secondary">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Badge variant="secondary" className="animate-pulse">
                        Auto-playing...
                      </Badge>
                    </>
                  )}
                </div>

                {currentStep < demoSteps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={isPlaying}
                    variant="outline"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DemoModal