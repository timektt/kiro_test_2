'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DemoModal } from '@/components/ui/demo-modal'

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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDemoClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handleDemoClick}
        suppressHydrationWarning={true}
      >
        <Play className="mr-2 h-5 w-5" />
        Watch Demo
      </Button>
      
      <DemoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}

export default InteractiveDemoButton