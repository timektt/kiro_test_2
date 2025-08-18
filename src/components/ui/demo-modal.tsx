'use client'

import { useState } from 'react'
import { Play, X, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    features: ['Connect with like-minded people', 'Share your thoughts and experiences', 'Discover new perspectives']
  },
  {
    id: 2,
    title: 'Interactive Feed',
    description: 'Stay updated with posts from your community. Like, comment, share, and bookmark content that matters to you.',
    image: '/demo/feed.svg',
    features: ['Real-time updates', 'Smart filtering', 'Engaging interactions']
  },
  {
    id: 3,
    title: 'Profile & Connections',
    description: 'Build your profile, follow interesting people, and start meaningful conversations.',
    image: '/demo/profile.svg',
    features: ['Customizable profiles', 'Follow system', 'Direct messaging']
  },
  {
    id: 4,
    title: 'MBTI Integration',
    description: 'Connect with people who share your personality type and discover new perspectives.',
    image: '/demo/mbti.svg',
    features: ['Personality-based matching', 'Type-specific communities', 'Better understanding']
  },
  {
    id: 5,
    title: 'Real-time Chat',
    description: 'Engage in real-time conversations with individuals or groups.',
    image: '/demo/chat.svg',
    features: ['Instant messaging', 'Group chats', 'File sharing']
  }
]

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const handlePlayDemo = () => {
    setIsPlaying(true)
    // Auto-advance through steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 3000)
  }

  const currentStepData = demoSteps[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Platform Demo
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
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

                {/* Demo Image/Video Placeholder */}
                <div className="bg-muted/30 rounded-lg p-8 mb-4 flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Interactive demo for {currentStepData.title}
                    </p>
                  </div>
                </div>

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
                  {!isPlaying && currentStep === 0 && (
                    <Button onClick={handlePlayDemo} className="mr-2">
                      <Play className="h-4 w-4 mr-2" />
                      Play Demo
                    </Button>
                  )}
                  
                  {isPlaying && (
                    <Badge variant="secondary" className="mr-2">
                      Playing...
                    </Badge>
                  )}
                </div>

                {currentStep < demoSteps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={isPlaying}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={onClose}>
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