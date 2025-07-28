'use client'

import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InteractiveDemoButtonProps {
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function InteractiveDemoButton({ 
  className, 
  size = "lg", 
  variant = "outline" 
}: InteractiveDemoButtonProps) {
  const handleDemoClick = () => {
    // TODO: Implement demo functionality
    console.log('Demo clicked - implement demo modal or video')
    // For now, just show an alert
    alert('Demo feature coming soon!')
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleDemoClick}
    >
      <Play className="mr-2 h-5 w-5" />
      Watch Demo
    </Button>
  )
}